import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import Spinner from "@/components/ui/spinner";
import Modal from "@/components/ui/modal";
import { toast } from "react-toastify";

type Appointment = {
  id: number;
  time: string;
  client: string;
  service: string;
  duration: string;
  status: "confirmed" | "pending" | "accepted" | "rejected" | "cancelled";
  date: string; // formato: "YYYY-MM-DD"
  artist?: string;
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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function CalendarPage() {
  const { jwt, user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  // Cargar citas según el rol
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = "http://localhost:8001/api/appointments/";
        if (user.role === "client") url += "?client_id=" + user.id;
        if (user.role === "artist") url += "?artist_id=" + user.id;
        // admin ve todas
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError("Error al cargar citas");
      } finally {
        setIsLoading(false);
      }
    };
    if (jwt && user) fetchData();
  }, [user, jwt]);

  // Acciones para aceptar/rechazar/cancelar
  const handleDecision = async (id: number, decision: "accepted" | "rejected") => {
    try {
      await fetch(`http://localhost:8001/api/appointments/${id}/decision`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ decision }),
      });
      // Refresca citas
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: decision } : apt
        )
      );
      toast.success(`Cita ${decision === "accepted" ? "aceptada" : "rechazada"} correctamente`);
    } catch {
      alert("Error al actualizar la cita");
      toast.error("Error de red al actualizar la cita");
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await fetch(`http://localhost:8001/api/appointments/${id}/cancel`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: "cancelled" } : apt
        )
      );
      toast.success("Cita cancelada correctamente");
    } catch {
      alert("Error al cancelar la cita");
      toast.error("Error al cancelar la cita");
    }
  };

  // Calendario
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
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
        {/* Botón para solicitar nueva cita solo para cliente/admin */}
        {(user.role === "client" || user.role === "admin") && (
          <Button
            className="bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 transition-all gap-2"
            onClick={() => window.location.href = "/crm/appointments/request"}
          >
            <Plus className="h-4 w-4" />
            Nueva Cita
          </Button>
        )}
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
                    {apt.artist && (
                      <p className="text-xs text-muted-foreground">
                        Tatuador: {apt.artist}
                      </p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === "confirmed" || apt.status === "accepted"
                          ? "bg-[hsl(var(--ink-cyan)/0.2)] text-[hsl(var(--ink-cyan))]"
                          : apt.status === "pending"
                          ? "bg-[hsl(var(--ink-magenta)/0.2)] text-[hsl(var(--ink-magenta))]"
                          : apt.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {apt.status === "confirmed" || apt.status === "accepted"
                        ? "Confirmada"
                        : apt.status === "pending"
                        ? "Pendiente"
                        : apt.status === "rejected"
                        ? "Rechazada"
                        : "Cancelada"}
                    </span>
                  </div>
                  {/* Acciones según el rol */}
                  <div className="flex gap-2 mt-2">
                    {user.role === "artist" && apt.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecision(apt.id, "accepted")}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDecision(apt.id, "rejected")}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    {user.role === "admin" && apt.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={loadingId === apt.id}
                        onClick={() => setConfirmCancelId(apt.id)}
                      >
                        {loadingId === apt.id ? <Spinner /> : "Cancelar"}
                      </Button>
                    )}
                  </div>
                  {confirmCancelId === apt.id && (
                    <Modal
                      onConfirm={() => {
                        setLoadingId(apt.id);
                        handleCancel(apt.id).finally(() => {
                          setLoadingId(null);
                          setConfirmCancelId(null);
                        });
                      }}
                      onCancel={() => setConfirmCancelId(null)}
                    >
                      ¿Seguro que deseas cancelar esta cita?
                    </Modal>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
