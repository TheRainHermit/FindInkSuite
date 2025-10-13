# 🔐 INSTRUCCIONES VPN - CONEXIÓN AL HACKATHON

## 🎯 **PASOS PARA CONECTARTE:**

### **1. INSTALAR WIREGUARD:**
- **Windows:** https://wireguard.com/install/
- **macOS:** App Store o https://wireguard.com/install/
- **Linux:** `sudo apt install wireguard`

### **2. CONFIGURAR VPN:**
1. Abrir WireGuard
2. Hacer clic en **"Add Tunnel"** o **"Añadir túnel"**
3. Seleccionar **"Import from file"** o **"Importar desde archivo"**
4. Seleccionar el archivo **`client.conf`** que te enviaron
5. Hacer clic en **"Activate"** o **"Activar"**

### **3. VERIFICAR CONEXIÓN:**
Después de activar la VPN, deberías poder acceder a:
- **Documentación:** http://10.0.0.1:8001/docs
- **Estado del API:** http://10.0.0.1:8001/status

---

## 🔗 **URLS DEL API (después de conectar VPN):**

```
📚 Documentación: http://10.0.0.1:8001/docs
🔗 API Base:      http://10.0.0.1:8001/api
❤️ Estado:        http://10.0.0.1:8001/status
📋 Info Completa: http://10.0.0.1:8001/api/connection-info
```

## 🔑 **USUARIOS DE PRUEBA:**

```
👨‍🎨 Artista:
   📧 Email: juan@tattoo.com
   🔑 Password: 123456

👩‍💼 Admin:
   📧 Email: maria@tattoo.com  
   🔑 Password: admin123
```

## 🚀 **CÓMO USAR EL API:**

### **1. Hacer Login:**
```bash
curl -X POST "http://10.0.0.1:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@tattoo.com", "password": "123456"}'
```

### **2. Usar el Token:**
Copiar el `access_token` de la respuesta y usarlo en todas las peticiones:
```bash
curl -H "Authorization: Bearer TU_TOKEN_AQUI" \
  "http://10.0.0.1:8001/api/tattoos"
```

## 🎨 **ENDPOINTS PRINCIPALES:**

### **Autenticación:**
- `POST /api/auth/login` - Hacer login
- `GET /api/auth/me` - Info del usuario actual

### **Tatuajes:**
- `GET /api/tattoos` - Listar tatuajes
- `POST /api/tattoos` - Crear tatuaje
- `GET /api/tattoos/{id}` - Ver tatuaje específico
- `PUT /api/tattoos/{id}` - Actualizar tatuaje
- `DELETE /api/tattoos/{id}` - Eliminar tatuaje

### **Citas:**
- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita (sin auth)
- `GET /api/appointments/{id}` - Ver cita específica
- `PUT /api/appointments/{id}/status` - Actualizar estado

## 🧪 **PRUEBAS RÁPIDAS:**

### **1. Verificar conexión:**
```bash
curl http://10.0.0.1:8001/status
```

### **2. Ver documentación interactiva:**
Ir a: `http://10.0.0.1:8001/docs`

### **3. Obtener info completa:**
```bash
curl http://10.0.0.1:8001/api/connection-info
```

---

## ⚠️ **SOLUCIÓN DE PROBLEMAS:**

### **No puedo conectar la VPN:**
1. Verificar que WireGuard esté instalado
2. Verificar que el archivo `client.conf` sea válido
3. Intentar desactivar y volver a activar la VPN

### **No puedo acceder al API:**
1. Verificar que la VPN esté conectada (ícono activo)
2. Probar: `ping 10.0.0.1`
3. Si el ping funciona, probar: `curl http://10.0.0.1:8001/status`

### **Error de autenticación:**
1. Verificar email y password exactos
2. El token tiene formato: `Authorization: Bearer TOKEN_AQUI`

---

## 📱 **INFORMACIÓN TÉCNICA:**

- **Red VPN:** 10.0.0.0/24
- **Tu IP en VPN:** 10.0.0.2
- **Servidor:** 10.0.0.1
- **Puerto API:** 8001
- **Puerto VPN:** 51820

---

## 🎯 **¡LISTO PARA EL HACKATHON!**

Una vez conectada la VPN, tendrás acceso completo al sistema de gestión de tatuajes con todas las funcionalidades para el hackathon.

**¡Buena suerte! 🚀**