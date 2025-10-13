# Backend API - FindInkSuite

API backend para el sistema de gestión de tatuajes FindInkSuite.

## Estructura

```
backend/
├── api/           # Archivos principales de la API
│   ├── main.py    # Servidor principal FastAPI (Puerto 8001)
│   ├── server.py  # Servidor alternativo con más funcionalidades
│   └── proxy_*.py # Servidores proxy para desarrollo
├── scripts/       # Scripts de automatización
├── tests/         # Tests y scripts de verificación
├── logs/          # Archivos de log
└── requirements.txt # Dependencias Python
```

## Inicio Rápido

1. **Instalar dependencias:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Ejecutar servidor principal:**
```bash
python api/main.py
```

3. **Verificar funcionamiento:**
- API: http://localhost:8001
- Docs: http://localhost:8001/docs

## Archivos Principales

- `api/main.py`: Servidor FastAPI simplificado y limpio
- `api/server.py`: Servidor completo con todas las funcionalidades
- `requirements.txt`: Dependencias del proyecto

## Scripts Disponibles

Los scripts de automatización están en `scripts/` e incluyen:
- Configuración de túneles
- Diagnósticos de red
- Monitoreo del sistema
- Tests automatizados