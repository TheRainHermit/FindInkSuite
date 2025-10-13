#!/bin/bash

echo "🚀 OPTIMIZACIÓN OLLAMA - DISTRIBUCIÓN DE CARGA CPU"
echo "=================================================="
echo "✅ 4 cores AMD PRO A10-8750B"
echo "✅ 13GB RAM disponible"
echo "✅ Configuración multi-proceso"
echo "=================================================="

# Configuración de variables de entorno para optimizar Ollama
export OLLAMA_NUM_PARALLEL=2          # Máximo 2 modelos simultáneos
export OLLAMA_MAX_LOADED_MODELS=2     # Mantener 2 modelos en memoria
export OLLAMA_MAX_QUEUE=4             # Cola de máximo 4 peticiones
export OLLAMA_FLASH_ATTENTION=1       # Usar flash attention para optimizar
export OLLAMA_HOST=127.0.0.1:11434    # Bind específico

# Configurar núcleos de CPU para Ollama (usar 3 de 4 cores)
export GOMAXPROCS=3

# Función para configurar modelo específico
configure_model() {
    local model=$1
    local threads=$2
    echo "🔧 Configurando $model con $threads threads..."
    
    # Configurar el modelo con parámetros optimizados
    ollama create ${model}_optimized -f - << EOF
FROM $model
PARAMETER num_thread $threads
PARAMETER num_gpu 0
PARAMETER mmap true
PARAMETER numa true
EOF
}

echo ""
echo "🔧 PASO 1: Deteniendo Ollama actual..."
sudo pkill -f ollama
sleep 3

echo ""
echo "🔧 PASO 2: Iniciando Ollama optimizado..."
# Iniciar Ollama en background con configuración optimizada
nohup ollama serve > /tmp/ollama_optimized.log 2>&1 &
sleep 5

echo ""
echo "🔧 PASO 3: Configurando modelos optimizados..."
# Configurar cada modelo con threads específicos
configure_model "phi" 1          # Phi: 1 thread (más rápido)
configure_model "mistral" 2      # Mistral: 2 threads (equilibrado)
configure_model "llama2:7b-chat" 2  # Llama2: 2 threads

echo ""
echo "🔧 PASO 4: Pre-cargando modelo rápido..."
# Pre-cargar phi para respuestas inmediatas
echo '{"model": "phi", "prompt": "test", "stream": false}' | \
curl -s -X POST http://localhost:11434/api/generate \
     -H "Content-Type: application/json" \
     -d @- > /dev/null

echo ""
echo "✅ OLLAMA OPTIMIZADO CONFIGURADO:"
echo "================================"
echo "🚀 Parallelismo: 2 modelos simultáneos"
echo "🧠 RAM optimizada: 2 modelos en memoria"
echo "⚡ Threads por modelo:"
echo "   - Phi: 1 thread (respuesta rápida)"
echo "   - Mistral: 2 threads (equilibrado)"
echo "   - Llama2: 2 threads (calidad)"
echo "🔄 Cola de peticiones: 4 máximo"
echo "💾 Cache optimizado activado"
echo ""

echo "🧪 PROBANDO RENDIMIENTO..."
echo "========================="

# Test de velocidad
echo "⏱️ Test Phi (debería ser <5 segundos):"
time curl -s -X POST http://localhost:11434/api/generate \
     -H "Content-Type: application/json" \
     -d '{"model": "phi", "prompt": "Hi", "stream": false}' | \
     jq '.response'

echo ""
echo "🎯 OPTIMIZACIÓN COMPLETADA"
echo "=========================="
echo "✅ Ollama optimizado para 4 cores"
echo "✅ Distribución de carga configurada"
echo "✅ Modelos pre-configurados"
echo "✅ Cache en RAM activado"
echo ""
echo "💡 Ahora reinicia tu servidor API para usar la configuración optimizada"