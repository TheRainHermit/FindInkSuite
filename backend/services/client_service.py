from models.orm_models import Client

def get_all_clients(db):
    return db.query(Client).all()

def create_client(db, client_data):
    client = Client(**client_data)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client