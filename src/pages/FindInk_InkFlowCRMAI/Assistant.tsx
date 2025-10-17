import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, MessageSquare, UserSearch } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/modal"; // Usa tu modal o uno simple
import * as chrono from "chrono-node";

async function callAIChat(messages: {role: string, content: string}[]) {
  try {
    const res = await fetch("https://afraid-signs-turn.loca.lt/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Error en AI");
    }
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

async function callTattooAssistant(city: string, preferences: string) {
  const res = await fetch("https://dirty-hornets-move.loca.it/api/ai/tattoo-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city, preferences }),
  });
  return await res.json();
}

// Debe ir dentro o fuera del componente Assistant, según prefieras.
// Si usas TypeScript, puedes tipar mejor la respuesta.

async function fetchArtistIdByName(name: string): Promise<number | null> {
  try {
    // Llama al endpoint de artistas, filtrando por nombre (ajusta el query param si tu backend lo requiere)
    const res = await fetch(`http://localhost:8001/api/artists/?name=${encodeURIComponent(name)}`);
    if (!res.ok) return null;
    const data = await res.json();
    // Busca coincidencia exacta o parcial (case-insensitive)
    const artist = data.find((a: any) =>
      a.name.toLowerCase().includes(name.toLowerCase())
    );
    return artist ? artist.id : null;
  } catch {
    return null;
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
  const [city, setCity] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [pendingAppointment, setPendingAppointment] = useState<{
    artist?: string;
    date?: string;
    description?: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [artistNames, setArtistNames] = useState<string[]>([]);
  const [editArtist, setEditArtist] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");

  useEffect(() => {
    // Carga todos los nombres de artistas al montar el componente
    fetch("http://localhost:8001/api/artists/")
      .then(res => res.json())
      .then(data => setArtistNames(data.map((a: any) => a.name)));
  }, []);

  // Cuando recibes una sugerencia, inicializa los campos editables:
  useEffect(() => {
    if (pendingAppointment) {
      setEditArtist(pendingAppointment.artist || "");
      setEditDate(pendingAppointment.date || "");
      setEditDescription(pendingAppointment.description || "");
    }
  }, [pendingAppointment]);

  // Al cargar el componente
  useEffect(() => {
    const saved = localStorage.getItem("ai_chat_history");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Cada vez que cambian los mensajes, guarda el historial
  useEffect(() => {
    localStorage.setItem("ai_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Función para detectar sugerencia de cita en la respuesta de la IA
  function parseAppointmentSuggestion(text: string) {
    const dateObj = chrono.parseDate(text);
    let date = dateObj ? dateObj.toISOString().slice(0, 10) : undefined;

    // Busca hora (opcional)
    const hourMatch =
      text.match(/a las (\d{1,2}:\d{2})/) || // a las 15:00
      text.match(/(\d{1,2}:\d{2})\s*(am|pm)?/i) || // 3:00 pm
      text.match(/(\d{1,2})\s*(am|pm)/i);

    // Busca artista por coincidencia flexible
    let artistFound = null;
    for (const name of artistNames) {
      if (text.toLowerCase().includes(name.toLowerCase())) {
        artistFound = name;
        break;
      }
    }

    // Busca descripción después de "para", "por", "sobre", etc.
    const descMatch =
      text.match(/para (un|una)? ([^.]+)/i) ||
      text.match(/por (un|una)? ([^.]+)/i) ||
      text.match(/sobre (un|una)? ([^.]+)/i);

    // Procesa fecha
    if (date && date.includes("/")) {
      // Convierte DD/MM/YYYY a YYYY-MM-DD
      const [d, m, y] = date.split("/");
      date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    // Procesa hora
    let description = descMatch ? descMatch[2] : "";
    if (hourMatch) {
      description = (description ? description + " " : "") + "Hora sugerida: " + hourMatch[0];
    }

    if (date && artistFound) {
      return {
        artist: artistFound,
        date,
        description: description.trim(),
      };
    }
    return null;
  }

  function parseMultipleAppointmentSuggestions(text: string) {
    // Divide por saltos de línea o puntos y busca sugerencias en cada parte
    const parts = text.split(/\n|\. /);
    const suggestions = parts
      .map(parseAppointmentSuggestion)
      .filter(Boolean);
    return suggestions.length > 0 ? suggestions : null;
  }

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "Escribiendo respuesta..." }]);
    const resp = await callAIChat([...messages, { role: "user", content: userMessage }]);
    setLoading(false);
    if (resp.error) {
      setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: `Error: ${resp.error}` }]);
      return;
    }
    const content = resp.response || resp.response_text || "Sin respuesta";
    setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content }]);
    const suggestions = parseMultipleAppointmentSuggestions(content);
    if (suggestions) {
      // Puedes mostrar un modal con un selector, o ir mostrando uno a uno
      setPendingAppointment(suggestions[0]);
      // Si quieres permitir agendar varias, guarda el array y muestra uno por uno
    }
  };

  const handleRecommend = async () => {
    if (!city.trim() || !preferences.trim()) {
      setRecommendation("Por favor, completa ciudad y preferencias.");
      return;
    }
    setRecommendation("Buscando recomendación...");
    setLoading(true);
    const resp = await callTattooAssistant(city, preferences);
    setLoading(false);
    setRecommendation(resp.recommendation || resp.response || "No se encontró recomendación.");
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
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-secondary/30 border-border/50 focus:border-[hsl(var(--ink-purple))]"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 transition-all"
                disabled={loading}
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

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserSearch className="h-5 w-5 text-[hsl(var(--ink-cyan))]" />
                Recomendación de Tatuador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Ciudad"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="mb-2"
                disabled={loading}
              />
              <Input
                placeholder="Preferencias (estilo, color, etc.)"
                value={preferences}
                onChange={e => setPreferences(e.target.value)}
                className="mb-2"
                disabled={loading}
              />
              <Button
                onClick={handleRecommend}
                className="w-full bg-gradient-to-r from-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-purple))] mt-2"
                disabled={loading}
              >
                Recomendar tatuador
              </Button>
              {recommendation && (
                <div className="mt-4 p-2 bg-gray-100 rounded text-sm">{recommendation}</div>
              )}
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

      {pendingAppointment && showModal && (
        <Modal
          onConfirm={async () => {
            const artistId = await fetchArtistIdByName(editArtist);
            if (!artistId) {
              setShowModal(false);
              setPendingAppointment(null);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: `❌ No se encontró al artista "${editArtist}". Por favor, revisa el nombre o intenta de nuevo.`,
                },
              ]);
              return;
            }
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8001/api/appointments/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                artist_id: artistId,
                date: editDate,
                description: editDescription,
              }),
            });
            if (res.ok) {
              setShowModal(false);
              setPendingAppointment(null);
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "✅ ¡Cita agendada exitosamente!" },
              ]);
            } else {
              const data = await res.json().catch(() => ({}));
              setShowModal(false);
              setPendingAppointment(null);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content:
                    `❌ No se pudo agendar la cita. ` +
                    (data.detail
                      ? `Motivo: ${data.detail}`
                      : "Por favor, intenta de nuevo más tarde."),
                },
              ]);
            }
          }}
          onCancel={() => setShowModal(false)}
        >
          <div>
            <h3 className="font-bold mb-2">Editar y agendar cita</h3>
            <label className="block mb-1 font-medium">Artista</label>
            <Input
              value={editArtist}
              onChange={e => setEditArtist(e.target.value)}
              className="mb-2"
            />
            <label className="block mb-1 font-medium">Fecha</label>
            <Input
              type="date"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
              className="mb-2"
            />
            <label className="block mb-1 font-medium">Descripción</label>
            <Input
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="mb-2"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
