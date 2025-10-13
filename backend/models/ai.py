from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "ollama-default"

class ChatResponse(BaseModel):
    response: str

class DesignSuggestionRequest(BaseModel):
    preferences: str

class DesignSuggestionResponse(BaseModel):
    suggestions: List[str]