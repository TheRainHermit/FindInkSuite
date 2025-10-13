from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from models.orm_models import Portfolio as TattooORM
from services.tattoo_service import (
    get_all_tattoos,
    get_tattoo_by_id,
    create_tattoo,
    update_tattoo,
    delete_tattoo,
)
from database import get_db

router = APIRouter(prefix="/api/tattoos", tags=["Tattoos"])

@router.get("/", response_model=List[dict])
def list_tattoos(db: Session = Depends(get_db)):
    tattoos = get_all_tattoos(db)
    return [tattoo_to_dict(t) for t in tattoos]

@router.get("/{tattoo_id}", response_model=dict)
def get_tattoo(tattoo_id: int, db: Session = Depends(get_db)):
    tattoo = get_tattoo_by_id(db, tattoo_id)
    if not tattoo:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    return tattoo_to_dict(tattoo)

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_tattoo_endpoint(tattoo: dict, db: Session = Depends(get_db)):
    new_tattoo = create_tattoo(db, tattoo)
    return tattoo_to_dict(new_tattoo)

@router.put("/{tattoo_id}", response_model=dict)
def update_tattoo_endpoint(tattoo_id: int, tattoo: dict, db: Session = Depends(get_db)):
    updated = update_tattoo(db, tattoo_id, tattoo)
    if not updated:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    return tattoo_to_dict(updated)

@router.delete("/{tattoo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tattoo_endpoint(tattoo_id: int, db: Session = Depends(get_db)):
    deleted = delete_tattoo(db, tattoo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    return

def tattoo_to_dict(tattoo: TattooORM) -> dict:
    return {
        "id": tattoo.id,
        "user_id": tattoo.user_id,
        "client_id": tattoo.client_id,
        "image_url": tattoo.image_url,
        "description": tattoo.description,
        "created_at": tattoo.created_at,
    }