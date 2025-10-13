from models.orm_models import Appointment
from sqlalchemy.orm import Session

def get_all_appointments(db: Session):
    return db.query(Appointment).all()

def get_appointment_by_id(db: Session, appointment_id: int):
    return db.query(Appointment).filter(Appointment.id == appointment_id).first()

def create_appointment(db: Session, appointment_data: dict):
    appointment = Appointment(**appointment_data)
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