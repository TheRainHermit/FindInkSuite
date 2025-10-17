# FindInkSuite 🎨

# 🎨 FindInkSuite - Sistema de Gestión de Tatuajes# 🎯 SERVIDOR TATTOO HACKATHON - PROYECTO DEFINITIVO

## Sistema Completo de Gestión de Tatuajes



**FindInkSuite** es una plataforma integral para la gestión de estudios de tatuajes, que incluye frontend moderno con React/Next.js y backend potente con FastAPI.

## 📋 Descripción## 📁 Archivos del proyecto:

## 🏗️ Estructura del Proyecto

Sistema completo de gestión de tatuajes desarrollado con FastAPI, que incluye autenticación, gestión de citas, catálogo de tatuajes y chat con IA. Diseñado para estudios de tatuajes y artistas.- `tattoo_8001.py` - Servidor API principal

```

FindInkSuite/- `servidor_definitivo.sh` - Script único para ejecutar todo

├── 🎨 Frontend/              # Aplicación React/Next.js

│   ├── src/                  # Código fuente del frontend## ✨ Características- `vpn-config/` - Configuración VPN (opcional)

│   ├── public/               # Archivos estáticos

│   └── components.json       # Configuración de componentes- `requirements.txt` - Dependencias Python

│

├── ⚡ Backend/               # API FastAPI### 🔐 Autenticación

│   ├── api/                  # Servidores y endpoints

│   ├── scripts/              # Scripts de automatización- Sistema de login con JWT## 🚀 EJECUTAR EL SISTEMA:

│   ├── tests/                # Tests y verificaciones

│   └── requirements.txt      # Dependencias Python- Roles de usuario (Artista, Admin)

│

├── 📚 Docs/                  # Documentación- Autenticación segura con tokens```bash

│   ├── technical/            # Documentación técnica

│   ├── user-guides/          # Guías de usuario# Un solo comando para todo:

│   └── quick-start/          # Acceso rápido

│### 🎨 Gestión de Tatuajes./servidor_definitivo.sh

└── 🔧 Config/                # Configuraciones

    ├── .github/workflows/    # CI/CD- Catálogo completo de diseños```

    └── temp-files/           # Archivos temporales

```- Información detallada (estilo, precio, artista)



## 🚀 Inicio Rápido- API REST para integración con frontend## 🌐 URLs para tu compañero:



### Frontend

```bash

npm install### 📅 Sistema de Citas### 📚 **PRINCIPAL (LocalTunnel):**

npm run dev

```- Gestión de citas y reservas- **Documentación**: `https://tattoo-hackathon-1006.loca.lt/docs`



### Backend- Estados de cita (confirmada, pendiente)- **API Base**: `https://tattoo-hackathon-1006.loca.lt/api`

```bash

cd backend- Información de clientes- **Estado**: `https://tattoo-hackathon-1006.loca.lt/status`

pip install -r requirements.txt

python api/main.py

```

### 🤖 Chat IA### 🏠 **ALTERNATIVA (IP Directa):**

### URLs de Desarrollo

- **Frontend**: http://localhost:3000- Asistente inteligente para consultas- **Documentación**: `http://190.217.23.26:8001/docs`

- **Backend API**: http://localhost:8001

- **API Docs**: http://localhost:8001/docs- Respuestas contextuales sobre tatuajes- **API Base**: `http://190.217.23.26:8001/api`



## 📖 Documentación- Información sobre precios y estilos



- **[Guía Rápida](docs/quick-start/)**: Para empezar inmediatamente## 🎯 ENDPOINTS COMPLETOS:

- **[Tutorial Completo](docs/user-guides/)**: Guía paso a paso

- **[Documentación Técnica](docs/technical/)**: Detalles técnicos### 🌐 CORS Configurado

- **[API Reference](docs/technical/API_PARA_COMPAÑERO.md)**: Documentación de endpoints

- Acceso desde cualquier frontend### 🔐 **Autenticación:**

## 🛠️ Tecnologías

- Headers completamente configurados- `POST /api/auth/login` - Login de usuario

### Frontend

- **React 18+** con TypeScript- Sin restricciones de origen- `GET /api/auth/me` - Info del usuario actual

- **Next.js** para SSR/SSG

- **Tailwind CSS** para estilos

- **Vite** para desarrollo rápido

## 🚀 Instalación y Uso### 🎨 **Tatuajes:**

### Backend

- **FastAPI** para APIs rápidas- `GET /api/tattoos` - Listar todos los tatuajes

- **Python 3.8+**

- **JWT** para autenticación### Prerrequisitos- `POST /api/tattoos` - Crear nuevo tatuaje

- **CORS** configurado para desarrollo

```bash- `GET /api/tattoos/{id}` - Obtener tatuaje específico

## 🤝 Para Desarrolladores

pip install fastapi uvicorn pydantic[email]- `PUT /api/tattoos/{id}` - Actualizar tatuaje

Si eres un compañero desarrollador:

```- `DELETE /api/tattoos/{id}` - Eliminar tatuaje

1. **Clona el repositorio**

