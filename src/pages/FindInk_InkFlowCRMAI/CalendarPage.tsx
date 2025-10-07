import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock } from "lucide-react";

const appointments = [
  {
    time: "10:00",
    client: "María González",
    service: "Rosa realista - Hombro",
    duration: "3h",
    status: "confirmed",
  },
  {
    time: "14:00",
    client: "Carlos Ruiz",
    service: "Diseño geométrico - Brazo",
    duration: "2h",
    status: "confirmed",
  },
  {
    time: "17:00",
    client: "Ana López",
    service: "Lettering - Costillas",
    duration: "1.5h",
    status: "pending",
  },
];

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const currentDay = 23;

export default function CalendarPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] bg-clip-text text-transparent">
            Calendario
          </h1>
          <p className="text-muted-foreground">Gestiona tus citas y disponibilidad</p>
        </div>
        <Button className="bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 transition-all gap-2">
          <Plus className="h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[hsl(var(--ink-cyan))]" />
              Octubre 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((day) => (
                  <div key={day} className="text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                      day === currentDay
                        ? "bg-gradient-to-br from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] font-bold"
                        : "hover:bg-secondary/50"
                    } ${day < currentDay ? "text-muted-foreground" : ""}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-[hsl(var(--ink-magenta))]" />
              Hoy - {currentDay} Oct
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((apt, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-[hsl(var(--ink-purple)/0.3)] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[hsl(var(--ink-cyan))]">{apt.time}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--ink-purple)/0.2)] text-[hsl(var(--ink-purple))]">
                      {apt.duration}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{apt.client}</p>
                    <p className="text-sm text-muted-foreground">{apt.service}</p>
                  </div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === "confirmed"
                          ? "bg-[hsl(var(--ink-cyan)/0.2)] text-[hsl(var(--ink-cyan))]"
                          : "bg-[hsl(var(--ink-magenta)/0.2)] text-[hsl(var(--ink-magenta))]"
                      }`}
                    >
                      {apt.status === "confirmed" ? "Confirmada" : "Pendiente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
