import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon, Tag, Sparkles } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    style: "Realismo",
    size: "Grande",
    location: "Brazo",
    tags: ["Color", "Naturaleza"],
  },
  {
    id: 2,
    style: "Geométrico",
    size: "Mediano",
    location: "Espalda",
    tags: ["Blackwork", "Abstracto"],
  },
  {
    id: 3,
    style: "Minimalista",
    size: "Pequeño",
    location: "Muñeca",
    tags: ["Linework", "Simple"],
  },
  {
    id: 4,
    style: "Tradicional",
    size: "Grande",
    location: "Pecho",
    tags: ["Color", "Old School"],
  },
  {
    id: 5,
    style: "Acuarela",
    size: "Mediano",
    location: "Hombro",
    tags: ["Color", "Abstracto"],
  },
  {
    id: 6,
    style: "Lettering",
    size: "Pequeño",
    location: "Costillas",
    tags: ["Tipografía", "Script"],
  },
];

export default function Portfolio() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] via-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))] bg-clip-text text-transparent">
            Portafolio
          </h1>
          <p className="text-muted-foreground">Muestra tu trabajo con etiquetado automático AI</p>
        </div>
        <Button className="bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 transition-all gap-2">
          <Plus className="h-4 w-4" />
          Subir Tatuaje
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {portfolioItems.map((item) => (
          <Card
            key={item.id}
            className="group border-border/50 bg-card/50 backdrop-blur overflow-hidden hover:border-[hsl(var(--ink-purple)/0.5)] transition-all hover:shadow-[0_0_30px_hsl(var(--ink-purple)/0.2)] cursor-pointer"
          >
            <div className="relative aspect-square bg-gradient-to-br from-[hsl(var(--ink-purple)/0.3)] to-[hsl(var(--ink-cyan)/0.3)] flex items-center justify-center overflow-hidden">
              <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{item.style}</h3>
                <span className="text-sm text-[hsl(var(--ink-cyan))]">{item.size}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-3 w-3" />
                <span>{item.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--ink-purple)/0.2)] to-[hsl(var(--ink-cyan)/0.2)] border border-[hsl(var(--ink-purple)/0.3)]"
                  >
                    {tag}
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
