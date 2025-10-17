from fastapi import APIRouter, HTTPException, status, Depends, Query, Request, UploadFile, File, Form
from typing import List, Optional
from sqlalchemy.orm import Session
from models.orm_models import Client as ClientORM, Appointment as AppointmentORM
from models.client import ClientCreate, ClientUpdate, ClientOut
from models.orm_models import Client
from models.user import ClientRegisterRequest
from models.appointment import AppointmentOut
from services.client_service import (
    get_all_clients,
    get_client_by_id,
    create_client,
    update_client,
    delete_client,
)
from database import get_db
from routes.auth import get_current_user
from slowapi.util import get_remote_address
from slowapi import Limiter
from services.supabase_service import get_table_rows
from services.notification_service import notify_client_of_decision
import shutil
import os
import json

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/clients", tags=["Clients"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_client(
    name: str = Form(...),
    age: int = Form(None),
    gender: str = Form(None),
    email: str = Form(...),
    phone: str = Form(...),
    city: str = Form(...),
    birthdate: str = Form(...),
    tattooedBefore: str = Form(None),
    favoriteStyles: str = Form(None),  # Recibido como JSON string
    colorOrBlack: str = Form(None),
    preferredArtist: str = Form(None),
    size: str = Form(None),
    bodyZone: str = Form(None),
    meaning: str = Form(None),
    allergies: str = Form(None),
    medication: str = Form(None),
    painSensitivity: str = Form(None),
    desiredDate: str = Form(None),
    preferredTime: str = Form(None),
    budget: str = Form(None),
    wantsValuation: bool = Form(False),
    howFound: str = Form(None),
    satisfaction: str = Form(None),
    suggestions: str = Form(None),
    wantsPromos: bool = Form(False),
    wantsMarketing: bool = Form(False),
    wantsReferrals: bool = Form(False),
    wantsReminders: bool = Form(False),
    wantsGallery: bool = Form(False),
    visitFrequency: str = Form(None),
    avgTattooValue: str = Form(None),
    favoriteArtist: str = Form(None),
    mostTattooedZone: str = Form(None),
    mostRequestedStyle: str = Form(None),
    referenceImage: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Verifica si el email ya existe
    if db.query(Client).filter(Client.email == email).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    # Guarda la imagen si se envió
    image_url = None
    if referenceImage:
        folder = "static/references"
        os.makedirs(folder, exist_ok=True)
        file_path = os.path.join(folder, referenceImage.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(referenceImage.file, buffer)
        image_url = f"/{file_path}"

    # Procesa favoriteStyles
    favorite_styles = json.loads(favoriteStyles) if favoriteStyles else []

    # Guarda los campos básicos y el resto en preferences (JSON)
    preferences = {
        "tattooed_before": tattooedBefore,
        "favorite_styles": favorite_styles,
        "color_or_black": colorOrBlack,
        "preferred_artist": preferredArtist,
        "size": size,
        "body_zone": bodyZone,
        "meaning": meaning,
        "allergies": allergies,
        "medication": medication,
        "pain_sensitivity": painSensitivity,
        "desired_date": desiredDate,
        "preferred_time": preferredTime,
        "budget": budget,
        "wants_valuation": wantsValuation,
        "how_found": howFound,
        "satisfaction": satisfaction,
        "suggestions": suggestions,
        "wants_promos": wantsPromos,
        "wants_marketing": wantsMarketing,
        "wants_referrals": wantsReferrals,
        "wants_reminders": wantsReminders,
        "wants_gallery": wantsGallery,
        "visit_frequency": visitFrequency,
        "avg_tattoo_value": avgTattooValue,
        "favorite_artist": favoriteArtist,
        "most_tattooed_zone": mostTattooedZone,
        "most_requested_style": mostRequestedStyle,
        "reference_image_url": image_url,
    }

    client = Client(
        name=name,
        age=age,
        gender=gender,
        email=email,
        phone=phone,
        city=city,
        birthdate=birthdate,
        preferences=preferences
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return {"message": "Registro exitoso. Pronto un tatuador revisará tu solicitud."}

@router.get("/supabase-clients")
def get_supabase_clients(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede acceder a este recurso")
    return get_table_rows("clients")

@router.get("/", response_model=List[ClientOut])
@limiter.limit("20/minute")
def list_clients(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    name: Optional[str] = None,
    email: Optional[str] = None
):
    print("current_user:", current_user)
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede ver todos los clientes")
    query = db.query(ClientORM)
    if name:
        query = query.filter(ClientORM.name.ilike(f"%{name}%"))
    if email:
        query = query.filter(ClientORM.email.ilike(f"%{email}%"))
    clients = query.offset(offset).limit(limit).all()
    return clients

@router.get("/{client_id}", response_model=ClientOut)
@limiter.limit("30/minute")
def get_client(
    request: Request,
    client_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    client = get_client_by_id(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    if current_user.role == "admin":
        return client
    elif current_user.role == "artist":
        has_appointment = db.query(AppointmentORM).filter(
            AppointmentORM.client_id == client.id,
            AppointmentORM.user_id == current_user.id
        ).first()
        if has_appointment:
            return client
        else:
            raise HTTPException(status_code=403, detail="No autorizado")
    elif current_user.role == "client" and client.id == current_user.id:
        return client
    else:
        raise HTTPException(status_code=403, detail="No autorizado")

@router.get("/{client_id}/appointments", response_model=List[AppointmentOut])
@limiter.limit("30/minute")
def get_client_appointments(
    request: Request,
    client_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    # Solo admin, el cliente o artista con cita pueden ver
    if current_user.role == "client" and current_user.id != client_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    if current_user.role == "artist":
        has_appointment = db.query(AppointmentORM).filter(
            AppointmentORM.client_id == client_id,
            AppointmentORM.user_id == current_user.id
        ).first()
        if not has_appointment:
            raise HTTPException(status_code=403, detail="No autorizado")
    query = db.query(AppointmentORM).filter(AppointmentORM.client_id == client_id)
    appointments = query.offset(offset).limit(limit).all()
    return appointments

@router.post("/", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def create_client_endpoint(
    request: Request,
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede crear clientes")
    new_client = create_client(db, client.dict())
    return new_client

@router.put("/{client_id}", response_model=ClientOut)
@limiter.limit("5/minute")
def update_client_endpoint(
    request: Request,
    client_id: int,
    client: ClientUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede editar clientes")
    updated = update_client(db, client_id, client.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return updated

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("5/minute")
def delete_client_endpoint(
    request: Request,
    client_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede borrar clientes")
    deleted = delete_client(db, client_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_client(data: ClientRegisterRequest, db: Session = Depends(get_db)):
    # Verifica si el email ya existe
    if db.query(Client).filter(Client.email == data.email).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    client = Client(
        name=data.name,
        age=data.age,
        gender=data.gender,
        email=data.email,
        phone=data.phone,
        city=data.city,
        birthdate=data.birthdate,
        preferences=data.dict(exclude={"name", "age", "gender", "email", "phone", "city", "birthdate"})
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return {"message": "Registro exitoso. Pronto un tatuador revisará tu solicitud."}