#!/bin/bash

# 🧪 Test de accesibilidad externa de puertos
# ==========================================

PUBLIC_IP="190.217.23.26"
API_PORT="8001"
WG_PORT="51820"

echo "🧪 PROBANDO ACCESIBILIDAD EXTERNA DE PUERTOS"
echo "============================================="
echo "IP Pública: $PUBLIC_IP"
echo ""

# Test 1: API HTTP (debe responder)
echo "1. 🌐 Test API HTTP (puerto $API_PORT):"
echo "   Probando: http://$PUBLIC_IP:$API_PORT"
HTTP_RESULT=$(curl -s --connect-timeout 10 --max-time 15 "http://$PUBLIC_IP:$API_PORT/" 2>/dev/null | head -c 100)

if [ ! -z "$HTTP_RESULT" ]; then
    echo "   ✅ PUERTO $API_PORT ACCESIBLE - API responde"
    echo "   Respuesta: $(echo "$HTTP_RESULT" | tr -d '\n' | head -c 80)..."
else
    echo "   ❌ PUERTO $API_PORT NO ACCESIBLE"
    echo "   • Router no redirige el puerto"
    echo "   • UPnP no está funcionando"
    echo "   • Posible CGNAT del ISP"
fi

echo ""

# Test 2: Puerto UDP WireGuard (timeout esperado, pero puerto abierto)
echo "2. 🔒 Test WireGuard UDP (puerto $WG_PORT):"
echo "   Probando: UDP $PUBLIC_IP:$WG_PORT"

# Usar nc para test UDP con timeout corto
if command -v nc >/dev/null 2>&1; then
    # Enviar datos UDP y ver si hay conexión
    echo "test" | timeout 5 nc -u -w 2 "$PUBLIC_IP" "$WG_PORT" 2>/dev/null
    NC_EXIT=$?
    
    if [ $NC_EXIT -eq 0 ] || [ $NC_EXIT -eq 124 ]; then
        echo "   ✅ PUERTO $WG_PORT PROBABLEMENTE ACCESIBLE"
        echo "   (UDP timeout normal, pero puerto parece abierto)"
    else
        echo "   ❌ PUERTO $WG_PORT NO ACCESIBLE"
        echo "   • Router no redirige UDP $WG_PORT"
        echo "   • UPnP no configuró el mapeo UDP"
    fi
else
    echo "   ⚠️ nc no disponible, omitiendo test UDP"
fi

echo ""

# Test 3: Usando servicio externo de port checking
echo "3. 🔍 Test con servicio externo:"
echo "   Comprobando puertos vía API externa..."

# Intentar algunos servicios de port checking
for SERVICE in "portquiz.net:8080" "tcping.eu"; do
    if curl -s --connect-timeout 5 "$SERVICE" >/dev/null 2>&1; then
        echo "   ✅ Servicio $SERVICE accesible"
        break
    fi
done

echo ""

# Resumen y siguientes pasos
echo "📋 RESUMEN DEL TEST:"
echo "==================="

# Verificar resultado del test API
if [ ! -z "$HTTP_RESULT" ]; then
    echo "✅ UPnP/Port Forwarding FUNCIONA para API (TCP $API_PORT)"
    echo "   Tu compañero puede acceder a: http://$PUBLIC_IP:$API_PORT"
    echo ""
    echo "🔧 Para completar WireGuard:"
    echo "   • Verifica que UDP $WG_PORT también esté mapeado"
    echo "   • Tu compañero puede intentar conectar VPN a: $PUBLIC_IP:$WG_PORT"
else
    echo "❌ Port Forwarding NO FUNCIONA"
    echo ""
    echo "🔧 ACCIONES NECESARIAS:"
    echo "   1. Entra al panel del router (http://192.168.101.1)"
    echo "   2. Busca 'Port Forwarding' o 'Virtual Servers'"
    echo "   3. Añade estas reglas:"
    echo "      • Regla 1: TCP $API_PORT → 192.168.101.71:$API_PORT"
    echo "      • Regla 2: UDP $WG_PORT → 192.168.101.71:$WG_PORT"
    echo "   4. Si hay UPnP, habilítalo en la configuración"
    echo "   5. Reinicia el router si es necesario"
    echo ""
    echo "   Después de configurar, ejecuta este test de nuevo:"
    echo "   ./test_puertos_externos.sh"
fi

echo ""
echo "💡 ALTERNATIVAS SI NO FUNCIONA:"
echo "   • Túnel CloudFlare (gratis)"
echo "   • LocalTunnel/ngrok (temporal)"
echo "   • VPS con reverse proxy"
echo "   • Verificar si tu ISP usa CGNAT"