#!/bin/bash

echo "🤖 PRUEBA DE ENDPOINTS DE OLLAMA IA"
echo "==================================="

BASE_URL="https://tattoo-hackathon-1006.loca.lt"
# BASE_URL="http://localhost:8001"  # Usar esto si LocalTunnel falla

echo ""
echo "📊 1. MODELOS DISPONIBLES:"
echo "========================="
curl -s "$BASE_URL/api/ai/models" | jq .

echo ""
echo ""
echo "💬 2. CHAT SIMPLE (PHI - Modelo más rápido):"
echo "=========================================="
curl -X POST "$BASE_URL/api/ai/chat" \
-H "Content-Type: application/json" \
-d '{
  "message": "Hola",
  "model": "phi"
}' | jq .

echo ""
echo ""
echo "🎨 3. ASISTENTE DE TATUAJES:"
echo "=========================="
curl -X POST "$BASE_URL/api/ai/tattoo-assistant" \
-H "Content-Type: application/json" \
-d '{
  "client_message": "Quiero un tatuaje pequeño y discreto",
  "model": "phi"
}' | jq .

echo ""
echo ""
echo "🎯 4. SUGERENCIAS DE DISEÑO:"
echo "=========================="
curl -X POST "$BASE_URL/api/ai/design-suggestions" \
-H "Content-Type: application/json" \
-d '{
  "style": "minimalista",
  "size": "pequeño",
  "location": "muñeca",
  "theme": "naturaleza"
}' | jq .

echo ""
echo ""
echo "✅ ENDPOINTS CREADOS PARA FRONTEND:"
echo "=================================="
echo "GET    /api/ai/models              - Listar modelos disponibles"
echo "POST   /api/ai/chat                - Chat general con IA"
echo "POST   /api/ai/tattoo-assistant    - Asistente especializado en tatuajes"
echo "POST   /api/ai/design-suggestions  - Sugerencias de diseños personalizadas"
echo ""
echo "🌐 URL BASE PARA FRONTEND:"
echo "========================="
echo "URL: $BASE_URL"
echo "Documentación: $BASE_URL/docs"