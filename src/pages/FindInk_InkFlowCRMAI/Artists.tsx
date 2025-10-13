import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Import dataset generated in the repo root
import rawData from "../../../base_datos_tatuajes_completa.json";

type RawItem = {
  imagen_url?: string;
  descripcion_alt?: string;
  tatuador_nombre?: string;
  tatuador_ciudad?: string;
  tatuador_url?: string;
  tatuador_especialidades?: string[];
};

type Artist = {
  name: string;
  city?: string;
  profileImage?: string; // prefer small profile image if available
  anyImage?: string; // fallback image
  specialties?: string[];
  url?: string;
};

function pickImages(items: RawItem[], name: string) {
  // prefer profile-sized images (those with "profile" in descripcion_alt or smaller w=256 in url)
  const imgs = items.filter((i) => (i.tatuador_nombre || "").toLowerCase() === name.toLowerCase());
  let profile: string | undefined;
  let anyImg: string | undefined;
  for (const it of imgs) {
    const url = it.imagen_url;
    if (!url) continue;
    anyImg = anyImg || url;
    const desc = (it.descripcion_alt || "").toLowerCase();
    if (desc.includes("profile") || url.includes("w=256") || url.includes("q=75")) {
      profile = url;
      break;
    }
  }
  return { profileImage: profile, anyImage: anyImg };
}

export default function Artists() {
  const raw = (rawData as any).tatuajes as RawItem[] | undefined;

  const artists: Artist[] = useMemo(() => {
    if (!raw) return [];
    const grouped = new Map<string, RawItem[]>();
    for (const item of raw) {
      const name = (item.tatuador_nombre || "").trim();
      if (!name) continue;
      if (!grouped.has(name)) grouped.set(name, []);
      grouped.get(name)!.push(item);
    }

    const out: Artist[] = [];
    for (const [name, items] of grouped.entries()) {
      const { profileImage, anyImage } = pickImages(items, name);
      const city = items.find((i) => i.tatuador_ciudad)?.tatuador_ciudad;
      const specialties = items.find((i) => i.tatuador_especialidades)?.tatuador_especialidades;
      const url = items.find((i) => i.tatuador_url)?.tatuador_url;
      out.push({ name, city, profileImage, anyImage, specialties, url });
    }
    // sort by name
    out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [raw]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] bg-clip-text text-transparent">
            Tatuadores
          </h1>
          <p className="text-muted-foreground">Lista extraída de la base de datos local con fotos y especialidades</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar tatuadores..." className="pl-10 bg-card/50 border-border/50 focus:border-[hsl(var(--ink-purple))]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((a) => (
          <Card key={a.name} className="border-border/50 bg-card/50 backdrop-blur hover:border-[hsl(var(--ink-purple)/0.5)] transition-all hover:shadow-[0_0_20px_hsl(var(--ink-purple)/0.15)]">
            <CardHeader className="flex items-center gap-4 pb-3">
              <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {a.profileImage || a.anyImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.profileImage || a.anyImage} alt={a.name} className="object-cover h-full w-full" />
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
                    Ver perfil en FindInk
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
