# 🎨 API DE GESTIÓN DE TATUAJES - PARA TU COMPAÑERO

## 🚀 SERVIDOR ACTIVO Y FUNCIONANDO

**✅ Estado:** ONLINE  
**🌐 Puerto:** 8001 (TCP)  
**🔗 IP Pública:** 190.217.23.26  
**📍 IP Local:** 192.168.101.71  

---

## 🌐 URLS PRINCIPALES

### 🎯 Base URL:
```
http://190.217.23.26:8001
```

### 📚 Documentación interactiva (Swagger):
```
http://190.217.23.26:8001/docs
```

### 🧪 Test rápido:
```
http://190.217.23.26:8001/api/cors-test
```

---

## 🔗 ENDPOINTS DISPONIBLES

### 📋 Información del sistema:
- **GET** `/` - Info básica del sistema
- **GET** `/status` - Estado detallado del servidor
- **GET** `/api/connection-info` - Información completa para desarrollo

### 🔐 Autenticación:
- **POST** `/api/auth/login` - Login de usuario

### 🎨 Tatuajes:
- **GET** `/api/tattoos` - Lista de tatuajes disponibles
- **GET** `/api/tattoos/{id}` - Detalles de un tatuaje específico

### 📅 Citas:
- **GET** `/api/appointments` - Lista de citas agendadas

### 🤖 IA/Chat:
- **POST** `/api/ai/quick-chat` - Chat con asistente de tatuajes

### 🧪 Testing:
- **GET** `/api/cors-test` - Verificar que CORS funciona

---

## 💻 CÓDIGO JavaScript PARA TU COMPAÑERO

### ⚡ Configuración básica:

```javascript
// Base URL de la API
const API_BASE = 'http://190.217.23.26:8001';

// Headers por defecto
const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Función helper para requests
const apiCall = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
};
```

### 🧪 Test de conexión:

```javascript
// Verificar que la API funciona
const testConnection = async () => {
    try {
        const result = await apiCall('/api/cors-test');
        console.log('✅ CORS Test:', result.cors_test);
        console.log('📝 Mensaje:', result.message);
        return true;
    } catch (error) {
        console.error('❌ Error conectando:', error);
        return false;
    }
};

// Ejecutar test
testConnection();
```

### 🔐 Sistema de autenticación:

```javascript
// Login de usuario
const login = async (email, password) => {
    try {
        const result = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        // Guardar token
        localStorage.setItem('auth_token', result.access_token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        
        console.log('✅ Login exitoso:', result.user);
        return result;
    } catch (error) {
        console.error('❌ Error en login:', error);
        throw error;
    }
};

// Ejemplo de uso
login('juan@tattoo.com', '123456');
```

### 🎨 Obtener tatuajes:

```javascript
// Listar todos los tatuajes
const getTattoos = async () => {
    try {
        const result = await apiCall('/api/tattoos');
        console.log('🎨 Tatuajes disponibles:', result.tattoos);
        return result.tattoos;
    } catch (error) {
        console.error('❌ Error obteniendo tatuajes:', error);
    }
};

// Obtener un tatuaje específico
const getTattoo = async (id) => {
    try {
        const tattoo = await apiCall(`/api/tattoos/${id}`);
        console.log('🎨 Tatuaje:', tattoo);
        return tattoo;
    } catch (error) {
        console.error('❌ Error obteniendo tatuaje:', error);
    }
};

// Ejemplos
getTattoos();
getTattoo(1);
```

### 🤖 Chat con IA:

```javascript
// Chat con el asistente de tatuajes
const chatWithAI = async (message) => {
    try {
        const result = await apiCall('/api/ai/quick-chat', {
            method: 'POST',
            body: JSON.stringify({ message })
        });
        
        console.log('🤖 Asistente:', result.response);
        return result.response;
    } catch (error) {
        console.error('❌ Error en chat:', error);
    }
};

// Ejemplos de uso
chatWithAI('Hola');
chatWithAI('¿Qué estilos de tatuajes tienen?');
chatWithAI('¿Cuánto cuesta un tatuaje?');
```

