import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../lib/api";

type Artist = {
  id: number;
  name: string;
  city?: string;
  profileImage?: string;
  specialties?: string[];
  url?: string;
};

async function fetchArtists(jwt: string | null): Promise<Artist[]> {
  if (!jwt) throw new Error("No autenticado");
  return apiFetch<Artist[]>("/artists/", jwt);
}

export default function Artists() {
  const { jwt } = useAuth();
  const { data: artists = [], isLoading, error } = useQuery<Artist[]>({
    queryKey: ["artists", jwt],
    queryFn: () => fetchArtists(jwt),
    enabled: !!jwt,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] bg-clip-text text-transparent">
            Tatuadores
          </h1>
          <p className="text-muted-foreground">Lista extraída del backend con fotos y especialidades</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar tatuadores..." className="pl-10 bg-card/50 border-border/50 focus:border-[hsl(var(--ink-purple))]" />
      </div>

      {isLoading && <div className="p-8 text-center">Cargando tatuadores...</div>}
      {error && <div className="p-8 text-center text-red-500">Error al cargar tatuadores</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((a) => (
          <Card key={a.id} className="border-border/50 bg-card/50 backdrop-blur hover:border-[hsl(var(--ink-purple)/0.5)] transition-all hover:shadow-[0_0_20px_hsl(var(--ink-purple)/0.15)]">
            <CardHeader className="flex items-center gap-4 pb-3">
              <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {a.profileImage ? (
                  <img src={a.profileImage} alt={a.name} className="object-cover h-full w-full" />
                ) : (
                  <div className="text-xs text-muted-foreground">Sin imagen</div>
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{a.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{a.city}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Especialidades:</div>
              <div className="flex flex-wrap gap-2">
                {(a.specialties || []).slice(0, 6).map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded bg-border/20">{s}</span>
                ))}
              </div>
              {a.url && (
                <div className="text-sm pt-3 border-t border-border/50">
                  <a href={a.url} target="_blank" rel="noreferrer" className="text-[hsl(var(--ink-cyan))] underline">
                    Ver perfil en su sitio
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}