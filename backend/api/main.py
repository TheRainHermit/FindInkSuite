from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.clients import router as clients_router
from routes.tattoos import router as tattoos_router
from routes.appointments import router as appointments_router
from routes.auth import router as auth_router
from routes.ai import router as ai_router

PORT = 8001

app = FastAPI(
    title="🎨 Sistema de Gestión de Tatuajes",
    description="API modular para FindInkSuite",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth_router)
app.include_router(clients_router)
app.include_router(tattoos_router)
app.include_router(appointments_router)
app.include_router(ai_router)

@app.get("/")
async def root():
    return {
        "message": "🎨 Sistema de Gestión de Tatuajes",
        "version": "2.0.0",
        "status": "activo",
        "documentacion": f"http://localhost:{PORT}/docs"
    }

@app.get("/status")
async def status():
    return {
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=PORT,
        access_log=True
    )