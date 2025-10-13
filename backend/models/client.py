from pydantic import BaseModel, EmailStr
from typing import Optional

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