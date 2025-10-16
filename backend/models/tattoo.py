from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Tattoo(BaseModel):
    id: int
    name: str
    artist: str
    style: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None

class TattooCreate(BaseModel):
    client_id: Optional[int] = None
    image_url: str
    description: Optional[str] = None

class TattooUpdate(BaseModel):
    image_url: Optional[str] = None
    description: Optional[str] = None

class TattooOut(BaseModel):
    id: int
    user_id: int
    client_id: Optional[int]
    image_url: str
    description: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True