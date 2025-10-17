import React from "react";

// Componente de galería de tatuajes (placeholder, puedes personalizarlo)
export const ARPortfolio = () => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">Galería de Tatuajes</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Aquí puedes renderizar miniaturas de tatuajes reales */}
        <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500">
          Imagen 1
        </div>
        <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500">
          Imagen 2
        </div>
        <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500">
          Imagen 3
        </div>
        <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500">
          Imagen 4
        </div>
      </div>
    </div>
  );
};
