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
    client_name: str
    tattoo_artist: str
    date: datetime
    notes: Optional[str] = None