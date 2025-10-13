# 🎨 ACCESO AL SISTEMA DE TATUAJES - PARA TU COMPAÑERO

## 🚀 URL TEMPORAL (FUNCIONANDO AHORA)
```
https://clever-corners-punch.loca.lt
```

## 📋 INFORMACIÓN IMPORTANTE

### ✅ URLs que SÍ FUNCIONAN:
- **API Principal**: `https://clever-corners-punch.loca.lt`
- **Documentación**: `https://clever-corners-punch.loca.lt/docs`
- **Test CORS**: `https://clever-corners-punch.loca.lt/api/cors-test`
- **Login**: `https://clever-corners-punch.loca.lt/api/auth/login`

### ❌ URLs que NO FUNCIONAN (Router cerrado):
- `http://190.217.23.26:8001` (puerto cerrado en router)

## 🔐 USUARIOS DE PRUEBA
```javascript
// Artista
{
  "email": "juan@tattoo.com",
  "password": "123456"
}

// Admin
{
  "email": "maria@tattoo.com", 
  "password": "admin123"
}
```

## 🧪 EJEMPLO DE USO PARA TU COMPAÑERO

### 1. Test de Conexión (JavaScript)
```javascript
const API_BASE = 'https://clever-corners-punch.loca.lt';

// Test básico
fetch(`${API_BASE}/api/cors-test`)
  .then(response => response.json())
  .then(data => console.log('✅ Conexión exitosa:', data))
  .catch(error => console.log('❌ Error:', error));
```

### 2. Login y Obtener Token
```javascript
async function login() {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'juan@tattoo.com',
            password: '123456'
        })
    });
    
    const data = await response.json();
    console.log('Token:', data.access_token);
    return data.access_token;
}
```

### 3. Obtener Tatuajes
```javascript
async function getTattoos(token) {
    const response = await fetch(`${API_BASE}/api/tattoos`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    console.log('Tatuajes:', data);
    return data;
}
```

## 🔄 CONFIGURACIÓN PERMANENTE (Para después)

Para acceso permanente sin túnel temporal, necesitas:

### 1. Configurar Router
- Ir a: `http://192.168.101.1`
- Port Forwarding: Puerto 8001 TCP → 192.168.101.71:8001
- Luego usar: `http://190.217.23.26:8001`

### 2. Verificar Puerto Abierto
```bash
curl -I http://190.217.23.26:8001/
```

## 📞 CONTACTO
- **Estado actual**: ✅ Túnel temporal activo
- **IP local servidor**: 192.168.101.71:8001
- **IP pública**: 190.217.23.26 (puerto cerrado)
- **Túnel temporal**: https://clever-corners-punch.loca.lt ✅

## ⚠️ IMPORTANTE
- El túnel temporal puede cambiar de URL si se reinicia
- Para uso permanente, configura el port forwarding en el router
- El servidor local está funcionando perfectamente