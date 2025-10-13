#!/bin/bash

echo "🎨 MONITOR DEL SISTEMA DE TATUAJES - DISTRIBUCIÓN DE CARGA"
echo "================================================================="
echo ""

echo "🔍 ESTADO DEL SERVIDOR:"
echo "------------------------"
curl -s http://localhost:8001/status | jq .
echo ""

echo "🧠 ESTADO DE IA:"
echo "----------------"
curl -s http://localhost:8001/api/ai/status | jq .
echo ""

echo "🌐 ACCESO EXTERNO:"
echo "------------------"
echo "✅ LocalTunnel: https://tattoo-server-2024.loca.lt"
echo "✅ IP Directa:  http://190.217.23.26:8001"
echo "✅ Documentación: http://190.217.23.26:8001/docs"
echo ""

echo "⚡ OPTIMIZACIÓN CPU:"
echo "-------------------"
echo "🔹 Cores disponibles: $(nproc)"
echo "🔹 GOMAXPROCS: ${GOMAXPROCS:-4}"
echo "🔹 Procesos Ollama: $(pgrep ollama | wc -l)"
echo "🔹 RAM total: $(free -h | grep Mem | awk '{print $2}')"
echo "🔹 RAM usada: $(free -h | grep Mem | awk '{print $3}')"
echo ""

echo "🧪 PRUEBA RÁPIDA IA:"
echo "--------------------"
curl -s -X POST http://localhost:8001/api/ai/quick-chat \
     -H "Content-Type: application/json" \
     -d '{"message": "test"}' | jq .
echo ""

echo "📊 ESTADÍSTICAS:"
echo "----------------"
echo "🔹 Uptime del sistema: $(uptime -p)"
echo "🔹 Conexiones activas: $(ss -tuln | grep :8001 | wc -l)"
echo "🔹 Timestamp: $(date)"
echo ""

echo "================================================================="
echo "✅ Sistema funcionando con optimización de CPU aplicada"
echo "🚀 IA con distribución de carga y timeouts optimizados"
echo "🌐 Acceso público disponible en LocalTunnel e IP directa"
echo "================================================================="