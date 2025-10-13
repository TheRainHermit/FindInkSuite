#!/bin/bash

# 🔐 MONITOR DEL SERVIDOR VPN + CORS
# ================================

echo "🔐 SISTEMA VPN + CORS - ESTADO COMPLETO"
echo "======================================="

# Verificar VPN
echo "🌐 ESTADO VPN:"
sudo wg show
echo ""

# Verificar servidor
echo "🚀 SERVIDOR (Puerto 8001):"
if curl -s http://localhost:8001/api/vpn-test > /dev/null; then
    echo "✅ Servidor VPN: FUNCIONANDO"
else
    echo "❌ Servidor VPN: NO RESPONDE"
fi
echo ""

# Test endpoints principales
echo "🧪 TESTS DE ENDPOINTS:"

echo "1. Test VPN:"
curl -s "http://localhost:8001/api/vpn-test" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'   ✅ {data[\"vpn_test\"]} - {data[\"message\"]}')
except:
    print('   ❌ Error en test VPN')
"

echo "2. Test CORS:"
curl -s -X OPTIONS "http://localhost:8001/api/ai/quick-chat" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -I | grep -q "Access-Control-Allow-Origin" && echo "   ✅ CORS habilitado" || echo "   ❌ CORS problema"

echo "3. Test AI Chat:"
curl -s -X POST "http://localhost:8001/api/ai/quick-chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}' | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'   ✅ AI: {data[\"status\"]} - {data[\"access_type\"]}')
except:
    print('   ❌ Error en AI Chat')
"

echo ""
echo "🔗 INFORMACIÓN PARA TU COMPAÑERO:"
echo "================================="
echo "🔐 URL VPN:      http://10.0.0.1:8001"
echo "🌍 URL Directa:  http://190.217.23.26:8001"
echo "📚 Docs:         http://10.0.0.1:8001/docs"
echo "🧪 Test:         http://10.0.0.1:8001/api/vpn-test"
echo ""
echo "👥 USUARIOS DE PRUEBA:"
echo "   Email: juan@tattoo.com | Pass: 123456"
echo "   Email: maria@tattoo.com | Pass: admin123"
echo ""
echo "🔧 CONFIGURACIÓN VPN REQUERIDA:"
echo "   1. Instalar WireGuard"
echo "   2. Usar client.conf de la carpeta vpn-config/"
echo "   3. Conectar: sudo wg-quick up client"
echo "   4. Verificar: ping 10.0.0.1"
echo "======================================="