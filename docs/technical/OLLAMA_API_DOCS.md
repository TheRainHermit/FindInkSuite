# 🤖 ENDPOINTS DE OLLAMA IA - BACKEND PARA FRONTEND

## 🌐 URL BASE:
```
https://tattoo-hackathon-1006.loca.lt
```

## 🎯 ENDPOINTS DISPONIBLES:

### 1. 📊 **Obtener modelos disponibles**
```http
GET /api/ai/models
```

**Respuesta:**
```json
{
  "available_models": [
    {
      "name": "phi:latest",
      "size": 1602463378,
      "modified_at": "2025-10-08T09:14:43.185708703-05:00"
    },
    {
      "name": "mistral:latest", 
      "size": 4372824384,
      "modified_at": "2025-10-08T09:18:41.024748087-05:00"
    },
    {
      "name": "llama2:7b-chat",
      "size": 3826793677,
      "modified_at": "2025-10-08T09:22:43.100691242-05:00"
    }
  ],
  "recommended": ["phi", "mistral", "llama2:7b-chat"],
  "status": "online"
}
```

### 2. 💬 **Chat general con IA**
```http
POST /api/ai/chat
Content-Type: application/json
```

**Request:**
```json
{
  "message": "Hola, ¿cómo estás?",
  "model": "phi",  // Opciones: "phi", "mistral", "llama2:7b-chat"
  "context": ""    // Opcional: contexto adicional
}
```

**Response:**
```json
{
  "response": "¡Hola! Estoy muy bien, gracias por preguntar...",
  "model_used": "phi",
  "processing_time": 2.34,
  "timestamp": "2025-10-08T15:30:45.123456"
}
```

### 3. 🎨 **Asistente especializado en tatuajes**
```http
POST /api/ai/tattoo-assistant
Content-Type: application/json
```

**Request:**
```json
{
  "client_message": "Quiero un tatuaje pequeño y discreto",
  "tattoo_context": "",  // Opcional: contexto adicional
  "model": "mistral"     // Recomendado: mistral para mejores respuestas
}
```

**Response:**
```json
{
  "ai_response": "Para un tatuaje pequeño y discreto, te recomiendo...",
  "recommendations": [
    "Diseño minimalista",
    "Ubicación discreta", 
    "Primera sesión"
  ],
  "model_used": "mistral",
  "processing_time": 3.45
}
```

### 4. 🎯 **Sugerencias de diseños personalizadas**
```http
POST /api/ai/design-suggestions
Content-Type: application/json
```

**Request:**
```json
{
  "style": "minimalista",
  "size": "pequeño",
  "location": "muñeca",
  "theme": "naturaleza"
}
```

**Response:**
```json
{
  "suggestions": "Basándome en tus preferencias, aquí tienes 3 sugerencias...",
  "processing_time": 4.12,
  "criteria_used": {
    "style": "minimalista",
    "size": "pequeño", 
    "location": "muñeca",
    "theme": "naturaleza"
  }
}
```

## 🚀 **Recomendaciones de uso:**

### **Modelos por velocidad:**
- **🏃 Phi**: Más rápido (1-3 segundos) - Para respuestas simples
- **⚡ Mistral**: Equilibrado (3-8 segundos) - Mejor calidad/velocidad
- **🧠 Llama2:7b-chat**: Más lento (5-15 segundos) - Conversaciones naturales

### **Frontend - Ejemplos JavaScript:**

```javascript
// 1. Obtener modelos disponibles
const getModels = async () => {
  const response = await fetch('https://tattoo-hackathon-1006.loca.lt/api/ai/models');
  return await response.json();
};

// 2. Chat con IA
const chatWithAI = async (message, model = 'phi') => {
  const response = await fetch('https://tattoo-hackathon-1006.loca.lt/api/ai/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      message: message,
      model: model
    })
  });
  return await response.json();
};

// 3. Asistente de tatuajes
const getTattooAdvice = async (clientMessage, model = 'mistral') => {
  const response = await fetch('https://tattoo-hackathon-1006.loca.lt/api/ai/tattoo-assistant', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      client_message: clientMessage,
      model: model
    })
  });
  return await response.json();
};

// 4. Sugerencias de diseño
const getDesignSuggestions = async (preferences) => {
  const response = await fetch('https://tattoo-hackathon-1006.loca.lt/api/ai/design-suggestions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(preferences)
  });
  return await response.json();
};
```

## ⚠️ **Consideraciones importantes:**
- **Timeout**: Los modelos pueden tardar 5-15 segundos en responder
- **Modelo recomendado**: Usa `mistral` para balance entre velocidad y calidad
- **Fallback**: Si un modelo falla, cambia a `phi` (más rápido)
- **Contexto**: Provide contexto relevante para mejores respuestas

## 🎯 **¡Backend listo para que el frontend consuma Ollama!**