# 🎨 API DE TATUAJES - ACCESO PARA TU COMPAÑERO

## 🚀 URL PRINCIPAL (FUNCIONANDO AHORA)
```
https://tattoo-final-demo.loca.lt
```

## ✅ ESTADO DEL SISTEMA
- ✅ Servidor local: ACTIVO (puerto 8001)
- ✅ Túnel LocalTunnel: ACTIVO 
- ✅ CORS: CONFIGURADO
- ✅ Endpoints: FUNCIONANDO

## 📋 ENDPOINTS PRINCIPALES

### 🔗 URLs para tu compañero:
- **API Principal**: `https://tattoo-final-demo.loca.lt`
- **Documentación Swagger**: `https://tattoo-final-demo.loca.lt/docs`
- **Test CORS**: `https://tattoo-final-demo.loca.lt/api/cors-test`
- **Estado del sistema**: `https://tattoo-final-demo.loca.lt/status`
- **Info de conexión**: `https://tattoo-final-demo.loca.lt/api/connection-info`

### 🔐 Autenticación:
- **Login**: `https://tattoo-final-demo.loca.lt/api/auth/login`

### 🎨 Tatuajes:
- **Lista de tatuajes**: `https://tattoo-final-demo.loca.lt/api/tattoos`
- **Tatuaje específico**: `https://tattoo-final-demo.loca.lt/api/tattoos/{id}`

### 📅 Citas:
- **Lista de citas**: `https://tattoo-final-demo.loca.lt/api/appointments`

### 🤖 IA Chat:
- **Chat con IA**: `https://tattoo-final-demo.loca.lt/api/ai/quick-chat`

## 👤 USUARIOS DE PRUEBA

```javascript
// Usuario Artista
{
  "email": "juan@tattoo.com",
  "password": "123456"
}

// Usuario Admin
{
  "email": "maria@tattoo.com", 
  "password": "admin123"
}
```

## 🧪 CÓDIGO DE EJEMPLO PARA TU COMPAÑERO

### 1. Configuración Base
```javascript
const API_BASE = 'https://tattoo-final-demo.loca.lt';

// Headers básicos
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};
```

### 2. Test de Conexión
```javascript
// Probar que la API funciona
fetch(`${API_BASE}/api/cors-test`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ API funcionando:', data);
  })
  .catch(error => {
    console.log('❌ Error de conexión:', error);
  });
```

### 3. Login y Obtener Token
```javascript
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Login exitoso:', data);
            // Guardar el token
            localStorage.setItem('tattoo_token', data.access_token);
            return data.access_token;
        } else {
            console.log('❌ Error de login:', data);
            return null;
        }
    } catch (error) {
        console.log('❌ Error de conexión:', error);
        return null;
    }
}

// Ejemplo de uso
login('juan@tattoo.com', '123456');
```

### 4. Obtener Tatuajes
```javascript
async function getTattoos() {
    try {
        const response = await fetch(`${API_BASE}/api/tattoos`, {
            headers: headers
        });
        
        const data = await response.json();
        console.log('🎨 Tatuajes disponibles:', data);
        return data;
    } catch (error) {
        console.log('❌ Error obteniendo tatuajes:', error);
        return null;
    }
}
```

### 5. Chat con IA
```javascript
async function chatWithAI(message) {
    try {
        const response = await fetch(`${API_BASE}/api/ai/quick-chat`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                message: message
            })
        });
        
        const data = await response.json();
        console.log('🤖 Respuesta de IA:', data.response);
        return data;
    } catch (error) {
        console.log('❌ Error en chat:', error);
        return null;
    }
}

// Ejemplo de uso
chatWithAI('Hola, quiero información sobre tatuajes');
```

## 🔧 EJEMPLO COMPLETO EN HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test API Tatuajes</title>
</head>
<body>
    <h1>🎨 Test API de Tatuajes</h1>
    
    <button onclick="testConnection()">Test Conexión</button>
    <button onclick="testLogin()">Test Login</button>
    <button onclick="getTattoos()">Obtener Tatuajes</button>
    <button onclick="testChat()">Test Chat IA</button>
    
    <div id="results"></div>

    <script>
        const API_BASE = 'https://tattoo-final-demo.loca.lt';
        const resultsDiv = document.getElementById('results');
        
        function log(message, data = '') {
            resultsDiv.innerHTML += `<p><strong>${message}</strong><br>${JSON.stringify(data, null, 2)}</p>`;
        }
        
        async function testConnection() {
            try {
                const response = await fetch(`${API_BASE}/api/cors-test`);
                const data = await response.json();
                log('✅ Conexión exitosa:', data);
            } catch (error) {
                log('❌ Error de conexión:', error);
            }
        }
        
        async function testLogin() {
            try {
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: 'juan@tattoo.com',
                        password: '123456'
                    })
                });
                const data = await response.json();
                log('🔐 Login:', data);
            } catch (error) {
                log('❌ Error login:', error);
            }
        }
        
        async function getTattoos() {
            try {
                const response = await fetch(`${API_BASE}/api/tattoos`);
                const data = await response.json();
                log('🎨 Tatuajes:', data);
            } catch (error) {
                log('❌ Error tatuajes:', error);
            }
        }
        
        async function testChat() {
            try {
                const response = await fetch(`${API_BASE}/api/ai/quick-chat`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        message: 'Hola, cuéntame sobre los tatuajes'
                    })
                });
                const data = await response.json();
                log('🤖 Chat IA:', data);
            } catch (error) {
                log('❌ Error chat:', error);
            }
        }
    </script>
</body>
</html>
```

## 📱 INFORMACIÓN TÉCNICA

- **Método de acceso**: LocalTunnel (gratuito)
- **URL estable**: `https://tattoo-final-demo.loca.lt`
- **CORS**: Completamente configurado
- **Métodos soportados**: GET, POST, PUT, DELETE, OPTIONS
- **Formato de respuesta**: JSON
- **Autenticación**: Bearer Token (base64)

## ⚠️ NOTAS IMPORTANTES

1. **URL estable**: Mientras el túnel esté activo, la URL no cambiará
2. **CORS configurado**: Tu compañero no tendrá problemas de CORS
3. **Sin límites**: LocalTunnel es gratuito y sin restricciones
4. **Documentación**: Puede ver todos los endpoints en `/docs`

## 🆘 SI HAY PROBLEMAS

1. Verificar que la URL responde: `https://tattoo-final-demo.loca.lt`
2. Probar el endpoint de test: `https://tattoo-final-demo.loca.lt/api/cors-test`
3. Revisar la consola del navegador para errores CORS
4. Contactarte si el túnel se desconecta

¡Tu compañero ya puede usar la API sin problemas! 🚀