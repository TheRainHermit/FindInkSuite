#!/usr/bin/env python3
"""
🌉 PROXY SIMPLE PARA ACCESO EXTERNO
Solución simple sin ngrok ni localtunnel
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import requests
import json
import threading
import time

# Configuración
PROXY_PORT = 8080
TARGET_SERVER = "http://127.0.0.1:8001"

class ProxyHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        """Configurar headers CORS"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Credentials', 'true')

    def do_OPTIONS(self):
        """Manejar preflight requests"""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Proxy GET requests"""
        try:
            url = f"{TARGET_SERVER}{self.path}"
            response = requests.get(url, headers=dict(self.headers))
            
            self.send_response(response.status_code)
            self._set_cors_headers()
            
            # Copiar headers de respuesta
            for header, value in response.headers.items():
                if header.lower() not in ['content-encoding', 'transfer-encoding']:
                    self.send_header(header, value)
            
            self.end_headers()
            self.wfile.write(response.content)
            
        except Exception as e:
            self.send_response(500)
            self._set_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = json.dumps({"error": str(e), "proxy": "simple-proxy"})
            self.wfile.write(error_response.encode())

    def do_POST(self):
        """Proxy POST requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            url = f"{TARGET_SERVER}{self.path}"
            response = requests.post(url, data=post_data, headers=dict(self.headers))
            
            self.send_response(response.status_code)
            self._set_cors_headers()
            
            # Copiar headers de respuesta
            for header, value in response.headers.items():
                if header.lower() not in ['content-encoding', 'transfer-encoding']:
                    self.send_header(header, value)
            
            self.end_headers()
            self.wfile.write(response.content)
            
        except Exception as e:
            self.send_response(500)
            self._set_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = json.dumps({"error": str(e), "proxy": "simple-proxy"})
            self.wfile.write(error_response.encode())

    def log_message(self, format, *args):
        """Log personalizado"""
        print(f"🌉 PROXY: {format % args}")

def run_proxy():
    """Ejecutar el servidor proxy"""
    server = HTTPServer(('0.0.0.0', PROXY_PORT), ProxyHandler)
    print("🌉 PROXY SIMPLE INICIADO")
    print("=" * 40)
    print(f"🔌 Puerto proxy: {PROXY_PORT}")
    print(f"🎯 Servidor destino: {TARGET_SERVER}")
    print(f"🌐 URL para tu compañero: http://190.217.23.26:{PROXY_PORT}")
    print("=" * 40)
    print("✅ CORS: Habilitado")
    print("✅ Métodos: GET, POST, OPTIONS")
    print("✅ Headers: Permitidos todos")
    print("=" * 40)
    print("🚀 Proxy funcionando...")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Deteniendo proxy...")
        server.shutdown()

if __name__ == "__main__":
    run_proxy()