from models.orm_models import AssistantMessage
from sqlalchemy.orm import Session

def get_all_assistant_messages(db: Session):
    return db.query(AssistantMessage).all()

def create_assistant_message(db: Session, message_data: dict):
    message = AssistantMessage(**message_data)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message