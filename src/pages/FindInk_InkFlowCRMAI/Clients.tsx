import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User } from "lucide-react";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  tattoos: number;
  lastVisit: string;
  style: string;
};

async function fetchClients(): Promise<Client[]> {
  const res = await fetch("https://tattoo-hackathon-1006.loca.lt/api/clients");
  if (!res.ok) throw new Error("Error al cargar clientes");
  return res.json();
}

export default function Clients() {
  const { data: clients = [], isLoading, error } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] bg-clip-text text-transparent">
            Clientes
          </h1>
          <p className="text-muted-foreground">Gestiona tu cartera de clientes</p>
        </div>
        <Button className="bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 transition-all gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          className="pl-10 bg-card/50 border-border/50 focus:border-[hsl(var(--ink-purple))]"
        />
      </div>

      {isLoading && <div className="p-8 text-center">Cargando clientes...</div>}
      {error && <div className="p-8 text-center text-red-500">Error al cargar clientes</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card
            key={client.id}
            className="border-border/50 bg-card/50 backdrop-blur hover:border-[hsl(var(--ink-purple)/0.5)] transition-all hover:shadow-[0_0_20px_hsl(var(--ink-purple)/0.15)] cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Teléfono:</span>
                <span>{client.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tatuajes:</span>
                <span className="font-medium text-[hsl(var(--ink-cyan))]">{client.tattoos}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estilo favorito:</span>
                <span>{client.style}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Última visita:</span>
                <span>{client.lastVisit}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
