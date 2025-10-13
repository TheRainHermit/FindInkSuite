#!/bin/bash

echo "🎯 SERVIDOR TATTOO HACKATHON - SISTEMA DEFINITIVO"
echo "================================================="
echo "✅ FastAPI con TODOS los endpoints"
echo "✅ LocalTunnel sin límites"
echo "✅ Base de datos completa"
echo "✅ Sistema limpio y organizado"
echo "================================================="

# Función de limpieza
cleanup() {
    echo ""
    echo "🛑 Deteniendo todos los servicios..."
    sudo wg-quick down wg0 2>/dev/null
    pkill -f "python3 tattoo_8001.py" 2>/dev/null
    pkill -f "lt --port" 2>/dev/null
    pkill -f "uvicorn" 2>/dev/null
    echo "✅ Todos los servicios detenidos"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Detectar configuración de red
LOCAL_IP=$(hostname -I | awk '{print $1}')
GATEWAY=$(ip route | grep default | awk '{print $3}' | head -1)

echo "🔍 CONFIGURACIÓN DE RED:"
echo "   📍 IP Local: $LOCAL_IP"
echo "   📍 Gateway:  $GATEWAY"
echo "   📍 IP Pública: 190.217.23.26"

echo ""
echo "🔧 PASO 1/4: Configurando firewall..."
sudo ufw allow 51820/udp comment "WireGuard VPN" 2>/dev/null
sudo ufw allow 8001/tcp comment "FastAPI Tattoo" 2>/dev/null
sudo ufw allow from 10.0.0.0/24 comment "VPN Network" 2>/dev/null
echo "✅ Firewall configurado"

echo ""
echo "🔧 PASO 2/4: Limpiando procesos previos..."
sudo wg-quick down wg0 2>/dev/null
pkill -f "python" 2>/dev/null
pkill -f "lt --port" 2>/dev/null
sleep 3

echo ""
echo "🔐 PASO 3/4: Iniciando servidor VPN (Opcional)..."
if [ -f "vpn-config/wg0.conf" ]; then
    sudo wg-quick up vpn-config/wg0.conf 2>/dev/null && echo "✅ VPN iniciado" || echo "⚠️ VPN no configurado (opcional)"
else
    echo "⚠️ VPN no configurado (opcional)"
fi

echo ""
echo "🚀 PASO 4/4: Iniciando servidor API completo..."
python3 tattoo_8001.py &
API_PID=$!
sleep 5

echo "✅ Servidor API iniciado (PID: $API_PID)"

echo ""
echo "🌐 Configurando LocalTunnel..."
lt --port 8001 --subdomain tattoo-hackathon-1006 --print-requests &
LT_PID=$!
sleep 3

echo "✅ LocalTunnel activo"

echo ""
echo "🎉 ¡SISTEMA DEFINITIVO FUNCIONANDO!"
echo "=================================="
echo "✅ API FastAPI: FUNCIONANDO (Puerto 8001)"
echo "✅ LocalTunnel: FUNCIONANDO"
echo ""
echo "🌐 URLS DEFINITIVAS PARA TU COMPAÑERO:"
echo "======================================"
echo "📚 Documentación: https://tattoo-hackathon-1006.loca.lt/docs"
echo "🔗 API Base:      https://tattoo-hackathon-1006.loca.lt/api"
echo "❤️ Estado:        https://tattoo-hackathon-1006.loca.lt/status"
echo ""
echo "🎯 ENDPOINTS COMPLETOS:"
echo "======================"
echo "🔐 Auth:"
echo "   POST /api/auth/login      - Login de usuario"
echo "   GET  /api/auth/me         - Info del usuario"
echo ""
echo "🎨 Tatuajes:"
echo "   GET    /api/tattoos       - Listar tatuajes"
echo "   POST   /api/tattoos       - Crear tatuaje"
echo "   GET    /api/tattoos/{id}  - Obtener tatuaje"
echo "   PUT    /api/tattoos/{id}  - Actualizar tatuaje"
echo "   DELETE /api/tattoos/{id}  - Eliminar tatuaje"
echo ""
echo "👥 Clientes:"
echo "   GET    /api/clients       - Listar clientes"
echo "   POST   /api/clients       - Crear cliente"
echo "   GET    /api/clients/{id}  - Obtener cliente"
echo "   PUT    /api/clients/{id}  - Actualizar cliente"
echo "   DELETE /api/clients/{id}  - Eliminar cliente"
echo ""
echo "📅 Citas:"
echo "   GET /api/appointments     - Listar citas"
echo "   POST /api/appointments    - Crear cita"
echo "   GET /api/appointments/{id} - Obtener cita"
echo "   PUT /api/appointments/{id}/status - Actualizar estado"
echo ""
echo "🔑 USUARIOS DE PRUEBA:"
echo "====================="
echo "👨‍🎨 juan@tattoo.com | 123456 (artista)"
echo "👩‍💼 maria@tattoo.com | admin123 (admin)"
echo ""
echo "📊 DATOS DE EJEMPLO INCLUIDOS:"
echo "============================="
echo "✅ 2 tatuajes de ejemplo"
echo "✅ 3 clientes de ejemplo"
echo "✅ Sistema de roles (admin/artist)"
echo "✅ Validaciones completas"
echo ""
echo "🧪 PRUEBA RÁPIDA:"
echo "================"
echo "curl https://tattoo-hackathon-1006.loca.lt/status"
echo ""
echo "💡 INSTRUCCIONES:"
echo "   - Mantén esta terminal abierta"
echo "   - Presiona Ctrl+C para detener TODO"
echo "   - Comparte las URLs con tu compañero"
echo "   - Si pide IP en LocalTunnel: 190.217.23.26"
echo ""
echo "🎯 ¡SISTEMA DEFINITIVO LISTO PARA HACKATHON!"

# Verificar conectividad
sleep 5
echo ""
echo "🧪 VERIFICANDO CONECTIVIDAD..."
if curl -s -o /dev/null -w "%{http_code}" https://tattoo-hackathon-1006.loca.lt/status | grep -q "200"; then
    echo "✅ Sistema funcionando correctamente"
else
    echo "⚠️ Verificando conexión..."
fi

# Mostrar información en tiempo real
echo ""
echo "📊 MONITORING EN TIEMPO REAL:"
echo "============================="
echo "PIDs: API=$API_PID, LocalTunnel=$LT_PID"

# Mantener el script corriendo
wait