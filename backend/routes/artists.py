from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from models.orm_models import User as UserORM
from models.user import UserOut
from database import get_db
from routes.auth import get_current_user

router = APIRouter(prefix="/api/artists", tags=["Artists"])

@router.get("/", response_model=List[UserOut])
def list_artists(
    request: Request,
    db: Session = Depends(get_db),
    city: Optional[str] = None,
    specialty: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    query = db.query(UserORM).filter(UserORM.role == "artist")
    if city:
        query = query.filter(UserORM.city.ilike(f"%{city}%"))
    if specialty:
        query = query.filter(UserORM.specialties.any(specialty))
    artists = query.offset(offset).limit(limit).all()
    return artists

@router.get("/{artist_id}", response_model=UserOut)
def get_artist(
    request: Request,
    artist_id: int,
    db: Session = Depends(get_db)
):
    artist = db.query(UserORM).filter(UserORM.id == artist_id, UserORM.role == "artist").first()
    if not artist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    return artist