from fastapi import APIRouter, HTTPException, status, Depends, Body, Request
from typing import List, Optional
from sqlalchemy.orm import Session
from models.orm_models import Appointment as AppointmentORM, Client, User
from models.appointment import AppointmentCreate, AppointmentUpdate, AppointmentOut
from services.appointment_service import (
    get_all_appointments,
    get_appointment_by_id,
    create_appointment,
    update_appointment,
    delete_appointment,
    update_appointment_status,
)
from database import get_db
from routes.auth import get_current_user
from slowapi.util import get_remote_address
from slowapi import Limiter
from services.supabase_service import get_table_rows
from pydantic import BaseModel
from sqlalchemy import func

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

class AppointmentRequest(BaseModel):
    client_id: int
    artist_id: int
    date: str  # formato ISO: "2025-10-20T15:00"
    duration: Optional[int] = None
    notes: Optional[str] = None

@router.post("/request", status_code=status.HTTP_201_CREATED)
def request_appointment(data: AppointmentRequest, db: Session = Depends(get_db)):
    # Verifica que el cliente exista
    client = db.query(Client).filter(Client.id == data.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    # Verifica que el artista exista
    artist = db.query(User).filter(User.id == data.artist_id, User.role == "artist").first()
    if not artist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    # Validación de solapamiento de citas
    from datetime import datetime, timedelta

    # Duración por defecto: 1 hora si no se especifica
    duration = data.duration if data.duration else 60
    start_time = datetime.fromisoformat(data.date)
    end_time = start_time + timedelta(minutes=duration)

    overlapping = db.query(AppointmentORM).filter(
        AppointmentORM.user_id == data.artist_id,
        AppointmentORM.status.in_(["scheduled", "confirmed"]),
        AppointmentORM.date < end_time,
        (AppointmentORM.date + func.coalesce(AppointmentORM.duration, 60) * func.interval('1 minute')) > start_time
    ).first()

    if overlapping:
        raise HTTPException(
            status_code=409,
            detail="El artista ya tiene una cita en ese horario. Por favor elige otro horario."
        )

    # Crea la cita en estado "scheduled"
    appointment = AppointmentORM(
        client_id=data.client_id,
        user_id=data.artist_id,
        date=data.date,
        duration=data.duration,
        status="scheduled",
        notes=data.notes
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return {"message": "Solicitud de cita enviada. Un tatuador revisará tu solicitud.", "appointment_id": appointment.id}

@router.get("/supabase-appointments")
def get_supabase_appointments(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede acceder a este recurso")
    return get_table_rows("appointments")

@router.get("/", response_model=List[AppointmentOut])
@limiter.limit("30/minute")
def list_appointments(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role == "admin":
        appointments = get_all_appointments(db)
    elif current_user.role == "artist":
        appointments = db.query(AppointmentORM).filter(
            AppointmentORM.user_id == current_user.id
        ).all()
    elif current_user.role == "client":
        appointments = db.query(AppointmentORM).filter(
            AppointmentORM.client_id == current_user.id
        ).all()
    else:
        raise HTTPException(status_code=403, detail="No autorizado")
    return appointments

@router.get("/{appointment_id}", response_model=AppointmentOut)
@limiter.limit("30/minute")
def get_appointment(
    request: Request,
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    appointment = get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    if current_user.role == "client" and appointment.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta cita")
    if current_user.role == "artist" and appointment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta cita")
    return appointment

@router.post("/", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def create_appointment_endpoint(
    request: Request,
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "client":
        raise HTTPException(status_code=403, detail="Solo clientes pueden crear citas")
    appointment_data = appointment.dict()
    appointment_data["client_id"] = current_user.id
    new_appointment = create_appointment(db, appointment_data)
    return new_appointment

@router.put("/{appointment_id}", response_model=AppointmentOut)
@limiter.limit("5/minute")
def update_appointment_endpoint(
    request: Request,
    appointment_id: int,
    appointment: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = get_appointment_by_id(db, appointment_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    if current_user.role == "artist" and existing.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No puedes editar citas de otro artista")
    if current_user.role == "admin" or (current_user.role == "artist" and existing.user_id == current_user.id):
        updated = update_appointment(db, appointment_id, appointment.dict(exclude_unset=True))
        return updated
    raise HTTPException(status_code=403, detail="No autorizado")

@router.put("/{appointment_id}/status", response_model=AppointmentOut)
@limiter.limit("5/minute")
def update_appointment_status_endpoint(
    request: Request,
    appointment_id: int,
    status: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = get_appointment_by_id(db, appointment_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    if current_user.role == "artist" and existing.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No puedes cambiar el estado de citas de otro artista")
    if current_user.role == "admin" or (current_user.role == "artist" and existing.user_id == current_user.id):
        updated = update_appointment_status(db, appointment_id, status)
        return updated
    raise HTTPException(status_code=403, detail="No autorizado")

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("5/minute")
def delete_appointment_endpoint(
    request: Request,
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede borrar citas")
    deleted = delete_appointment(db, appointment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return

@router.put("/{appointment_id}/decision", response_model=AppointmentOut)
def decide_appointment(
    appointment_id: int,
    decision: str = Body(..., embed=True, description="accepted o rejected"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    appointment = get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    # Solo el artista asignado o admin puede decidir
    if current_user.role == "artist" and appointment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No autorizado")
    if decision not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Decisión inválida")
    # Actualiza el estado
    updated = update_appointment_status(db, appointment_id, decision)
    # Notifica al cliente (ver siguiente punto)
    #notify_client_of_decision(db, appointment, decision)
    return updated