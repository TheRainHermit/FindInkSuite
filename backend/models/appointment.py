from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AppointmentCreate(BaseModel):
    user_id: int  # id del tatuador
    date: datetime
    duration: Optional[int] = None
    notes: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    client_id: int
    user_id: int
    date: datetime
    duration: Optional[int]
    status: str
    notes: Optional[str]

class AppointmentUpdate(BaseModel):
    date: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

    class Config:
        orm_mode = True

