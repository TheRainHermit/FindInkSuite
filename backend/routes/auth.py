import logging
from fastapi import APIRouter, HTTPException, status, Depends, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from slowapi.util import get_remote_address
from slowapi import Limiter
from models.user import UserOut, RegisterRequest, LoginRequest, TokenResponse
from database import get_db
from services.auth_service import (
    authenticate_user,
    get_password_hash,
    create_access_token,
    get_current_user
)
from services.supabase_service import get_table_rows

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@router.get("/supabase-users")
def get_supabase_users(current_user=Depends(lambda token=Depends(oauth2_scheme), db=Depends(get_db): get_current_user(token, db))):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede acceder a este recurso")
    return get_table_rows("users")

@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(request: Request, body: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, body.email, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )
    access_token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserOut)
@limiter.limit("3/minute")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    hashed_password = get_password_hash(request.password)
    new_user = User(
        name=request.name,
        email=request.email,
        password_hash=hashed_password,
        role="client"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/me", response_model=UserOut)
def get_me(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(lambda token=Depends(oauth2_scheme), db=Depends(get_db): get_current_user(token, db))
):
    return current_user