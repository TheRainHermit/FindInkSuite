#!/bin/bash
set -e

# 🔧 Configurar UPnP/NAT-PMP para:
# - API (TCP 8001)
# - WireGuard (UDP 51820)
# Usa interfaz LAN principal (eth0: 192.168.101.71)

API_PORT=8001
WG_PORT=51820
LAN_IP="192.168.101.71"
LAN_IF="eth0"

log() {
  echo -e "$1"
}

check_tools() {
  which upnpc >/dev/null 2>&1 || { log "❌ upnpc no está instalado"; exit 1; }
  which natpmpc >/dev/null 2>&1 || log "⚠️ natpmpc no está instalado (opcional)"
}

show_network() {
  log "\n🌐 Interfaces IPv4 globales:"
  ip -4 addr show | awk '/inet / && /scope global/ {print "  " $2 " -> " $NF}'
  log "\n📡 Intentando descubrir IGD UPnP en $LAN_IF..."
  upnpc -m "$LAN_IF" -s || true
}

map_upnp() {
  log "\n🔧 Creando mapeos UPnP (si hay IGD):"
  log "- TCP $API_PORT -> $LAN_IP:$API_PORT"
  upnpc -m "$LAN_IF" -a "$LAN_IP" "$API_PORT" "$API_PORT" TCP || log "  ⚠️ Falló UPnP TCP $API_PORT"
  log "- UDP $WG_PORT -> $LAN_IP:$WG_PORT"
  upnpc -m "$LAN_IF" -a "$LAN_IP" "$WG_PORT" "$WG_PORT" UDP || log "  ⚠️ Falló UPnP UDP $WG_PORT"
}

map_natpmp() {
  if which natpmpc >/dev/null 2>&1; then
    log "\n🧪 Probando NAT-PMP (alternativa a UPnP):"
    natpmpc -g || true
    natpmpc -a "$API_PORT" "$API_PORT" TCP 3600 || log "  ⚠️ Falló NAT-PMP TCP $API_PORT"
    natpmpc -a "$WG_PORT" "$WG_PORT" UDP 3600 || log "  ⚠️ Falló NAT-PMP UDP $WG_PORT"
  else
    log "\nℹ️ NAT-PMP no disponible, omitiendo"
  fi
}

list_upnp() {
  log "\n📋 Listado de mapeos actuales (si hay IGD):"
  upnpc -m "$LAN_IF" -l || true
}

summary() {
  log "\n✅ Resumen"
  log "- Si ves 'No IGD UPnP Device found', el router no expone UPnP al host o está deshabilitado."
  log "- Verifica: UPnP habilitado en el router y que estás en la LAN correcta (192.168.101.0/24)."
  log "- Si tu ISP usa CGNAT, el puerto externo puede no ser accesible desde Internet."
  log "- Para WireGuard sin UPnP: configura 'Port Forwarding' UDP $WG_PORT -> $LAN_IP en el router."
  log "- Para la API: 'Port Forwarding' TCP $API_PORT -> $LAN_IP en el router."
}

check_tools
show_network
map_upnp
map_natpmp
list_upnp
summary
