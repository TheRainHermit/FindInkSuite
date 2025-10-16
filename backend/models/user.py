from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List, Any
import json

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    phone: Optional[str] = None
    profile_image_url: Optional[str] = None
    city: Optional[str] = None
    specialties: Optional[List[str]] = None
    profile_url: Optional[str] = None
    gallery_images: Optional[Any] = None

    @field_validator("gallery_images", mode="before")
    def parse_gallery_images(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v

    class Config:
        orm_mode = True