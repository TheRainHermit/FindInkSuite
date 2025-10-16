# models/portfolio.py
from pydantic import BaseModel
from typing import List, Optional

class PortfolioTagOut(BaseModel):
    tag: str

    class Config:
        orm_mode = True

class PortfolioOut(BaseModel):
    id: int
    image_url: str
    description: Optional[str]
    created_at: Optional[str]
    tags: List[PortfolioTagOut] = []

    class Config:
        orm_mode = True