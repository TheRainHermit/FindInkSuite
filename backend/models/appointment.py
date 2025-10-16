from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Appointment(BaseModel):
    id: int
    client_name: str
    tattoo_artist: str
    date: datetime
    status: str = "pendiente"
    notes: Optional[str] = None

class AppointmentCreate(BaseModel):
    user_id: int
    date: datetime
    duration: Optional[int] = None
    status: Optional[str] = "scheduled"
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    date: Optional[datetime] = None
    duration: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    client_id: int
    user_id: int
    date: datetime
    duration: Optional[int]
    status: str
    notes: Optional[str]