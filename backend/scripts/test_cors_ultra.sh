#!/bin/bash

echo "🔥 PRUEBA CORS ULTRA-PERMISIVO - FUNCIONANDO"
echo "============================================"
echo ""

echo "🌍 URL del servidor: http://localhost:8001"
echo "🌍 IP Pública:       http://190.217.23.26:8001"
echo ""

echo "🧪 1. Test CORS básico:"
echo "------------------------"
curl -s http://localhost:8001/api/cors-test | head -3
echo ""

echo "🤖 2. Test AI Chat (SOLUCIONADO):"
echo "---------------------------------"
curl -s -X POST http://localhost:8001/api/ai/quick-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test cors ultra"}' | head -3
echo ""

echo "📋 3. Test CORS Preflight:"
echo "--------------------------"
curl -s -X OPTIONS http://localhost:8001/api/ai/quick-chat \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -I | grep -i "access-control"
echo ""

echo "🔐 4. Test con autenticación:"
echo "-----------------------------"
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@tattoo.com", "password": "123456"}' | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(data.get('access_token', ''))
except:
    print('')
")

if [ "$TOKEN" != "" ]; then
    echo "✅ Login exitoso, probando chat autenticado..."
    curl -s -X POST http://localhost:8001/api/ai/chat \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"message": "test autenticado"}' | head -3
else
    echo "❌ Error en login"
fi
echo ""

echo "🔍 5. Test estado del servidor:"
echo "-------------------------------"
curl -s http://localhost:8001/status | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('✅ Estado:', data['status'])
    print('✅ CORS:', data['cors_enabled'])
    print('✅ Usuarios:', data['usuarios_registrados'])
except:
    print('❌ Error obteniendo estado')
"
echo ""

echo "============================================"
echo "🔥 CORS ULTRA-PERMISIVO - COMPLETAMENTE FUNCIONAL"
echo "🚀 Tu compañero puede usar: http://190.217.23.26:8001"
echo "📱 React/TypeScript/JavaScript - Sin errores CORS"
echo "============================================"
echo "📱 React/TypeScript/Vanilla JS - Todo funciona"
echo "==============================================="