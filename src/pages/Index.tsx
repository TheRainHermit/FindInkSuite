import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, Users } from "lucide-react";
import TattooWizard from "@/components/TattooWizard";
import heroImage from "@/assets/hero-tattoo.jpg";
import { useState } from "react";

const Index = () => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Tattoo studio"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Tecnología de IA Avanzada
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Visualiza tu{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary-glow bg-clip-text text-transparent">
                Tatuaje Perfecto
              </span>
              <br />
              antes de hacerlo
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Descubre cómo se verá cualquier diseño en tu piel con nuestra
              revolucionaria tecnología de IA. Sin riesgos, sin arrepentimientos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={() => setShowWizard(true)}
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary via-secondary to-primary-glow hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] transition-all"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Probar ahora gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2"
              >
                Ver ejemplos
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">
                  Precisión IA
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-secondary">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Tatuajes visualizados
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  4.9★
                </div>
                <div className="text-sm text-muted-foreground">
                  Valoración usuarios
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Wizard Section */}
      {showWizard && (
        <section className="py-20 px-4">
          <TattooWizard />
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-muted-foreground">
              La forma más inteligente de decidir tu próximo tatuaje
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">IA Instantánea</h3>
              <p className="text-muted-foreground">
                Resultados hiperrealistas en segundos. Nuestra IA procesa y
                adapta el diseño a tu piel de forma natural.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card border border-border hover:border-secondary/50 transition-all group">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_hsl(var(--secondary)/0.5)] transition-all">
                <Shield className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% Privado</h3>
              <p className="text-muted-foreground">
                Tus fotos se procesan de forma segura y nunca se almacenan.
                Total privacidad garantizada.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Red de Estudios</h3>
              <p className="text-muted-foreground">
                Conecta con los mejores tatuadores profesionales certificados
                de tu zona.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 border border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                ¿Listo para ver tu tatuaje?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Únete a miles de personas que tomaron la decisión correcta
              </p>
              <Button
                size="lg"
                onClick={() => setShowWizard(true)}
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary via-secondary to-primary-glow hover:shadow-[0_0_40px_hsl(var(--primary)/0.7)] transition-all"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Comenzar ahora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Tattoo Vision AI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
