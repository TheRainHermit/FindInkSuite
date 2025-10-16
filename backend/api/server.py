#!/usr/bin/env python3
"""
🎨 SERVIDOR DE GESTIÓN DE TATUAJES - IP PÚBLICA DIRECTA (Puerto 8001)
=====================================================================
Sistema completo para gestión de tatuajes con acceso vía IP)

# =============================================================================
# 🔗 ENDPOINTS PRINCIPALES
# ============================================================================= 8001 para evitar conflictos
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import uvicorn
import json
import requests
import asyncio
from typing import Literal

# =============================================================================
# 🌐 CONFIGURACIÓN DE RED
# =============================================================================
PUBLIC_IP = "190.217.23.26"
LOCAL_IP = "192.168.101.71"
PORT = 8001

# =============================================================================
# 📋 MODELOS DE DATOS
# =============================================================================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str

class TattooCreate(BaseModel):
    name: str
    description: str
    price: float
    duration_hours: int
    style: str
    size: str

class TattooResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    duration_hours: int
    style: str
    size: str
    created_at: datetime

class AppointmentCreate(BaseModel):
    client_name: str
    client_email: EmailStr
    client_phone: str
    tattoo_id: int
    preferred_date: date
    notes: Optional[str] = ""

class AppointmentResponse(BaseModel):
    id: int
    client_name: str
    client_email: str
    client_phone: str
    tattoo_id: int
    tattoo_name: str
    preferred_date: date
    status: str
    notes: str
    created_at: datetime

class ClientCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    notes: Optional[str] = ""

class ClientResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    notes: str
    created_at: datetime

# =============================================================================
# 🤖 MODELOS DE OLLAMA IA
# =============================================================================

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "phi"  # Cambiado a phi por defecto (más rápido)
    context: Optional[str] = ""

class ChatResponse(BaseModel):
    response: str
    model_used: str
    processing_time: float
    timestamp: datetime
    
class ErrorResponse(BaseModel):
    error: str
    detail: str
    model_tried: str
    suggestions: List[str]
    timestamp: datetime

class TattooAIRequest(BaseModel):
    client_message: str
    tattoo_context: Optional[str] = ""
    model: Literal["phi", "mistral", "llama2:7b-chat"] = "mistral"

class TattooAIResponse(BaseModel):
    ai_response: str
    recommendations: List[str]
    model_used: str
    processing_time: float

# =============================================================================
# 🗃️ BASE DE DATOS EN MEMORIA
# =============================================================================
users_db = [
    {"id": 1, "email": "juan@tattoo.com", "password": "123456", "name": "Juan Artista", "role": "artist"},
    {"id": 2, "email": "maria@tattoo.com", "password": "admin123", "name": "María Admin", "role": "admin"}
]

tattoos_db = [
    {
        "id": 1,
        "name": "Dragón Tradicional",
        "description": "Dragón japonés tradicional en brazo completo",
        "price": 800.0,
        "duration_hours": 8,
        "style": "Tradicional Japonés",
        "size": "Grande",
        "created_at": datetime.now()
    },
    {
        "id": 2,
        "name": "Rosa Realista",
        "description": "Rosa realista en antebrazo",
        "price": 300.0,
        "duration_hours": 3,
        "style": "Realismo",
        "size": "Mediano",
        "created_at": datetime.now()
    }
]

appointments_db = []

clients_db = [
    {
        "id": 1,
        "name": "Carlos Mendoza",
        "email": "carlos@gmail.com",
        "phone": "+573001234567",
        "notes": "Cliente frecuente, le gustan los diseños tradicionales",
        "created_at": datetime.now()
    },
    {
        "id": 2,
        "name": "Ana García",
        "email": "ana.garcia@hotmail.com",
        "phone": "+573009876543",
        "notes": "Primera vez, interesada en tatuajes pequeños",
        "created_at": datetime.now()
    },
    {
        "id": 3,
        "name": "Luis Torres",
        "email": "luis.torres@yahoo.com",
        "phone": "+573001122334",
        "notes": "Coleccionista de tatuajes, tiene manga completa",
        "created_at": datetime.now()
    }
]

# =============================================================================
# 🔐 SISTEMA DE AUTENTICACIÓN
# =============================================================================
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Autenticación simple basada en token"""
    token = credentials.credentials
    # Token simple: email:password en base64
    try:
        import base64
        decoded = base64.b64decode(token).decode()
        email, password = decoded.split(":")
        
        user = next((u for u in users_db if u["email"] == email and u["password"] == password), None)
        if not user:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        return user
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