2. **Consulta `/docs/quick-start/`** para acceso inmediato

3. **Revisa `/docs/user-guides/`** para entender el sistema

4. **Backend**: Ejecuta `python backend/api/main.py`### Ejecutar el Servidor### 👥 **Clientes:**

5. **Frontend**: Ejecuta `npm run dev`

```bash- `GET /api/clients` - Listar todos los clientes ✅ **SOLUCIONADO**

## 📞 Soporte

python3 temp_middle.py- `POST /api/clients` - Crear nuevo cliente

Para problemas o dudas:

- Revisa la documentación en `/docs/````- `GET /api/clients/{id}` - Obtener cliente específico

- Consulta los logs en `/backend/logs/`

- Ejecuta los scripts de diagnóstico en `/backend/scripts/`- `PUT /api/clients/{id}` - Actualizar cliente



---El servidor se ejecutará en: `http://localhost:8001`- `DELETE /api/clients/{id}` - Eliminar cliente



**FindInkSuite** - *Tu estudio de tatuajes, digitalizado* ✨

### Documentación API### 📅 **Citas:**

Una vez ejecutado, accede a: `http://localhost:8001/docs`- `GET /api/appointments` - Listar todas las citas

- `POST /api/appointments` - Crear nueva cita

## 📡 Acceso Remoto- `GET /api/appointments/{id}` - Obtener cita específica

- `PUT /api/appointments/{id}/status` - Actualizar estado de cita

### LocalTunnel (Recomendado)

```bash## 🔑 **Usuarios de prueba:**

# Instalar LocalTunnel- **Artista**: `juan@tattoo.com` / `123456`

npm install -g localtunnel- **Admin**: `maria@tattoo.com` / `admin123`



# Crear túnel## 📊 **Datos de ejemplo incluidos:**

lt --port 8001- ✅ 2 tatuajes de ejemplo

```- ✅ 3 clientes de ejemplo

- ✅ Sistema de roles completo

## 📊 Endpoints Principales- ✅ Validaciones de seguridad



### Autenticación## 🛠️ **Características:**

- `POST /api/auth/login` - Login de usuario- ✅ LocalTunnel sin límites

- ✅ VPN opcional incluida

### Tatuajes- ✅ CORS configurado

- `GET /api/tattoos` - Lista de tatuajes- ✅ Autenticación por tokens

- `GET /api/tattoos/{id}` - Tatuaje específico- ✅ Documentación automática

- ✅ Manejo de errores completo

### Citas

- `GET /api/appointments` - Lista de citas## 🎯 **Problema solucionado:**

**Error 404 en `/api/clients`** → ✅ **SOLUCIONADO**

### IA Chat

- `POST /api/ai/quick-chat` - Chat con asistenteEl endpoint ahora existe y devuelve lista de clientes con autenticación requerida.



### Utilidades## 💡 **Uso rápido:**

- `GET /api/cors-test` - Test de CORS1. Ejecutar: `./servidor_definitivo.sh`

- `GET /status` - Estado del sistema2. Compartir URL: `https://tattoo-hackathon-1006.loca.lt/docs`

3. Usar credenciales: `juan@tattoo.com` / `123456`

## 👤 Usuarios de Prueba4. ¡Listo para el hackathon!



### Artista---

```**Sistema limpio, organizado y funcional** 🚀
Email: juan@tattoo.com
Password: 123456
```

### Administrador
```
Email: maria@tattoo.com
Password: admin123
```

## 🧪 Ejemplo de Uso

```javascript
// Test de conexión
fetch('http://localhost:8001/api/cors-test')
  .then(r => r.json())
  .then(data => console.log('✅ CORS:', data.cors_test));

// Login
fetch('http://localhost:8001/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'juan@tattoo.com',
    password: '123456'
  })
})
.then(r => r.json())
.then(data => console.log('Usuario:', data.user.name));
```

## 🏗️ Arquitectura

- **FastAPI**: Framework web moderno
- **Uvicorn**: Servidor ASGI
- **Pydantic**: Validación de datos
- **CORS**: Configurado para acceso remoto

## 📁 Archivos Principales

- `temp_middle.py` - Servidor principal
- `README.md` - Este archivo
- `TUTORIAL_COMPAÑERO.md` - Guía para desarrolladores
- `API_PARA_COMPAÑERO.md` - Documentación API

## 🔧 Estado del Sistema

El sistema incluye monitoreo automático y archivos de estado:
- `SERVIDOR_ACTIVO.md` - Estado actual
- `sistema_completo.log` - Logs del servidor

---

**Desarrollado para la comunidad de tatuajes** 🎯

¡Dale una ⭐ si este proyecto te ayuda!
=======
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3ed098bd-9983-4b8f-94f1-c18bc37213a8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3ed098bd-9983-4b8f-94f1-c18bc37213a8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3ed098bd-9983-4b8f-94f1-c18bc37213a8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
>>>>>>> 481dbc8294493af5c5a8196dae9e7d1739b80b44


# Commit realizado por asistente el Thu, 16 Oct 2025 15:58:29 -0500
