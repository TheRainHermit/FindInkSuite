
# =============================================================================
# � IMPORTS Y CONFIGURACIÓN
# =============================================================================

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from datetime import datetime
import base64
import uvicorn

# =============================================================================
# 📋 CONFIGURACIÓN Y MODELOS
# =============================================================================

# IPs y puerto
PUBLIC_IP = "190.217.23.26"
LOCAL_IP = "192.168.101.71"
PORT = 8001

# Inicializar FastAPI
app = FastAPI(
    title="🎨 Sistema de Gestión de Tatuajes",
    description="API completa para gestión de tatuajes con CORS configurado",
    version="2.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Modelos Pydantic
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Base de datos simulada
users_db = [
    {"id": 1, "email": "juan@tattoo.com", "password": "123456", "name": "Juan Artista", "role": "artist"},
    {"id": 2, "email": "maria@tattoo.com", "password": "admin123", "name": "María Admin", "role": "admin"}
]

tattoos_db = [
    {"id": 1, "name": "Dragón", "style": "Oriental", "price": 300, "artist": "Juan"},
    {"id": 2, "name": "Rosa", "style": "Realista", "price": 150, "artist": "María"}
]

appointments_db = [
    {"id": 1, "client": "Cliente 1", "tattoo_id": 1, "date": "2025-10-15", "status": "confirmada"},
    {"id": 2, "client": "Cliente 2", "tattoo_id": 2, "date": "2025-10-16", "status": "pendiente"}
]

# Seguridad
security = HTTPBearer()

# =============================================================================
# �🔗 ENDPOINTS PRINCIPALES
# =============================================================================

@app.get("/")
async def root():
    """Endpoint raíz con información del sistema"""
    return {
        "message": "🎨 Sistema de Gestión de Tatuajes",
        "version": "2.0.0",
        "status": "activo",
        "ip_publica": PUBLIC_IP,
        "puerto": PORT,
        "documentacion": f"http://{PUBLIC_IP}:{PORT}/docs"
    }

@app.get("/status")
async def status():
    """Estado del sistema"""
    return {
        "status": "online",
        "timestamp": datetime.now(),
        "ip_publica": PUBLIC_IP,
        "ip_local": LOCAL_IP,
        "puerto": PORT,
        "usuarios_registrados": len(users_db),
        "tatuajes_disponibles": len(tattoos_db),
        "citas_agendadas": len(appointments_db)
    }

@app.get("/api/connection-info")
async def connection_info():
    """Información completa de conexión para el compañero"""
    return {
        "sistema": "🎨 Gestión de Tatuajes",
        "acceso": {
            "ip_publica": PUBLIC_IP,
            "puerto": PORT,
            "base_url": f"http://{PUBLIC_IP}:{PORT}",
            "documentacion": f"http://{PUBLIC_IP}:{PORT}/docs",
            "api_base": f"http://{PUBLIC_IP}:{PORT}/api"
        },
        "endpoints_principales": {
            "login": f"http://{PUBLIC_IP}:{PORT}/api/auth/login",
            "tatuajes": f"http://{PUBLIC_IP}:{PORT}/api/tattoos",
            "citas": f"http://{PUBLIC_IP}:{PORT}/api/appointments",
            "estado": f"http://{PUBLIC_IP}:{PORT}/status"
        },
        "usuarios_prueba": [
            {"email": "juan@tattoo.com", "password": "123456", "rol": "artist"},
            {"email": "maria@tattoo.com", "password": "admin123", "rol": "admin"}
        ],
        "instrucciones": [
            "1. Hacer POST a /api/auth/login con email y password",
            "2. Usar el token devuelto en header Authorization: Bearer <token>",
            "3. Acceder a endpoints protegidos con el token"
        ]
    }

# =============================================================================
# 🔐 ENDPOINTS DE AUTENTICACIÓN
# =============================================================================

@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    """Autenticación de usuario"""
    user = next((u for u in users_db if u["email"] == login_data.email and u["password"] == login_data.password), None)
    
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    # Crear token simple
    import base64
    token = base64.b64encode(f"{login_data.email}:{login_data.password}".encode()).decode()
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }
    }

# =============================================================================
# 🎨 ENDPOINTS DE TATUAJES
# =============================================================================

@app.get("/api/tattoos")
async def get_tattoos():
    """Obtener lista de tatuajes disponibles"""
    return {
        "tattoos": tattoos_db,
        "total": len(tattoos_db)
    }

@app.get("/api/tattoos/{tattoo_id}")
async def get_tattoo(tattoo_id: int):
    """Obtener un tatuaje específico"""
    tattoo = next((t for t in tattoos_db if t["id"] == tattoo_id), None)
    if not tattoo:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    return tattoo

# =============================================================================
# 📅 ENDPOINTS DE CITAS
# =============================================================================

@app.get("/api/appointments")
async def get_appointments():
    """Obtener lista de citas"""
    return {
        "appointments": appointments_db,
        "total": len(appointments_db)
    }

# =============================================================================
# 🧪 ENDPOINTS DE PRUEBA
# =============================================================================

@app.get("/api/cors-test")
async def cors_test():
    """Test de CORS"""
    return {
        "cors_test": "✅ EXITOSO",
        "message": "Si ves este mensaje, CORS está funcionando correctamente",
        "timestamp": datetime.now(),
        "origin_allowed": "*",
        "methods_allowed": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "headers_allowed": ["*"],
        "credentials_allowed": True
    }

@app.post("/api/ai/quick-chat")
async def quick_chat(request: dict):
    """Chat rápido con IA simulada"""
    message = request.get("message", "").lower()
    
    responses = {
        "hola": "¡Hola! ¿En qué puedo ayudarte con tu tatuaje?",
        "test": "✅ Sistema funcionando correctamente",
        "tatuaje": "Ofrecemos diversos estilos: Oriental, Realista, Tradicional...",
        "precio": "Los precios varían según el tamaño y complejidad del diseño",
        "cita": "Puedes agendar una cita contactando a nuestros artistas"
    }
    
    response = "¡Hola! Soy el asistente de tatuajes. ¿En qué puedo ayudarte?"
    
    for keyword, reply in responses.items():
        if keyword in message:
            response = reply
            break
    
    return {
        "response": response,
        "model_used": "tattoo-assistant",
        "processing_time": 0.01,
        "timestamp": datetime.now().isoformat(),
        "status": "success"
    }

# =============================================================================
# 🚀 SERVIDOR
# =============================================================================

if __name__ == "__main__":
    print("🎨 SISTEMA DE GESTIÓN DE TATUAJES")
    print("=" * 50)
    print(f"🌐 IP Pública: {PUBLIC_IP}")
    print(f"🏠 IP Local:   {LOCAL_IP}")
    print(f"🔌 Puerto:     {PORT}")
    print("=" * 50)
    print("✅ CORS: Configurado")
    print("✅ Endpoints: Activos")
    print("✅ Autenticación: Disponible")
    print("=" * 50)
    print(f"🔗 URLs:")
    print(f"   📚 Docs: http://{PUBLIC_IP}:{PORT}/docs")
    print(f"   🧪 Test: http://{PUBLIC_IP}:{PORT}/api/cors-test")
    print(f"   🔐 Login: http://{PUBLIC_IP}:{PORT}/api/auth/login")
    print("=" * 50)
    print("🚀 Iniciando servidor...")
    
    uvicorn.run(
        app, 
        host="0.0.0.0",
        port=PORT,
        access_log=True
    )