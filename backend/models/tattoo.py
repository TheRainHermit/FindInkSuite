from pydantic import BaseModel
from typing import Optional

class Tattoo(BaseModel):
    id: int
    name: str
    artist: str
    style: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None

class TattooCreate(BaseModel):
    name: str
    artist: str
    style: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None