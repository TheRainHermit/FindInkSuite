from models.orm_models import Client

def get_all_clients(db):
    return db.query(Client).all()

def create_client(db, client_data):
    client = Client(**client_data)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

def get_client_by_id(db, client_id: int):
    return db.query(Client).filter(Client.id == client_id).first()

def update_client(db, client_id: int, client_data):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        return None
    for key, value in client_data.items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client

def delete_client(db, client_id: int):
    client = db.query(Client).filter(Client.id == client_id).first()
    if client:
        db.delete(client)
        db.commit()
        return True
    return False