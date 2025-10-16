import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../lib/api";

type Client = {
  id: number;
  name: string;
  email: string;
};

const ClientList: React.FC = () => {
  const { jwt } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jwt) return;
    apiFetch<Client[]>("/clients", jwt)
      .then(setClients)
      .catch(err => setError(err.message));
  }, [jwt]);

  if (!jwt) return <p>Debes iniciar sesión para ver los clientes.</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            {client.name} ({client.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;