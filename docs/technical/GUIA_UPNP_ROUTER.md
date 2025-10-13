# 🔧 GUÍA PARA HABILITAR UPnP EN EL ROUTER

## 📊 DIAGNÓSTICO ACTUAL

✅ **Tu IP pública:** 190.217.23.26  
✅ **Gateway/Router:** 192.168.101.1  
✅ **Servicios locales:** WireGuard (UDP 51820) y API (TCP 8001) escuchando  
❌ **UPnP:** NO detectado desde tu host  
❌ **Puerto 8001:** NO accesible desde Internet  
⚠️ **Puerto 51820:** Parece accesible (UDP normal timeout)  

## 🎯 CONCLUSIÓN

**UPnP NO está funcionando** - necesitas configuración manual del router.

---

## 🔧 MÉTODO 1: HABILITAR UPnP EN EL ROUTER

### 📱 Accede al panel del router:

```bash
# Abre en el navegador:
http://192.168.101.1
```

Credenciales comunes:
- admin / admin
- admin / password
- admin / (vacío)
- Ver etiqueta del router

### 🔍 Busca estas secciones:

**Routers TP-Link:**
- Advanced → NAT Forwarding → UPnP
- Advanced Settings → UPnP

**Routers ASUS:**
- WAN → Internet Connection → Enable UPnP
- Adaptive QoS → Traditional QoS → Enable UPnP

**Routers Netgear:**
- Dynamic DNS → UPnP Portmapping
- Advanced → Dynamic DNS → UPnP

**Routers Linksys:**
- Smart Wi-Fi Settings → Media Prioritization → UPnP

**Routers genéricos:**
- NAT/Gaming → UPnP
- Firewall → UPnP
- Port Forwarding → UPnP

### ✅ Habilita UPnP:

1. ✅ **Enable UPnP** = ON/Enabled
2. ✅ **UPnP IGD** = ON (si aparece)
3. ✅ **Auto Port Mapping** = ON (si aparece)
4. 💾 **Guardar/Apply** configuración
5. 🔄 **Reiniciar** router (opcional pero recomendado)

---

## 🔧 MÉTODO 2: PORT FORWARDING MANUAL (ALTERNATIVA)

Si UPnP no funciona o no está disponible:

### 📍 Busca: "Port Forwarding", "Virtual Servers", "Gaming"

### ➕ Añade estas 2 reglas:

**Regla 1 - API Server:**
```
Service Name: API-Server
External Port: 8001
Internal IP: 192.168.101.71
Internal Port: 8001
Protocol: TCP
Status: Enabled
```

**Regla 2 - WireGuard VPN:**
```
Service Name: WireGuard-VPN
External Port: 51820
Internal IP: 192.168.101.71
Internal Port: 51820
Protocol: UDP
Status: Enabled
```

---

## 🧪 VERIFICACIÓN DESPUÉS DE CONFIGURAR

```bash
# Ejecuta este test para verificar:
./test_puertos_externos.sh

# Deberías ver:
# ✅ PUERTO 8001 ACCESIBLE - API responde
# ✅ PUERTO 51820 PROBABLEMENTE ACCESIBLE
```

### 🌐 URLs finales para tu compañero:

- **API:** http://190.217.23.26:8001
- **WireGuard:** 190.217.23.26:51820

---

## 🚨 SI SIGUE SIN FUNCIONAR

### Posibles causas:

1. **CGNAT del ISP:**
   - Tu ISP usa Carrier-Grade NAT
   - La IP 190.217.23.26 es compartida
   - **Solución:** Contacta al ISP para IP pública dedicada

2. **Firewall del ISP:**
   - ISP bloquea puertos no-estándar
   - **Solución:** Usa puertos comunes (80, 443, 22)

3. **Doble NAT:**
   - Router detrás de otro router/módem
   - **Solución:** Configura módem en modo bridge

### 🔄 Alternativas rápidas:

```bash
# 1. LocalTunnel (temporal)
npm install -g localtunnel
lt --port 8001 --subdomain tu-proyecto

# 2. CloudFlare Tunnel (gratis, permanente)
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
cloudflared tunnel --hello-world

# 3. ngrok (freemium)
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
./ngrok http 8001
```

---

## ⚡ SIGUIENTES PASOS

1. 🔧 **Configura el router** (UPnP o Port Forwarding)
2. 🧪 **Ejecuta:** `./test_puertos_externos.sh`
3. ✅ **Si funciona:** Comparte URLs con tu compañero
4. ❌ **Si no funciona:** Usa alternativas de túnel

**¡El servidor está listo, solo falta abrir el router!** 🚀