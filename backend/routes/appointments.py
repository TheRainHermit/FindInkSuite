from fastapi import APIRouter, HTTPException, status, Depends, Body
from typing import List
from sqlalchemy.orm import Session
from models.orm_models import Appointment as AppointmentORM
from services.appointment_service import (
    get_all_appointments,
    get_appointment_by_id,
    create_appointment,
    update_appointment,
    delete_appointment,
    update_appointment_status,
)
from database import get_db

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.get("/", response_model=List[dict])
def list_appointments(db: Session = Depends(get_db)):
    appointments = get_all_appointments(db)
    return [appointment_to_dict(a) for a in appointments]

@router.get("/{appointment_id}", response_model=dict)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return appointment_to_dict(appointment)

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_appointment_endpoint(appointment: dict, db: Session = Depends(get_db)):
    new_appointment = create_appointment(db, appointment)
    return appointment_to_dict(new_appointment)

@router.put("/{appointment_id}", response_model=dict)
def update_appointment_endpoint(appointment_id: int, appointment: dict, db: Session = Depends(get_db)):
    updated = update_appointment(db, appointment_id, appointment)
    if not updated:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return appointment_to_dict(updated)

@router.put("/{appointment_id}/status", response_model=dict)
def update_appointment_status_endpoint(appointment_id: int, status: str = Body(..., embed=True), db: Session = Depends(get_db)):
    updated = update_appointment_status(db, appointment_id, status)
    if not updated:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return appointment_to_dict(updated)

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment_endpoint(appointment_id: int, db: Session = Depends(get_db)):
    deleted = delete_appointment(db, appointment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return

def appointment_to_dict(appointment: AppointmentORM) -> dict:
    return {
        "id": appointment.id,
        "client_id": appointment.client_id,
        "user_id": appointment.user_id,
        "date": appointment.date,
        "duration": appointment.duration,
        "status": appointment.status,
        "notes": appointment.notes,
    }