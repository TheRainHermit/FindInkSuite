from fastapi import APIRouter, HTTPException, status, Depends, Body, Request
from typing import List
from sqlalchemy.orm import Session
from models.orm_models import Appointment as AppointmentORM
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

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

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