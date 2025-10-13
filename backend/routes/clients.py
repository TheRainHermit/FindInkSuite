from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from models.orm_models import Client as ClientORM
from services.client_service import (
    get_all_clients,
    get_client_by_id,
    create_client,
    update_client,
    delete_client,
)
from database import get_db

router = APIRouter(prefix="/api/clients", tags=["Clients"])

@router.get("/", response_model=List[dict])
def list_clients(db: Session = Depends(get_db)):
    clients = get_all_clients(db)
    return [client_to_dict(c) for c in clients]

@router.get("/{client_id}", response_model=dict)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = get_client_by_id(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client_to_dict(client)

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_client_endpoint(client: dict, db: Session = Depends(get_db)):
    new_client = create_client(db, client)
    return client_to_dict(new_client)

@router.put("/{client_id}", response_model=dict)
def update_client_endpoint(client_id: int, client: dict, db: Session = Depends(get_db)):
    updated = update_client(db, client_id, client)
    if not updated:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client_to_dict(updated)

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client_endpoint(client_id: int, db: Session = Depends(get_db)):
    deleted = delete_client(db, client_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return

def client_to_dict(client: ClientORM) -> dict:
    return {
        "id": client.id,
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "style": getattr(client, "style", None),
        "notes": client.notes,
        "created_at": client.created_at,
    }