import json
from sqlalchemy.orm import Session
from models.orm_models import User
from database import SessionLocal

with open("../data/artists.json", "r", encoding="utf-8") as f:
    artists = json.load(f)

db: Session = SessionLocal()
for artist in artists:
    user = User(
        name=artist["name"],
        email=artist["email"],
        password_hash="hash",  # Usa un hash real si es necesario
        role="artist",
        phone=artist.get("phone"),
        profile_image_url=artist.get("profile_image_url"),
        city=artist.get("city"),
        specialties=artist.get("specialties"),
        profile_url=artist.get("profile_url"),
        gallery_images=artist.get("gallery_images"),
    )
    db.add(user)
db.commit()
db.close()