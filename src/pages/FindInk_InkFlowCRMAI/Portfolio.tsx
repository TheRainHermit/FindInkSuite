import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon, Tag, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type PortfolioItem = {
  id: number;
  image_url: string;
  description?: string;
  created_at?: string;
  tags: { tag: string }[];
};

type UploadResponse = { image_url: string };

export default function Portfolio() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const artistId = params.get("artist_id") || ""; // Debe ser el user_id del artista

  const { jwt, user } = useAuth();
  const queryClient = useQueryClient();

  // Estado para el modal de subida
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener portafolio del artista
  const { data: portfolioItems = [], isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: ["portfolio", artistId, jwt],
    queryFn: () => apiFetch(`/portfolio?user_id=${artistId}`, jwt),
    enabled: !!jwt && !!artistId,
  });

  // Mutación para subir imagen
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/portfolio/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Error al subir imagen");
      return (await res.json()) as UploadResponse;
    },
  });

  // Mutación para crear portafolio
  const createMutation = useMutation({
    mutationFn: async (data: { image_url: string }) => {
      return apiFetch("/portfolio", jwt, {
        method: "POST",
        body: JSON.stringify({ image_url: data.image_url, tags: [], description: "" }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", artistId, jwt] });
    },
  });

  // Handler para subir imagen
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { image_url } = await uploadMutation.mutateAsync(file);
      await createMutation.mutateAsync({ image_url });
    } catch (err) {
      // Manejar error
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] via-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))] bg-clip-text text-transparent">
            Portafolio
          </h1>
          <p className="text-muted-foreground">Muestra tu trabajo con etiquetado automático AI</p>
        </div>
        {user?.id?.toString() === artistId && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button
              className="bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 transition-all gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Plus className="h-4 w-4" />
              {uploading ? "Subiendo..." : "Subir Tatuaje"}
            </Button>
          </>
        )}
      </div>

      {isLoading && <div className="p-8 text-center">Cargando portafolio...</div>}
      {error && <div className="p-8 text-center text-red-500">Error al cargar portafolio</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {portfolioItems.map((item) => (
          <Card
            key={item.id}
            className="group border-border/50 bg-card/50 backdrop-blur overflow-hidden hover:border-[hsl(var(--ink-purple)/0.5)] transition-all hover:shadow-[0_0_30px_hsl(var(--ink-purple)/0.2)] cursor-pointer"
          >
            <div className="relative aspect-square bg-gradient-to-br from-[hsl(var(--ink-purple)/0.3)] to-[hsl(var(--ink-cyan)/0.3)] flex items-center justify-center overflow-hidden">
              {item.image_url ? (
                <img src={item.image_url} alt={item.description || "imagen"} className="object-cover w-full h-full" />
              ) : (
                <>
                  <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{item.description || "Sin descripción"}</h3>
                <span className="text-sm text-[hsl(var(--ink-cyan))]">{item.created_at?.slice(0, 10)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--ink-purple)/0.2)] to-[hsl(var(--ink-cyan)/0.2)] border border-[hsl(var(--ink-purple)/0.3)]"
                  >
                    {tag.tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-gradient-to-br from-[hsl(var(--ink-purple)/0.1)] to-[hsl(var(--ink-cyan)/0.1)] backdrop-blur">
        <CardContent className="p-6 text-center space-y-3">
          <Sparkles className="h-8 w-8 mx-auto text-[hsl(var(--ink-cyan))]" />
          <h3 className="text-xl font-semibold">Etiquetado Automático con IA</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sube tus fotos y la IA identificará automáticamente el estilo, tamaño, ubicación y características del tatuaje. Esto facilita la búsqueda y organización de tu portafolio.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
