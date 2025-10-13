#!/bin/bash

echo "🌐 PRUEBA COMPLETA DE CORS - Sistema de Tatuajes"
echo "=================================================="
echo ""

echo "🔍 1. Prueba OPTIONS preflight:"
echo "--------------------------------"
curl -v -X OPTIONS http://localhost:8001/api/auth/login \
  -H "Origin: http://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  2>&1 | grep -E "(< |>|HTTP|access-control)"
echo ""

echo "🔍 2. Prueba GET con Origin:"
echo "----------------------------"
curl -v -X GET http://localhost:8001/status \
  -H "Origin: http://example.com" \
  2>&1 | grep -E "(< |>|HTTP|access-control)"
echo ""

echo "🔍 3. Prueba POST login:"
echo "------------------------"
curl -v -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://example.com" \
  -d '{"email": "juan@tattoo.com", "password": "123456"}' \
  2>&1 | grep -E "(< |>|HTTP|access-control)"
echo ""

echo "🔍 4. Documentación FastAPI:"
echo "----------------------------"
echo "📋 URL: http://localhost:8001/docs"
echo "📋 Redoc: http://localhost:8001/redoc"
echo ""

echo "🔍 5. Estado del servidor:"
echo "---------------------------"
curl -s http://localhost:8001/status | head -3
echo ""

echo "=================================================="
echo "✅ Si ves headers 'access-control', CORS funciona"
echo "❌ Si no aparecen, hay que revisar configuración"
echo "=================================================="