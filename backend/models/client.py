from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Client(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    notes: Optional[str] = None

class ClientCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    notes: Optional[str] = None

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

class ClientOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True