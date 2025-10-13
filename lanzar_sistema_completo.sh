#!/bin/bash

# =============================================================================
# 🚀 LANZADOR COMPLETO - SERVIDOR + TÚNEL
# =============================================================================

echo "🎨 INICIANDO SISTEMA COMPLETO DE TATUAJES"
echo "=========================================="

# Configuración
PROJECT_DIR="/home/kali/Escritorio/server haketon/proyecto_limpio"
SERVER_PORT=8001
LOG_FILE="$PROJECT_DIR/sistema_completo.log"

# Funciones
cleanup() {
    echo "🛑 Deteniendo sistema..."
    pkill -f "python3 temp_middle.py" 2>/dev/null
    pkill -f "lt --port $SERVER_PORT" 2>/dev/null
    echo "✅ Sistema detenido"
    exit 0
}

# Capturar señales para cleanup
trap cleanup SIGINT SIGTERM

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR" || exit 1

echo "📂 Directorio: $PROJECT_DIR"
echo "🔌 Puerto servidor: $SERVER_PORT"
echo "📝 Log: $LOG_FILE"
echo "=========================================="

# Detener procesos existentes
echo "🧹 Limpiando procesos anteriores..."
pkill -f "python3 temp_middle.py" 2>/dev/null
pkill -f "lt --port $SERVER_PORT" 2>/dev/null
sleep 2

# Iniciar servidor en background
echo "🚀 Iniciando servidor FastAPI..."
nohup python3 temp_middle.py > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

# Esperar a que el servidor esté listo
echo "⏳ Esperando servidor (5 segundos)..."
sleep 5

# Verificar que el servidor está funcionando
if curl -s http://localhost:$SERVER_PORT/status > /dev/null; then
    echo "✅ Servidor funcionando en puerto $SERVER_PORT"
else
    echo "❌ Error: Servidor no responde"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Iniciar túnel LocalTunnel
echo "🌐 Iniciando túnel LocalTunnel..."
echo "⏳ Creando túnel (puede tardar 30 segundos)..."

# Crear túnel en background y capturar la URL
lt --port $SERVER_PORT > tunnel_output.tmp 2>&1 &
TUNNEL_PID=$!

# Esperar y obtener la URL del túnel
sleep 10
if [ -f tunnel_output.tmp ]; then
    TUNNEL_URL=$(grep "your url is:" tunnel_output.tmp | awk '{print $4}')
    if [ ! -z "$TUNNEL_URL" ]; then
        echo "✅ Túnel creado: $TUNNEL_URL"
        echo "🌍 URL para compañero: $TUNNEL_URL"
    else
        echo "⏳ Túnel iniciándose..."
        sleep 10
        TUNNEL_URL=$(grep "your url is:" tunnel_output.tmp | awk '{print $4}')
        if [ ! -z "$TUNNEL_URL" ]; then
            echo "✅ Túnel creado: $TUNNEL_URL"
            echo "🌍 URL para compañero: $TUNNEL_URL"
        fi
    fi
fi

echo "=========================================="
echo "🎉 SISTEMA COMPLETO FUNCIONANDO"
echo "=========================================="
echo "📍 Servidor local: http://localhost:$SERVER_PORT"
echo "🌐 Servidor público: $TUNNEL_URL"
echo "📚 Documentación: ${TUNNEL_URL}/docs"
echo "🧪 Test CORS: ${TUNNEL_URL}/api/cors-test"
echo "🔐 Login: ${TUNNEL_URL}/api/auth/login"
echo "=========================================="
echo "👤 Usuarios de prueba:"
echo "   📧 juan@tattoo.com / 123456"
echo "   📧 maria@tattoo.com / admin123"
echo "=========================================="
echo "💾 PIDs: Servidor=$SERVER_PID, Túnel=$TUNNEL_PID"
echo "📝 Log del servidor: $LOG_FILE"
echo "=========================================="
echo "🔄 Sistema ejecutándose... (Ctrl+C para detener)"

# Guardar información para el compañero
cat > CONEXION_ACTIVA.md << EOF
# 🎯 CONEXIÓN ACTIVA PARA TU COMPAÑERO

## 🌐 URL PRINCIPAL:
\`\`\`
$TUNNEL_URL
\`\`\`

## 🧪 PRUEBAS INMEDIATAS:
1. **Test CORS**: $TUNNEL_URL/api/cors-test
2. **Documentación**: $TUNNEL_URL/docs
3. **Estado**: $TUNNEL_URL/status

## 👤 USUARIOS:
- Email: juan@tattoo.com, Password: 123456
- Email: maria@tattoo.com, Password: admin123

## 💻 TEST RÁPIDO:
\`\`\`javascript
fetch('$TUNNEL_URL/api/cors-test')
  .then(r => r.json())
  .then(data => console.log('✅ Funciona:', data));
\`\`\`

## 📅 CREADO: $(date)
EOF

echo "📄 Información guardada en: CONEXION_ACTIVA.md"
echo ""

# Monitoreo continuo
while true; do
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        echo "❌ Servidor se detuvo inesperadamente"
        break
    fi
    
    if ! kill -0 $TUNNEL_PID 2>/dev/null; then
        echo "⚠️  Túnel se desconectó, reinitiando..."
        lt --port $SERVER_PORT > tunnel_output.tmp 2>&1 &
        TUNNEL_PID=$!
        sleep 10
        NEW_URL=$(grep "your url is:" tunnel_output.tmp | awk '{print $4}')
        if [ ! -z "$NEW_URL" ]; then
            echo "✅ Túnel restaurado: $NEW_URL"
            TUNNEL_URL=$NEW_URL
            # Actualizar archivo de conexión
            sed -i "s|https://.*\.loca\.lt|$TUNNEL_URL|g" CONEXION_ACTIVA.md
        fi
    fi
    
    sleep 30
done

# Cleanup al salir
cleanup