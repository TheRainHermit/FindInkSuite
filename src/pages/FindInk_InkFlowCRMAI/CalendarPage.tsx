import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

type Appointment = {
  id: number;
  time: string;
  client: string;
  service: string;
  duration: string;
  status: "confirmed" | "pending";
  date: string; // formato: "YYYY-MM-DD"
};

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

async function fetchAppointments(jwt: string | null): Promise<Appointment[]> {
  if (!jwt) throw new Error("No autenticado");
  return apiFetch<Appointment[]>("/appointments", jwt);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function CalendarPage() {
  const { jwt } = useAuth();
  const { data: appointments = [], isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["appointments", jwt],
    queryFn: () => fetchAppointments(jwt),
    enabled: !!jwt,
  });

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  // Fecha seleccionada en formato YYYY-MM-DD
  const selectedDate = new Date(selectedYear, selectedMonth, selectedDay)
    .toISOString()
    .slice(0, 10);

  // Filtra las citas del día seleccionado
  const filteredAppointments = appointments.filter(
    (apt) => apt.date === selectedDate
  );

  // Cambia de mes
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] bg-clip-text text-transparent">
            Calendario
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus citas y disponibilidad
          </p>
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
              <button onClick={handlePrevMonth} aria-label="Mes anterior">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {monthNames[selectedMonth]} {selectedYear}
              <button onClick={handleNextMonth} aria-label="Mes siguiente">
                <ChevronRight className="h-5 w-5" />
              </button>
              <Calendar className="h-5 w-5 text-[hsl(var(--ink-cyan))]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((day) => (
                  <div
                    key={day}
                    className="text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                        day === selectedDay
                          ? "bg-gradient-to-br from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] font-bold"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      {day}
                    </button>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-[hsl(var(--ink-magenta))]" />
              {selectedDay} {monthNames[selectedMonth]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="p-8 text-center">Cargando citas...</div>
            )}
            {error && (
              <div className="p-8 text-center text-red-500">
                Error al cargar citas
              </div>
            )}
            <div className="space-y-3">
              {filteredAppointments.length === 0 && !isLoading && (
                <div className="text-center text-muted-foreground">
                  No hay citas para este día.
                </div>
              )}
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-[hsl(var(--ink-purple)/0.3)] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[hsl(var(--ink-cyan))]">
                      {apt.time}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--ink-purple)/0.2)] text-[hsl(var(--ink-purple))]">
                      {apt.duration}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{apt.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {apt.service}
                    </p>
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