### 📅 Obtener citas:

```javascript
// Listar citas agendadas
const getAppointments = async () => {
    try {
        const result = await apiCall('/api/appointments');
        console.log('📅 Citas:', result.appointments);
        return result.appointments;
    } catch (error) {
        console.error('❌ Error obteniendo citas:', error);
    }
};

getAppointments();
```

---

## 👥 USUARIOS DE PRUEBA

### 🎨 Artista:
```json
{
    "email": "juan@tattoo.com",
    "password": "123456",
    "rol": "artist"
}
```

### 👨‍💼 Administrador:
```json
{
    "email": "maria@tattoo.com", 
    "password": "admin123",
    "rol": "admin"
}
```

---

## 🔧 EJEMPLO COMPLETO - APLICACIÓN REACT

```jsx
import React, { useState, useEffect } from 'react';

const TattooApp = () => {
    const [tattoos, setTattoos] = useState([]);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');

    const API_BASE = 'http://190.217.23.26:8001';

    // Cargar tatuajes al iniciar
    useEffect(() => {
        fetch(`${API_BASE}/api/tattoos`)
            .then(r => r.json())
            .then(data => setTattoos(data.tattoos))
            .catch(console.error);
    }, []);

    // Login
    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'juan@tattoo.com',
                    password: '123456'
                })
            });
            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error('Error login:', error);
        }
    };

    // Chat
    const handleChat = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/ai/quick-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            setChatResponse(data.response);
        } catch (error) {
            console.error('Error chat:', error);
        }
    };

    return (
        <div>
            <h1>🎨 Sistema de Tatuajes</h1>
            
            {/* Login */}
            <div>
                <button onClick={handleLogin}>
                    {user ? `Hola ${user.name}` : 'Login'}
                </button>
            </div>

            {/* Tatuajes */}
            <div>
                <h2>Tatuajes Disponibles:</h2>
                {tattoos.map(tattoo => (
                    <div key={tattoo.id}>
                        <h3>{tattoo.name}</h3>
                        <p>Estilo: {tattoo.style}</p>
                        <p>Precio: ${tattoo.price}</p>
                        <p>Artista: {tattoo.artist}</p>
                    </div>
                ))}
            </div>

            {/* Chat */}
            <div>
                <h2>Chat con IA:</h2>
                <input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Pregunta algo..."
                />
                <button onClick={handleChat}>Enviar</button>
                {chatResponse && <p>🤖 {chatResponse}</p>}
            </div>
        </div>
    );
};

export default TattooApp;
```

---

## 🚀 INSTRUCCIONES RÁPIDAS

### 1. Test inmediato:
```bash
curl http://190.217.23.26:8001/api/cors-test
```

### 2. Ver documentación:
Abre en el navegador: http://190.217.23.26:8001/docs

### 3. Login de prueba:
```bash
curl -X POST http://190.217.23.26:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@tattoo.com","password":"123456"}'
```

### 4. Chat de prueba:
```bash
curl -X POST http://190.217.23.26:8001/api/ai/quick-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola"}'
```

---

## ✅ CARACTERÍSTICAS

- **🌐 CORS configurado** - Sin problemas de políticas
- **🔐 Autenticación JWT** - Sistema de login funcional  
- **🎨 CRUD de tatuajes** - Gestión completa
- **📅 Sistema de citas** - Agendamiento
- **🤖 Chat con IA** - Asistente inteligente
- **📚 Documentación automática** - Swagger UI
- **🧪 Endpoints de testing** - Verificación fácil

---

## 🎯 RESUMEN PARA TU COMPAÑERO

**✅ TODO LISTO - Puede empezar a usar la API YA**

1. **URL Base:** `http://190.217.23.26:8001`
2. **Documentación:** `http://190.217.23.26:8001/docs`
3. **Sin problemas CORS** - Funciona desde cualquier frontend
4. **Usuarios de prueba disponibles** - juan@tattoo.com / 123456
5. **Endpoints completos** - Auth, Tatuajes, Citas, Chat IA

**¡Tu hackathon puede continuar sin problemas! 🚀**