from fastapi import FastAPI
from routes import auth, tattoos, appointments, clients, ai

app = FastAPI(
    title="🎨 Sistema de Gestión de Tatuajes",
    description="API completa para gestión de tatuajes y citas",
    version="2.0.0"
)

app.include_router(auth.router)
app.include_router(tattoos.router)
app.include_router(appointments.router)
app.include_router(clients.router)
app.include_router(ai.router)