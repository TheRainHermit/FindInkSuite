from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.orm_models import Appointment
from fastapi import HTTPException

def get_all_appointments(db: Session):
    return db.query(Appointment).all()

def get_appointment_by_id(db: Session, appointment_id: int):
    return db.query(Appointment).filter(Appointment.id == appointment_id).first()

def is_overlapping(db: Session, user_id: int, date: str):
    # Busca citas del artista en el mismo horario y estado activo
    return db.query(Appointment).filter(
        Appointment.user_id == user_id,
        Appointment.date == date,
        Appointment.status.in_(["pending", "accepted", "confirmed"])
    ).first() is not None

def create_appointment(db: Session, client_id: int, user_id: int, date, duration=None, notes=None):
    if is_overlapping(db, user_id, date):
        raise HTTPException(status_code=409, detail="Ya existe una cita para ese tatuador en ese horario.")
    appointment = Appointment(
        client_id=client_id,
        user_id=user_id,
        date=date,
        duration=duration,
        notes=notes,
        status="pending"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

def update_appointment(db: Session, appointment_id: int, appointment_data: dict):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        return None
    for key, value in appointment_data.items():
        setattr(appointment, key, value)
    db.commit()
    db.refresh(appointment)
    return appointment

def delete_appointment(db: Session, appointment_id: int):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if appointment:
        db.delete(appointment)
        db.commit()
        return True
    return False

def update_appointment_status(db: Session, appointment_id: int, status: str):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        return None
    appointment.status = status
    db.commit()
    db.refresh(appointment)
    return appointment