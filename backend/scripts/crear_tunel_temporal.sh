#!/bin/bash

# 🚀 Solución temporal: LocalTunnel para acceso inmediato
# ======================================================

API_PORT=8001
LOG_FILE="tunnel.log"

echo "🚀 INICIANDO TÚNEL TEMPORAL PARA TU API"
echo "======================================"

# Verificar que el servidor local está corriendo
echo "🔍 Verificando servidor local..."
if curl -s --connect-timeout 3 "http://localhost:$API_PORT/" >/dev/null 2>&1; then
    echo "   ✅ Servidor API corriendo en puerto $API_PORT"
else
    echo "   ❌ Servidor API no responde en puerto $API_PORT"
    echo "   Iniciando servidor..."
    nohup python3 tattoo_cors_ultra.py > servidor_cors_ultra.log 2>&1 &
    sleep 5
fi

# Generar subdominio único con timestamp
TIMESTAMP=$(date +%H%M)
SUBDOMAIN="tattoo-api-$TIMESTAMP"

echo ""
echo "🌐 Creando túnel LocalTunnel..."
echo "   Subdominio: $SUBDOMAIN"
echo "   Puerto local: $API_PORT"

# Crear túnel con reintentos
for attempt in 1 2 3; do
    echo "   Intento $attempt/3..."
    
    # Iniciar túnel en background
    timeout 30 lt --port $API_PORT --subdomain $SUBDOMAIN > $LOG_FILE 2>&1 &
    TUNNEL_PID=$!
    
    # Esperar a que el túnel se establezca
    sleep 8
    
    # Verificar si el túnel está funcionando
    if grep -q "your url is:" $LOG_FILE; then
        TUNNEL_URL=$(grep "your url is:" $LOG_FILE | awk '{print $4}')
        echo "   ✅ Túnel creado: $TUNNEL_URL"
        
        # Test rápido del túnel
        sleep 3
        if curl -s --connect-timeout 10 "$TUNNEL_URL/" | grep -q "tattoo\|cors\|FastAPI" 2>/dev/null; then
            echo "   ✅ Túnel verificado y funcionando"
            
            echo ""
            echo "🎉 TÚNEL ACTIVO Y FUNCIONANDO"
            echo "============================"
            echo "🌐 URL para tu compañero: $TUNNEL_URL"
            echo "📚 Documentación: $TUNNEL_URL/docs"
            echo "🧪 Test CORS: $TUNNEL_URL/api/cors-test"
            echo "🤖 AI Chat: $TUNNEL_URL/api/ai/quick-chat"
            echo ""
            echo "💻 Código JavaScript para tu compañero:"
            echo "const API_BASE = '$TUNNEL_URL';"
            echo ""
            echo "⏰ IMPORTANTE: Este túnel es temporal"
            echo "   • Se mantendrá activo mientras esta terminal esté abierta"
            echo "   • Para acceso permanente, configura el router:"
            echo "     TCP 8001 → 192.168.101.71:8001"
            echo ""
            echo "🔄 El túnel está corriendo (PID: $TUNNEL_PID)"
            echo "   Para detenerlo: kill $TUNNEL_PID"
            
            # Mostrar logs en tiempo real
            echo ""
            echo "📋 Logs del túnel (Ctrl+C para salir):"
            echo "======================================"
            tail -f $LOG_FILE
            exit 0
        else
            echo "   ⚠️ Túnel creado pero no responde correctamente"
            kill $TUNNEL_PID 2>/dev/null
        fi
    else
        echo "   ❌ Fallo en intento $attempt"
        kill $TUNNEL_PID 2>/dev/null
    fi
    
    sleep 2
done

echo ""
echo "❌ No se pudo establecer túnel LocalTunnel"
echo ""
echo "🔧 ALTERNATIVAS:"
echo "==============="
echo "1. Configurar router manualmente:"
echo "   • http://192.168.101.1"
echo "   • Port Forwarding: TCP 8001 → 192.168.101.71:8001"
echo ""
echo "2. Usar ngrok (alternativa):"
echo "   • wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip"
echo "   • unzip ngrok-stable-linux-amd64.zip"
echo "   • ./ngrok http 8001"
echo ""
echo "3. CloudFlare Tunnel (gratuito, permanente):"
echo "   • curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb"
echo "   • sudo dpkg -i cloudflared.deb"
echo "   • cloudflared tunnel --hello-world"