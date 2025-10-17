from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List, Any
import json

class ClientRegisterRequest(BaseModel):
    name: str
    age: Optional[int]
    gender: Optional[str]
    email: EmailStr
    phone: str
    city: str
    birthdate: str
    tattooed_before: Optional[str]
    favorite_styles: Optional[List[str]]
    color_or_black: Optional[str]
    preferred_artist: Optional[str]
    size: Optional[str]
    body_zone: Optional[str]
    meaning: Optional[str]
    allergies: Optional[str]
    medication: Optional[str]
    pain_sensitivity: Optional[str]
    desired_date: Optional[str]
    preferred_time: Optional[str]
    budget: Optional[str]
    wants_valuation: Optional[bool]
    how_found: Optional[str]
    satisfaction: Optional[str]
    suggestions: Optional[str]
    wants_promos: Optional[bool]
    wants_marketing: Optional[bool]
    wants_referrals: Optional[bool]
    wants_reminders: Optional[bool]
    wants_gallery: Optional[bool]
    visit_frequency: Optional[str]
    avg_tattoo_value: Optional[str]
    favorite_artist: Optional[str]
    most_tattooed_zone: Optional[str]
    most_requested_style: Optional[str]
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