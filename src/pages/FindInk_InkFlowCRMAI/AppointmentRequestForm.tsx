import React, { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "@/components/ui/spinner";

const AppointmentRequestForm = ({ artistId }: { artistId: number }) => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !description) {
      toast.error("Completa todos los campos.");
      return;
    }
    if (new Date(date) < new Date()) {
      toast.error("La fecha debe ser futura.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token"); // o como manejes la autenticación

      const response = await fetch("http://localhost:8001/api/appointments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          artist_id: artistId,
          date,
          description,
        }),
      });
      if (response.ok) {
        toast.success("Solicitud enviada correctamente.");
        setMessage("Solicitud enviada correctamente.");
      } else {
        const data = await response.json();
        toast.error(data.detail || "Error al enviar la solicitud.");
        setMessage(data.detail || "Error al enviar la solicitud.");
      }
    } catch {
      toast.error("Error de red.");
      setMessage("Error de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-card rounded shadow">
      <h3 className="font-bold mb-2">Solicitar cita</h3>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
        className="mb-2 p-2 border rounded w-full"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Describe tu idea"
        required
        className="mb-2 p-2 border rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        {loading ? <Spinner /> : "Solicitar"}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  );
};

export default AppointmentRequestForm;