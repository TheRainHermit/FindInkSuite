from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi import FastAPI
from slowapi.errors import RateLimitExceeded
from routes import auth, tattoos, appointments, clients, ai

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="🎨 Sistema de Gestión de Tatuajes",
    description="API completa para gestión de tatuajes y citas",
    version="2.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.include_router(auth.router)
app.include_router(tattoos.router)
app.include_router(appointments.router)
app.include_router(clients.router)
app.include_router(ai.router)