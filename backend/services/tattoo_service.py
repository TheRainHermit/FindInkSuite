from models.orm_models import Portfolio
from sqlalchemy.orm import Session

def get_all_tattoos(db: Session):
    return db.query(Portfolio).all()

def get_tattoo_by_id(db: Session, tattoo_id: int):
    return db.query(Portfolio).filter(Portfolio.id == tattoo_id).first()

def create_tattoo(db: Session, tattoo_data: dict):
    tattoo = Portfolio(**tattoo_data)
    db.add(tattoo)
    db.commit()
    db.refresh(tattoo)
    return tattoo

def update_tattoo(db: Session, tattoo_id: int, tattoo_data: dict):
    tattoo = db.query(Portfolio).filter(Portfolio.id == tattoo_id).first()
    if not tattoo:
        return None
    for key, value in tattoo_data.items():
        setattr(tattoo, key, value)
    db.commit()
    db.refresh(tattoo)
    return tattoo

def delete_tattoo(db: Session, tattoo_id: int):
    tattoo = db.query(Portfolio).filter(Portfolio.id == tattoo_id).first()
    if tattoo:
        db.delete(tattoo)
        db.commit()
        return True
    return False