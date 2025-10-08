import React, { useState } from "react";

const ApiTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://tattoo-hackathon-1006.loca.lt/api/ai/models",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const text = await response.text();
      console.log("Raw response text:", text);

      try {
        const data = JSON.parse(text);
        console.log("Parsed JSON data:", data);
        setResult(data);
      } catch {
        setError("Respuesta no es JSON:\n" + text.slice(0, 500));
        setResult(null);
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleChatApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://tattoo-hackathon-1006.loca.lt/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            message: "Diseña un tatuaje",
            user_id: "12345",
          }),
        }
      );
      const text = await response.text();
      console.log("Raw response text:", text);

      try {
        const data = JSON.parse(text);
        console.log("Parsed JSON data:", data);
        setResult(data);
      } catch {
        setError("Respuesta no es JSON:\n" + text.slice(0, 500));
        setResult(null);
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-card max-w-md mx-auto mt-12">
      <h2 className="text-xl font-bold mb-4">Prueba de integración API 2</h2>
      <button
        onClick={handleTestApi}
        className="px-6 py-2 font-bold text-white bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded transition hover:brightness-110"
        disabled={loading}
      >
        {loading ? "Consultando..." : "Probar API"}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <pre className="mt-4 bg-muted p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      <button
        onClick={handleChatApi}
        className="px-6 py-2 font-bold text-white bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded transition hover:brightness-110"
        disabled={loading}
      >
        {loading ? "Consultando..." : "Probar Chat API"}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <pre className="mt-4 bg-muted p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ApiTest;
