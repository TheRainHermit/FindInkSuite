# routes/portfolio.py
from fastapi import APIRouter, HTTPException, status, Depends, Query, Request, Body, UploadFile, File
import shutil
import os
from uuid import uuid4
from typing import List, Optional
from sqlalchemy.orm import Session
from models.orm_models import Portfolio as PortfolioORM, PortfolioTag as PortfolioTagORM, User as UserORM
from models.portfolio import PortfolioOut
from database import get_db
from routes.auth import get_current_user
from slowapi.util import get_remote_address
from slowapi import Limiter
from pydantic import BaseModel

UPLOAD_DIR = "uploads/portfolio"

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/portfolio", tags=["Portfolio"])

class PortfolioCreate(BaseModel):
    image_url: str
    description: Optional[str] = None
    tags: Optional[List[str]] = []

class PortfolioUpdate(BaseModel):
    image_url: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

@router.get("/", response_model=List[PortfolioOut])
@limiter.limit("30/minute")
def get_portfolio(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    user_id: Optional[int] = Query(None, description="ID del artista"),
    tag: Optional[str] = Query(None, description="Filtrar por tag"),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    # Solo admin, el propio artista o público pueden ver portafolios
    if current_user.role == "artist":
        if user_id and user_id != current_user.id:
            raise HTTPException(status_code=403, detail="No autorizado para ver el portafolio de otro artista")
        user_id = current_user.id  # Forzar a ver solo su propio portafolio

    query = db.query(PortfolioORM)
    if user_id:
        query = query.filter(PortfolioORM.user_id == user_id)
    if tag:
        query = query.join(PortfolioORM.tags).filter(PortfolioTagORM.tag.ilike(f"%{tag}%"))
    portfolios = query.offset(offset).limit(limit).all()
    return portfolios

@router.get("/{portfolio_id}", response_model=PortfolioOut)
@limiter.limit("30/minute")
def get_portfolio_item(
    request: Request,
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    portfolio = db.query(PortfolioORM).filter(PortfolioORM.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portafolio no encontrado")
    # Solo admin, el propio artista o el cliente relacionado pueden ver el item
    if current_user.role == "artist" and portfolio.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No autorizado")
    if current_user.role == "client" and portfolio.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="No autorizado")
    return portfolio

@router.post("/", response_model=PortfolioOut, status_code=201)
@limiter.limit("10/minute")
def create_portfolio(
    request: Request,
    data: PortfolioCreate = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "artist":
        raise HTTPException(status_code=403, detail="Solo artistas pueden crear portafolio")
    portfolio = PortfolioORM(
        user_id=current_user.id,
        image_url=data.image_url,
        description=data.description,
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    if data.tags:
        for tag in data.tags:
            tag_obj = PortfolioTagORM(portfolio_id=portfolio.id, tag=tag)
            db.add(tag_obj)
        db.commit()
    db.refresh(portfolio)
    return portfolio

@router.put("/{portfolio_id}", response_model=PortfolioOut)
@limiter.limit("10/minute")
def update_portfolio(
    request: Request,
    portfolio_id: int,
    data: PortfolioUpdate = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    portfolio = db.query(PortfolioORM).filter(PortfolioORM.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portafolio no encontrado")
    if current_user.role != "admin" and portfolio.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No autorizado")
    if data.image_url is not None:
        portfolio.image_url = data.image_url
    if data.description is not None:
        portfolio.description = data.description
    db.commit()
    if data.tags is not None:
        db.query(PortfolioTagORM).filter(PortfolioTagORM.portfolio_id == portfolio.id).delete()
        for tag in data.tags:
            tag_obj = PortfolioTagORM(portfolio_id=portfolio.id, tag=tag)
            db.add(tag_obj)
        db.commit()
    db.refresh(portfolio)
    return portfolio

@router.delete("/{portfolio_id}", status_code=204)
@limiter.limit("10/minute")
def delete_portfolio(
    request: Request,
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    portfolio = db.query(PortfolioORM).filter(PortfolioORM.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portafolio no encontrado")
    if current_user.role != "admin" and portfolio.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No autorizado")
    db.delete(portfolio)
    db.commit()
    return

@router.post("/upload-image", status_code=201)
@limiter.limit("10/minute")
def upload_image(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    if current_user.role != "artist":
        raise HTTPException(status_code=403, detail="Solo artistas pueden subir imágenes")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Devuelve la ruta relativa o URL pública según tu configuración
    return {"image_url": f"/static/portfolio/{filename}"}