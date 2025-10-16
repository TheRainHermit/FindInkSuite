from fastapi import APIRouter, HTTPException, status, Depends, Request
from typing import List
from sqlalchemy.orm import Session
from models.orm_models import AssistantMessage as AssistantMessageORM
from models.ai import AssistantMessageCreate, AssistantMessageOut
from services.ai_service import (
    get_all_assistant_messages,
    create_assistant_message,
)
from database import get_db
from routes.auth import get_current_user
from slowapi.util import get_remote_address
from slowapi import Limiter
from services.supabase_service import get_table_rows

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/ai", tags=["AI"])

@router.get("/supabase-messages")
def get_supabase_ai_messages(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin puede acceder a este recurso")
    return get_table_rows("assistant_messages")

@router.get("/assistant-messages", response_model=List[AssistantMessageOut])
@limiter.limit("30/minute")
def list_assistant_messages(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role in ["admin", "artist"]:
        messages = get_all_assistant_messages(db)
    elif current_user.role == "client":
        messages = db.query(AssistantMessageORM).filter(
            AssistantMessageORM.user_id == current_user.id
        ).all()
    else:
        raise HTTPException(status_code=403, detail="No autorizado")
    return messages

@router.post("/assistant-messages", response_model=AssistantMessageOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def create_assistant_message_endpoint(
    request: Request,
    message: AssistantMessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    message_data = message.dict()
    message_data["user_id"] = current_user.id
    new_message = create_assistant_message(db, message_data)
    return new_message