# =============================================================================
# 🚀 APLICACIÓN FASTAPI
# =============================================================================
app = FastAPI(
    title="🎨 Sistema de Gestión de Tatuajes",
    description="API completa para gestión de tatuajes y citas",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración CORS simple y efectiva
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# �️ FUNCIONES AUXILIARES CORS
# =============================================================================

# def add_cors_headers comentado
"""Agregar headers CORS adicionales manualmente"""

# =============================================================================
# �🔗 ENDPOINTS PRINCIPALES
# =============================================================================

# Endpoint para manejar CORS preflight requests
@app.options("/{path:path}")
async def preflight_handler(path: str):
    """Maneja todas las requests OPTIONS para CORS"""
    return {
        "message": "CORS preflight OK",
        "path": path,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    }

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

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Información del usuario actual"""
    return UserResponse(**current_user)

# =============================================================================
# 🎨 ENDPOINTS DE TATUAJES
# =============================================================================

@app.get("/api/tattoos", response_model=List[TattooResponse])
async def get_tattoos():
    """Obtener todos los tatuajes - ACCESO PÚBLICO PARA HACKATHON"""
    return tattoos_db

@app.get("/api/tattoos/secure", response_model=List[TattooResponse])
async def get_tattoos_secure(current_user: dict = Depends(get_current_user)):
    """Obtener todos los tatuajes - CON AUTENTICACIÓN"""
    return tattoos_db

@app.post("/api/tattoos", response_model=TattooResponse)
async def create_tattoo(tattoo: TattooCreate, current_user: dict = Depends(get_current_user)):
    """Crear nuevo tatuaje"""
    if current_user["role"] not in ["admin", "artist"]:
        raise HTTPException(status_code=403, detail="Sin permisos para crear tatuajes")
    
    new_id = max([t["id"] for t in tattoos_db], default=0) + 1
    new_tattoo = {
        "id": new_id,
        **tattoo.dict(),
        "created_at": datetime.now()
    }
    tattoos_db.append(new_tattoo)
    return new_tattoo

@app.get("/api/tattoos/{tattoo_id}", response_model=TattooResponse)
async def get_tattoo(tattoo_id: int, current_user: dict = Depends(get_current_user)):
    """Obtener tatuaje específico"""
    tattoo = next((t for t in tattoos_db if t["id"] == tattoo_id), None)
    if not tattoo:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    return tattoo

@app.put("/api/tattoos/{tattoo_id}", response_model=TattooResponse)
async def update_tattoo(tattoo_id: int, tattoo: TattooCreate, current_user: dict = Depends(get_current_user)):
    """Actualizar tatuaje"""
    if current_user["role"] not in ["admin", "artist"]:
        raise HTTPException(status_code=403, detail="Sin permisos para actualizar tatuajes")
    
    existing_tattoo = next((t for t in tattoos_db if t["id"] == tattoo_id), None)
    if not existing_tattoo:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    
    existing_tattoo.update(tattoo.dict())
    return existing_tattoo

@app.delete("/api/tattoos/{tattoo_id}")
async def delete_tattoo(tattoo_id: int, current_user: dict = Depends(get_current_user)):
    """Eliminar tatuaje"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Solo admins pueden eliminar tatuajes")
    
    global tattoos_db
    tattoos_db = [t for t in tattoos_db if t["id"] != tattoo_id]
    return {"message": "Tatuaje eliminado correctamente"}

# =============================================================================
# 📅 ENDPOINTS DE CITAS
# =============================================================================

@app.get("/api/appointments", response_model=List[AppointmentResponse])
async def get_appointments():
    """Obtener todas las citas - ACCESO PÚBLICO PARA HACKATHON"""
    return appointments_db

@app.get("/api/appointments/secure", response_model=List[AppointmentResponse])
async def get_appointments_secure(current_user: dict = Depends(get_current_user)):
    """Obtener todas las citas - CON AUTENTICACIÓN"""
    return appointments_db

