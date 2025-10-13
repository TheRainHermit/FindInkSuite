#!/bin/bash

# 🔍 Detectar estado UPnP y obtener IP pública de forma segura
# ===========================================================

echo "🔍 DIAGNÓSTICO UPnP Y CONECTIVIDAD"
echo "=================================="

# 1. Detectar IP pública
echo "🌍 Obteniendo IP pública..."
PUBLIC_IP=$(curl -s --connect-timeout 5 ifconfig.me 2>/dev/null || curl -s --connect-timeout 5 ipinfo.io/ip 2>/dev/null || echo "Error obteniendo IP")
echo "   IP Pública: $PUBLIC_IP"

# 2. Verificar UPnP en diferentes interfaces
echo ""
echo "📡 Probando descubrimiento UPnP en interfaces..."

# Probar sin especificar interfaz
echo "   Sin interfaz específica:"
upnpc -s 2>/dev/null | head -10 | grep -E "(Found|ExternalIPAddress|desc:|Local LAN ip address)" || echo "     ❌ No detectado"

# Probar con interfaz eth0
echo "   Con interfaz eth0:"
upnpc -m eth0 -s 2>/dev/null | head -10 | grep -E "(Found|ExternalIPAddress|desc:|Local LAN ip address)" || echo "     ❌ No detectado en eth0"

# Probar descubrimiento con timeout
echo "   Con timeout extendido:"
timeout 10 upnpc -s -t 5000 2>/dev/null | head -10 | grep -E "(Found|ExternalIPAddress|desc:|Local LAN ip address)" || echo "     ❌ No detectado con timeout"

# 3. Verificar gateway/router
echo ""
echo "🏠 Información del router:"
DEFAULT_GW=$(ip route | grep default | awk '{print $3}' | head -1)
echo "   Gateway por defecto: $DEFAULT_GW"

if [ ! -z "$DEFAULT_GW" ]; then
    echo "   Ping al router:"
    ping -c 2 -W 2 "$DEFAULT_GW" >/dev/null 2>&1 && echo "     ✅ Router accesible" || echo "     ❌ Router no responde"
    
    # Intentar UPnP directamente al gateway
    echo "   UPnP directo al gateway:"
    upnpc -u "http://$DEFAULT_GW:1900" -s 2>/dev/null | head -5 | grep -E "(Found|ExternalIPAddress)" || echo "     ❌ UPnP no responde en puerto 1900"
fi

# 4. Verificar puertos multicast UPnP
echo ""
echo "🔍 Verificando conectividad multicast UPnP:"
echo "   Intentando SSDP multicast..."
(echo -e "M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: \"ssdp:discover\"\r\nST: upnp:rootdevice\r\nMX: 3\r\n\r\n" | nc -u -w 3 239.255.255.250 1900 2>/dev/null | head -5) || echo "     ❌ Sin respuesta SSDP"

# 5. Probar herramientas alternativas
echo ""
echo "🧪 Herramientas UPnP alternativas:"

# upnpc con diferentes modos
echo "   upnpc lista de dispositivos:"
upnpc -l 2>/dev/null | head -5 | grep -E "(Found|device|ExternalIPAddress)" || echo "     ❌ No hay lista de dispositivos"

# Verificar si hay miniupnpd local
if pgrep miniupnpd >/dev/null 2>&1; then
    echo "   ✅ miniupnpd corriendo localmente"
else
    echo "   ℹ️ miniupnpd no está corriendo (normal)"
fi

# 6. Estado de los servicios locales
echo ""
echo "🔧 Estado de servicios locales:"
echo "   WireGuard (UDP 51820):"
ss -ulnp | grep :51820 >/dev/null && echo "     ✅ Escuchando" || echo "     ❌ No escuchando"

echo "   Servidor API (TCP 8001):"
ss -tlnp | grep :8001 >/dev/null && echo "     ✅ Escuchando" || echo "     ❌ No escuchando"

# 7. Resumen y recomendaciones
echo ""
echo "📋 RESUMEN:"
echo "==========="

if upnpc -s 2>/dev/null | grep -q "Found"; then
    echo "✅ UPnP DETECTADO - Puedes usar mapeos automáticos"
    echo "   Ejecuta: ./configurar_upnp.sh para mapear puertos"
else
    echo "❌ UPnP NO DETECTADO"
    echo "   Posibles causas:"
    echo "   • UPnP deshabilitado en el router"
    echo "   • Firewall bloqueando multicast (239.255.255.250:1900)"
    echo "   • Router sin soporte UPnP/IGD"
    echo "   • Estás detrás de otro router/ISP con CGNAT"
    echo ""
    echo "   Soluciones:"
    echo "   1. Habilita UPnP en el panel del router"
    echo "   2. Usa Port Forwarding manual:"
    echo "      • UDP 51820 → 192.168.101.71:51820 (WireGuard)"
    echo "      • TCP 8001 → 192.168.101.71:8001 (API)"
    echo "   3. Si hay CGNAT, considera un VPS/túnel externo"
fi

echo ""
echo "🌐 Para acceso externo (cuando esté configurado):"
echo "   API: http://$PUBLIC_IP:8001"
echo "   WireGuard: $PUBLIC_IP:51820"