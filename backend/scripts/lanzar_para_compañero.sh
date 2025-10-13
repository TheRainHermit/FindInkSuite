#!/bin/bash

echo "🚀 LANZADOR COMPLETO - CORS + TÚNEL ESPECÍFICO"
echo "==============================================="
echo ""

# Detener procesos anteriores
echo "🔄 Deteniendo procesos anteriores..."
pkill -f "python.*tattoo" 2>/dev/null
pkill -f "localtunnel\|lt --port" 2>/dev/null
sleep 2

# Iniciar servidor
echo "🎨 Iniciando servidor con CORS corregido..."
cd "/home/kali/Escritorio/server haketon/proyecto_limpio"
python3 tattoo_8001.py &
SERVER_PID=$!
echo "✅ Servidor iniciado (PID: $SERVER_PID)"

# Esperar a que el servidor esté listo
echo "⏳ Esperando servidor..."
sleep 5

# Verificar servidor local
echo "🧪 Probando servidor local..."
if curl -s http://localhost:8001/status > /dev/null; then
    echo "✅ Servidor local funcionando"
else
    echo "❌ Error: Servidor local no responde"
    exit 1
fi

# Iniciar túnel específico
echo "🌐 Iniciando túnel para tu compañero..."
echo "🔗 URL: https://tattoo-hackathon-1006.loca.lt"
npx localtunnel --port 8001 --subdomain tattoo-hackathon-1006 &
TUNNEL_PID=$!
echo "✅ Túnel iniciado (PID: $TUNNEL_PID)"

# Esperar a que el túnel esté listo
echo "⏳ Esperando túnel..."
sleep 10

# Probar túnel
echo "🧪 Probando túnel público..."
if curl -s https://tattoo-hackathon-1006.loca.lt/status > /dev/null; then
    echo "✅ Túnel público funcionando"
    
    # Probar CORS específico
    echo "🔧 Probando CORS para tu compañero..."
    curl -s -X POST https://tattoo-hackathon-1006.loca.lt/api/ai/quick-chat \
         -H "Content-Type: application/json" \
         -d '{"message": "test desde script"}' | head -3
    echo ""
    
else
    echo "⚠️  Túnel aún inicializándose, puede tardar 1-2 minutos más"
fi

echo ""
echo "==============================================="
echo "🎉 SISTEMA ACTIVO PARA TU COMPAÑERO"
echo "==============================================="
echo "🔗 URL Frontend: https://tattoo-hackathon-1006.loca.lt"
echo "📚 Documentación: https://tattoo-hackathon-1006.loca.lt/docs"
echo "🔑 Usuario prueba: juan@tattoo.com / 123456"
echo ""
echo "PIDs para control:"
echo "- Servidor: $SERVER_PID"
echo "- Túnel: $TUNNEL_PID"
echo ""
echo "💡 Para detener todo: pkill -f 'python.*tattoo'; pkill -f 'localtunnel'"
echo "==============================================="

# Mantener activo
echo "🔄 Manteniendo servicios activos..."
echo "   Presiona Ctrl+C para detener"

# Monitor en background
while true; do
    sleep 30
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        echo "⚠️  Servidor desconectado, reiniciando..."
        python3 tattoo_8001.py &
        SERVER_PID=$!
    fi
    if ! kill -0 $TUNNEL_PID 2>/dev/null; then
        echo "⚠️  Túnel desconectado, reiniciando..."
        npx localtunnel --port 8001 --subdomain tattoo-hackathon-1006 &
        TUNNEL_PID=$!
    fi
done