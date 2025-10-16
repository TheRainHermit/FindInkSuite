from fastapi import APIRouter, HTTPException, status, Depends, Query, Request
from typing import List, Optional
from sqlalchemy.orm import Session
from models.orm_models import Portfolio as TattooORM
from models.tattoo import TattooCreate, TattooUpdate, TattooOut
from services.tattoo_service import (
    get_all_tattoos,
    get_tattoo_by_id,
    create_tattoo,
    update_tattoo,
    delete_tattoo,
)
from database import get_db
from routes.auth import get_current_user
from slowapi.util import get_remote_address
from slowapi import Limiter
from services.supabase_service import get_table_rows

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/tattoos", tags=["Tattoos"])

@router.get("/supabase-tattoos")
def get_supabase_tattoos(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede acceder a este recurso")
    return get_table_rows("tattoos")

@router.get("/", response_model=List[TattooOut])
@limiter.limit("30/minute")
def list_tattoos(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    style: Optional[str] = None,
    description: Optional[str] = None,
    artist_id: Optional[int] = None
):
    query = db.query(TattooORM)
    # Filtros avanzados
    if style:
        query = query.filter(TattooORM.style.ilike(f"%{style}%"))
    if description:
        query = query.filter(TattooORM.description.ilike(f"%{description}%"))
    if artist_id:
        query = query.filter(TattooORM.user_id == artist_id)

    # Validación de acceso propio/rol
    if current_user.role == "artist":
        query = query.filter(TattooORM.user_id == current_user.id)
    elif current_user.role not in ["admin", "client"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    tattoos = query.offset(offset).limit(limit).all()
    return tattoos

@router.get("/{tattoo_id}", response_model=TattooOut)
@limiter.limit("30/minute")
def get_tattoo(
    request: Request,
    tattoo_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    tattoo = get_tattoo_by_id(db, tattoo_id)
    if not tattoo:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    return tattoo

@router.post("/", response_model=TattooOut, status_code=status.HTTP_201_CREATED)
def create_tattoo_endpoint(
    request: Request,
    tattoo: TattooCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ["artist", "admin"]:
        raise HTTPException(status_code=403, detail="Solo artistas y admin pueden crear tatuajes")
    tattoo_data = tattoo.dict()
    tattoo_data["user_id"] = current_user.id if current_user.role == "artist" else tattoo_data.get("user_id")
    new_tattoo = create_tattoo(db, tattoo_data)
    return new_tattoo

@router.put("/{tattoo_id}", response_model=TattooOut)
@limiter.limit("10/minute")
def update_tattoo_endpoint(
    request: Request,
    tattoo_id: int,
    tattoo: TattooUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = get_tattoo_by_id(db, tattoo_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    if current_user.role == "artist" and existing.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No puedes editar portafolio de otro artista")
    if current_user.role in ["admin", "artist"]:
        updated = update_tattoo(db, tattoo_id, tattoo.dict(exclude_unset=True))
        return updated
    raise HTTPException(status_code=403, detail="No autorizado")

@router.delete("/{tattoo_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("5/minute")
def delete_tattoo_endpoint(
    request: Request,
    tattoo_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede borrar tatuajes")
    deleted = delete_tattoo(db, tattoo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    return