from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/ai", tags=["AI"])

# Modelos para las peticiones/respuestas de IA
class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "ollama-default"

class ChatResponse(BaseModel):
    response: str

class DesignSuggestionRequest(BaseModel):
    preferences: str

class DesignSuggestionResponse(BaseModel):
    suggestions: List[str]

@router.get("/status")
def ai_status():
    return {"status": "ok", "message": "IA disponible"}

@router.get("/models")
def ai_models():
    # Simulación de modelos disponibles
    return {"models": ["ollama-default", "ollama-tattoo", "ollama-chat"]}

@router.post("/chat", response_model=ChatResponse)
def ai_chat(request: ChatRequest):
    # Simulación de respuesta de IA
    return {"response": f"Respuesta simulada para: {request.message}"}

@router.post("/design-suggestions", response_model=DesignSuggestionResponse)
def design_suggestions(request: DesignSuggestionRequest):
    # Simulación de sugerencias de diseño
    return {
        "suggestions": [
            f"Tatuaje sugerido para: {request.preferences} #1",
            f"Tatuaje sugerido para: {request.preferences} #2"
        ]
    }