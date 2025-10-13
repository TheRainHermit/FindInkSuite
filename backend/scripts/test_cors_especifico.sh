#!/bin/bash

echo "🔧 PRUEBA CORS ESPECÍFICA PARA TU COMPAÑERO"
echo "============================================="
echo ""

echo "🌍 URL del túnel: https://tattoo-hackathon-1006.loca.lt"
echo ""

echo "🔍 1. Verificar servidor local:"
echo "--------------------------------"
curl -s http://localhost:8001/status | head -3
echo ""

echo "🔍 2. Prueba OPTIONS preflight para /api/ai/chat:"
echo "--------------------------------------------------"
curl -v -X OPTIONS https://tattoo-hackathon-1006.loca.lt/api/ai/chat \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  2>&1 | grep -E "(< |access-control|HTTP)" || echo "❌ No hay respuesta CORS"
echo ""

echo "🔍 3. Prueba GET con Origin desde localhost:8080:"
echo "--------------------------------------------------"
curl -v -X GET https://tattoo-hackathon-1006.loca.lt/status \
  -H "Origin: http://localhost:8080" \
  2>&1 | grep -E "(< |access-control|HTTP)" || echo "❌ No hay respuesta"
echo ""

echo "🔍 4. Código JavaScript que debe funcionar:"
echo "--------------------------------------------"
cat << 'EOF'
// ✅ Código para tu compañero (React/JavaScript):
const testCORS = async () => {
    try {
        // Prueba básica
        const response = await fetch('https://tattoo-hackathon-1006.loca.lt/status', {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:8080'
            }
        });
        console.log('✅ CORS OK - Status:', await response.json());
        
        // Prueba del endpoint problemático
        const aiResponse = await fetch('https://tattoo-hackathon-1006.loca.lt/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:8080'
            },
            body: JSON.stringify({
                message: "Hola IA",
                model: "phi"
            })
        });
        console.log('✅ AI Chat:', await aiResponse.json());
        
    } catch (error) {
        console.error('❌ Error CORS:', error);
    }
};
testCORS();
EOF
echo ""

echo "============================================="
echo "🚀 El túnel específico está activo"
echo "💡 Tu compañero debe usar exactamente esta URL"
echo "============================================="