@app.post("/api/appointments", response_model=AppointmentResponse)
async def create_appointment(appointment: AppointmentCreate):
    """Crear nueva cita (sin autenticación para clientes)"""
    # Verificar que el tatuaje existe
    tattoo = next((t for t in tattoos_db if t["id"] == appointment.tattoo_id), None)
    if not tattoo:
        raise HTTPException(status_code=404, detail="Tatuaje no encontrado")
    
    new_id = max([a["id"] for a in appointments_db], default=0) + 1
    new_appointment = {
        "id": new_id,
        **appointment.dict(),
        "tattoo_name": tattoo["name"],
        "status": "pendiente",
        "created_at": datetime.now()
    }
    appointments_db.append(new_appointment)
    return new_appointment

@app.get("/api/appointments/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(appointment_id: int, current_user: dict = Depends(get_current_user)):
    """Obtener cita específica"""
    appointment = next((a for a in appointments_db if a["id"] == appointment_id), None)
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return appointment

@app.put("/api/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: int, status: str, current_user: dict = Depends(get_current_user)):
    """Actualizar estado de cita"""
    if current_user["role"] not in ["admin", "artist"]:
        raise HTTPException(status_code=403, detail="Sin permisos para actualizar citas")
    
    appointment = next((a for a in appointments_db if a["id"] == appointment_id), None)
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    valid_statuses = ["pendiente", "confirmada", "completada", "cancelada"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Estado inválido. Opciones: {valid_statuses}")
    
    appointment["status"] = status
    return {"message": f"Estado actualizado a: {status}"}

# =============================================================================
# � ENDPOINTS DE CLIENTES
# =============================================================================

@app.get("/api/clients", response_model=List[ClientResponse])
async def get_clients():
    """Obtener todos los clientes - ACCESO PÚBLICO PARA HACKATHON"""
    return clients_db

@app.get("/api/clients/secure", response_model=List[ClientResponse])
async def get_clients_secure(current_user: dict = Depends(get_current_user)):
    """Obtener todos los clientes - CON AUTENTICACIÓN"""
    return clients_db

@app.post("/api/clients", response_model=ClientResponse)
async def create_client(client: ClientCreate, current_user: dict = Depends(get_current_user)):
    """Crear nuevo cliente"""
    if current_user["role"] not in ["admin", "artist"]:
        raise HTTPException(status_code=403, detail="Sin permisos para crear clientes")
    
    # Verificar si el email ya existe
    existing_client = next((c for c in clients_db if c["email"] == client.email), None)
    if existing_client:
        raise HTTPException(status_code=400, detail="Cliente con este email ya existe")
    
    new_id = max([c["id"] for c in clients_db], default=0) + 1
    new_client = {
        "id": new_id,
        **client.dict(),
        "created_at": datetime.now()
    }
    clients_db.append(new_client)
    return new_client

@app.get("/api/clients/{client_id}", response_model=ClientResponse)
async def get_client(client_id: int, current_user: dict = Depends(get_current_user)):
    """Obtener cliente específico"""
    client = next((c for c in clients_db if c["id"] == client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client

@app.put("/api/clients/{client_id}", response_model=ClientResponse)
async def update_client(client_id: int, client: ClientCreate, current_user: dict = Depends(get_current_user)):
    """Actualizar cliente"""
    if current_user["role"] not in ["admin", "artist"]:
        raise HTTPException(status_code=403, detail="Sin permisos para actualizar clientes")
    
    existing_client = next((c for c in clients_db if c["id"] == client_id), None)
    if not existing_client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # Verificar que el email no esté siendo usado por otro cliente
    email_conflict = next((c for c in clients_db if c["email"] == client.email and c["id"] != client_id), None)
    if email_conflict:
        raise HTTPException(status_code=400, detail="Email ya está siendo usado por otro cliente")
    
    existing_client.update({
        **client.dict(),
        "id": client_id,  # Mantener el ID original
        "created_at": existing_client["created_at"]  # Mantener fecha de creación
    })
    return existing_client

@app.delete("/api/clients/{client_id}")
async def delete_client(client_id: int, current_user: dict = Depends(get_current_user)):
    """Eliminar cliente"""
    if current_user["role"] not in ["admin", "artist"]:
        raise HTTPException(status_code=403, detail="Sin permisos para eliminar clientes")
    
    client = next((c for c in clients_db if c["id"] == client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # Verificar si el cliente tiene citas pendientes
    pending_appointments = [a for a in appointments_db if a["client_email"] == client["email"] and a["status"] in ["pendiente", "confirmada"]]
    if pending_appointments:
        raise HTTPException(status_code=400, detail="No se puede eliminar cliente con citas pendientes o confirmadas")
    
    clients_db.remove(client)
    return {"message": "Cliente eliminado exitosamente"}

# =============================================================================
# 🤖 SERVICIOS DE OLLAMA IA
# =============================================================================

OLLAMA_BASE_URL = "http://localhost:11434"

# Configuración de timeouts por modelo (optimizados para 4 cores)
MODEL_TIMEOUTS = {
    "phi": 15,           # Phi optimizado: 15 segundos
    "mistral": 25,       # Mistral optimizado: 25 segundos  
    "llama2:7b-chat": 35, # Llama2 optimizado: 35 segundos
    "llama3:latest": 40, # Llama3 optimizado: 40 segundos
    "codegemma:latest": 45 # CodeGemma optimizado: 45 segundos
}

# Pool de conexiones para distribución de carga
import concurrent.futures
import threading

class OllamaOptimizer:
    def __init__(self):
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)
        self.model_queue = {
            "phi": [],
            "mistral": [],
            "llama2:7b-chat": [],
            "llama3:latest": [],
            "codegemma:latest": []
        }
        self.lock = threading.Lock()
    
    async def get_model_load(self, model: str) -> int:
        """Obtener carga actual del modelo"""
        with self.lock:
            return len(self.model_queue.get(model, []))
    
    def recommend_model(self) -> str:
        """Recomendar modelo basado en carga actual"""
        loads = {model: len(queue) for model, queue in self.model_queue.items()}
        return min(loads, key=loads.get)

ollama_optimizer = OllamaOptimizer()

async def call_ollama(model: str, prompt: str, context: str = "") -> Dict[str, Any]:
    """Llamar a Ollama API para generar respuesta con distribución de carga optimizada"""
    try:
        # Validar modelo
        valid_models = ["phi", "mistral", "llama2:7b-chat", "llama3:latest", "codegemma:latest"]
        if model not in valid_models:
            model = "phi"  # Fallback al más rápido
        
        # Verificar carga del modelo y recomendar alternativa si está ocupado
        current_load = await ollama_optimizer.get_model_load(model)
        if current_load > 1:  # Si hay más de 1 petición en cola
            recommended = ollama_optimizer.recommend_model()
            if recommended != model:
                model = recommended
        
        # Obtener timeout específico del modelo (optimizado)
        timeout = MODEL_TIMEOUTS.get(model, 15)
        
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        
        # Limitar longitud del prompt para evitar timeouts
        if len(full_prompt) > 500:
            full_prompt = full_prompt[:500] + "..."
        
        payload = {
            "model": model,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "num_predict": 150  # Limitar respuesta para ser más rápido
            }
        }
        
        start_time = datetime.now()
        response = requests.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload, timeout=timeout)
        end_time = datetime.now()
        
        if response.status_code == 200:
            result = response.json()
            processing_time = (end_time - start_time).total_seconds()
            return {
                "response": result.get("response", "Sin respuesta del modelo"),
                "processing_time": processing_time,
                "success": True,
                "model_used": model
            }
        else:
            # Intentar con phi si falla otro modelo
            if model != "phi":
                return await call_ollama("phi", prompt, context)
            raise HTTPException(status_code=500, detail=f"Error de Ollama: {response.status_code}")
    
    except requests.exceptions.Timeout:
        # Si timeout, intentar con modelo más rápido
        if model != "phi":
            return await call_ollama("phi", prompt, context)
        return {
            "response": f"Lo siento, el modelo {model} tardó demasiado. Intenta con un mensaje más corto.",
            "processing_time": timeout,
            "success": False,
            "model_used": model,
            "error": "timeout"
        }
    except requests.exceptions.ConnectionError:
        return {
            "response": "Servicio de IA temporalmente no disponible. Por favor intenta más tarde.",
            "processing_time": 0,
            "success": False,
            "model_used": model,
            "error": "connection_error"
        }
    except Exception as e:
        if model != "phi":
            return await call_ollama("phi", prompt, context)
        return {
            "response": f"Error inesperado: {str(e)}. Intenta nuevamente.",
            "processing_time": 0,
            "success": False,
            "model_used": model,
            "error": "general_error"
        }

# =============================================================================
# 🤖 ENDPOINTS DE OLLAMA IA
# =============================================================================

@app.get("/api/ai/status")
async def ai_status():
    """Estado rápido del sistema de IA"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        return {
            "ollama_online": response.status_code == 200,
            "recommended_model": "phi",
            "fallback_available": True,
            "avg_response_time": "2-5 segundos",
            "status": "ready"
        }
    except:
        return {
            "ollama_online": False,
            "recommended_model": "none",
            "fallback_available": False,
            "status": "offline"
        }

@app.post("/api/ai/quick-chat")
async def quick_chat(request: Dict[str, Any]):
    """Chat rápido con respuestas predefinidas para testing"""
    message = request.get("message", "").lower()
    
    responses = {
        "hola": "¡Hola! Soy tu asistente de tatuajes. ¿En qué puedo ayudarte?",
        "tatuaje": "Los tatuajes son una forma de arte corporal. ¿Qué tipo de diseño te interesa?",
        "precio": "Los precios varían según el tamaño y complejidad. ¿Qué tamaño tienes en mente?",
        "dolor": "El dolor depende de la ubicación. Las zonas con más grasa duelen menos.",
        "cuidado": "Mantén el tatuaje limpio, usa crema cicatrizante y evita el sol las primeras semanas."
    }
    
    # Buscar respuesta basada en palabras clave
    response = "Soy tu asistente virtual de tatuajes. Puedo ayudarte con información sobre diseños, precios, cuidados y más."
    
    for keyword, reply in responses.items():
        if keyword in message:
            response = reply
            break
    
    return {
        "response": response,
        "model_used": "quick-response",
        "processing_time": 0.01,
        "timestamp": datetime.now().isoformat(),
        "status": "success",
        "type": "fallback"
    }

@app.get("/api/ai/models")
async def get_available_models():
    """Obtener modelos de Ollama disponibles"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10)
        if response.status_code == 200:
            models = response.json().get("models", [])
            available_models = [
                {
                    "name": model["name"],
                    "size": model.get("size", "Unknown"),
                    "modified_at": model.get("modified_at", "Unknown")
                }
                for model in models
            ]
            return {
                "available_models": available_models,
                "recommended": ["phi", "mistral", "llama2:7b-chat"],
                "status": "online"
            }
        else:
            raise HTTPException(status_code=503, detail="Servicio Ollama no disponible")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Error conectando con Ollama: {str(e)}")

@app.post("/api/ai/chat")
async def chat_with_ai(chat_request: ChatRequest):
    """Chat general con modelos de Ollama - Mejorado con manejo de errores"""
    try:
        # Validación adicional
        if not chat_request.message or len(chat_request.message.strip()) == 0:
            return {
                "error": "Mensaje vacío",
                "detail": "Por favor envía un mensaje válido",
                "suggestions": ["Escribe una pregunta", "Intenta con 'Hola'", "Describe lo que necesitas"]
            }
        
        # Usar modelo por defecto si no es válido
        valid_models = ["phi", "mistral", "llama2:7b-chat", "llama3:latest", "codegemma:latest"]
        model_to_use = chat_request.model if chat_request.model in valid_models else "phi"
        
        result = await call_ollama(
            model=model_to_use,
            prompt=chat_request.message,
            context=chat_request.context or ""
        )
        
        if result.get("success", True):
            return {
                "response": result["response"],
                "model_used": result.get("model_used", model_to_use),
                "processing_time": result["processing_time"],
                "timestamp": datetime.now().isoformat(),
                "status": "success"
            }
        else:
            # Error en Ollama pero manejado
            return {
                "response": result["response"],
                "model_used": result.get("model_used", model_to_use),
                "processing_time": result["processing_time"],
                "timestamp": datetime.now().isoformat(),
                "status": "fallback",
                "warning": f"Error {result.get('error', 'unknown')} - respuesta de fallback"
            }
    
    except Exception as e:
        return {
            "response": "Lo siento, hubo un error procesando tu mensaje. Intenta nuevamente.",
            "model_used": "error",
            "processing_time": 0,
            "timestamp": datetime.now().isoformat(),
            "status": "error",
            "detail": str(e)
        }

@app.post("/api/ai/tattoo-assistant")
async def tattoo_ai_assistant(request: TattooAIRequest):
    """Asistente IA especializado en tatuajes"""
    
    # Contexto especializado para tatuajes
    tattoo_context = """
    Eres un asistente experto en tatuajes. Ayudas a clientes con:
    - Recomendaciones de diseños
    - Información sobre estilos de tatuajes
    - Cuidados pre y post tatuaje
    - Ubicación ideal para tatuajes
    - Presupuestos aproximados
    
    Responde de manera amigable y profesional.
    """
    
    full_context = f"{tattoo_context}\n{request.tattoo_context}" if request.tattoo_context else tattoo_context
    
    result = await call_ollama(
        model=request.model,
        prompt=request.client_message,
        context=full_context
    )
    
    # Generar recomendaciones basadas en la respuesta
    recommendations = []
    if "realista" in request.client_message.lower():
        recommendations.extend(["Estilo realismo", "Artista especializado", "Sesión larga"])
    if "pequeño" in request.client_message.lower():
        recommendations.extend(["Diseño minimalista", "Ubicación discreta", "Primera sesión"])
    if "color" in request.client_message.lower():
        recommendations.extend(["Cuidado especial del color", "Protección solar", "Retoque anual"])
    
    if not recommendations:
        recommendations = ["Consulta personalizada", "Portfolio del artista", "Presupuesto detallado"]
    
    return TattooAIResponse(
        ai_response=result["response"],
        recommendations=recommendations,
        model_used=request.model,
        processing_time=result["processing_time"]
    )

@app.post("/api/ai/design-suggestions")
async def get_design_suggestions(request: Dict[str, Any]):
    """Sugerencias de diseños basadas en preferencias del cliente"""
    
    style = request.get("style", "")
    size = request.get("size", "")
    location = request.get("location", "")
    theme = request.get("theme", "")
    
    prompt = f"""
    El cliente quiere un tatuaje con estas características:
    - Estilo: {style}
    - Tamaño: {size}
    - Ubicación: {location}
    - Tema: {theme}
    
    Proporciona 3 sugerencias detalladas de diseños que se adapten a estos criterios.
    Incluye información sobre duración, precio aproximado y cuidados especiales.
    """
    
    result = await call_ollama(
        model="mistral",  # Usar Mistral para sugerencias creativas
        prompt=prompt,
        context="Eres un diseñador de tatuajes experto que ayuda a crear diseños únicos y personalizados."
    )
    
    return {
        "suggestions": result["response"],
        "processing_time": result["processing_time"],
        "criteria_used": {
            "style": style,
            "size": size,
            "location": location,
            "theme": theme
        }
    }

# =============================================================================
# 🚀 INICIALIZACIÓN DEL SERVIDOR
# =============================================================================

if __name__ == "__main__":
    print("🎨 SERVIDOR IP PÚBLICA DIRECTA - Sistema de Gestión de Tatuajes")
    print("=" * 80)
    print(f"🌐 IP Pública: {PUBLIC_IP}")
    print(f"🏠 IP Local:   {LOCAL_IP}")
    print(f"🔌 Puerto:     {PORT}")
    print("=" * 80)
    print("🔗 URLs para tu compañero:")
    print(f"   📚 Documentación: http://{PUBLIC_IP}:{PORT}/docs")
    print(f"   🔗 API Base:      http://{PUBLIC_IP}:{PORT}/api")
    print(f"   ❤️  Estado:       http://{PUBLIC_IP}:{PORT}/status")
    print(f"   📋 Info Completa: http://{PUBLIC_IP}:{PORT}/api/connection-info")
    print("=" * 80)
    print("🔑 Usuarios de prueba:")
    print("   📧 juan@tattoo.com | 🔑 123456 | 👨‍🎨 artist")
    print("   📧 maria@tattoo.com | 🔑 admin123 | 👩‍💼 admin")
    print("=" * 80)
    print("⚠️  IMPORTANTE:")
    print("   Asegúrate de tener configurado Port Forwarding en tu router:")
    print(f"   Puerto externo: {PORT} → IP interna: {LOCAL_IP}:{PORT}")
    print("=" * 80)
    print("🧪 Prueba de conexión:")
    print(f"   curl http://{PUBLIC_IP}:{PORT}/status")
    print("=" * 80)
    print("🚀 Iniciando servidor...")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=PORT,
        log_level="info",
        access_log=True
    )