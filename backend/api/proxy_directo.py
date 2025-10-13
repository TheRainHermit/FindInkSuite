#!/usr/bin/env python3
"""
🌐 SERVIDOR DIRECTO PARA COMPAÑERO
Servidor simple con CORS habilitado en puerto 8080
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests
import json

# Configuración
app = FastAPI(title="🌉 Proxy API Tatuajes", version="1.0.0")

# CORS ultra-permisivo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

TARGET_API = "http://127.0.0.1:8001"

@app.get("/{path:path}")
async def proxy_get(path: str):
    """Proxy GET requests"""
    try:
        url = f"{TARGET_API}/{path}" if path else TARGET_API
        response = requests.get(url)
        return response.json()
    except Exception as e:
        return {"error": str(e), "proxy": "direct-proxy", "target": url}

@app.post("/{path:path}")
async def proxy_post(path: str, request_data: dict):
    """Proxy POST requests"""
    try:
        url = f"{TARGET_API}/{path}"
        response = requests.post(url, json=request_data)
        return response.json()
    except Exception as e:
        return {"error": str(e), "proxy": "direct-proxy", "target": url}

if __name__ == "__main__":
    print("🌐 PROXY DIRECTO PARA COMPAÑERO")
    print("=" * 40)
    print("🎯 Target: http://127.0.0.1:8001")
    print("🔌 Puerto: 8090")
    print("🌍 IP Pública: 190.217.23.26:8090")
    print("=" * 40)
    print("✅ CORS: Habilitado")
    print("✅ Métodos: GET, POST, OPTIONS")
    print("=" * 40)
    print("🚀 Iniciando proxy...")
    
    uvicorn.run(app, host="0.0.0.0", port=8090)