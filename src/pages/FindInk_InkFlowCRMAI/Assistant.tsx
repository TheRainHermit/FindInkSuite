import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, MessageSquare } from "lucide-react";
import { useState } from "react";

async function callMCP(query: string) {
  try {
    const res = await fetch(`/api/ai/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, url: "https://findink.co", model: "mistral", max_chunks: 6 }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Error en MCP");
    }
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

const suggestions = [
  "¿Cuántas citas tengo esta semana?",
  "Genera ideas para un tatuaje de dragón",
  "Resume el estado de mi negocio",
  "Envía recordatorios a clientes pendientes",
];

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "¡Hola! Soy tu asistente de IA. Puedo ayudarte con la gestión de clientes, generación de ideas de diseño, análisis de ingresos y mucho más. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    const userMessage = input;
    setInput("");

    // Llamar al endpoint MCP
    setMessages((prev) => [...prev, { role: "assistant", content: "Escribiendo respuesta..." }]);
    callMCP(userMessage).then((resp) => {
      if (resp.error) {
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: `Error: ${resp.error}` }]);
        return;
      }
      const content = resp.response || resp.response_text || "Sin respuesta";
  const contextSnippets = (resp.context || []).map((c: { source: string; snippet: string }) => `Fuente: ${c.source} - ${c.snippet.slice(0,200)}...`).join("\n\n");
      const final = content + (contextSnippets ? `\n\nContexto:\n${contextSnippets}` : "");
      setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: final }]);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] via-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))] bg-clip-text text-transparent">
          Asistente AI
        </h1>
        <p className="text-muted-foreground">Tu asistente inteligente para el estudio</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[hsl(var(--ink-cyan))]" />
              Chat con el Asistente
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))]"
                        : "bg-secondary/50 border border-border/50"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="bg-secondary/30 border-border/50 focus:border-[hsl(var(--ink-purple))]"
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[hsl(var(--ink-magenta))]" />
                Sugerencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion)}
                  className="w-full text-left text-sm p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/30 hover:border-[hsl(var(--ink-purple)/0.3)] transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-[hsl(var(--ink-purple)/0.1)] to-[hsl(var(--ink-cyan)/0.1)] backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Capacidades AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--ink-cyan))] mt-1.5" />
                <p>Respuestas automáticas a clientes</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--ink-cyan))] mt-1.5" />
                <p>Generación de ideas de diseño</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--ink-cyan))] mt-1.5" />
                <p>Análisis de ingresos y citas</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--ink-cyan))] mt-1.5" />
                <p>Recordatorios automáticos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
