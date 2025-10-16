from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "ollama-default"

class ChatResponse(BaseModel):
    response: str

class DesignSuggestionRequest(BaseModel):
    preferences: str

class DesignSuggestionResponse(BaseModel):
    suggestions: List[str]

class AssistantMessageCreate(BaseModel):
    message: str
    client_id: Optional[int] = None

class AssistantMessageOut(BaseModel):
    id: int
    user_id: int
    client_id: Optional[int]
    message: str
    created_at: datetime

    class Config:
        orm_mode = True