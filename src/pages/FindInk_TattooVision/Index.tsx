import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, Users } from "lucide-react";
import React, { Suspense, useRef } from "react";
const TattooWizard = React.lazy(() => import("@/components/FindInk_TattooVision/TattooWizard"));
import ExamplesGallery from "@/components/FindInk_TattooVision/ExamplesGallery";
import heroImage from "@/assets/hero-tattoo.jpg";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useError } from "@/context/ErrorContext";

const Index = () => {
  const { setError } = useError();
  const { t } = useTranslation();
  const [showWizard, setShowWizard] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const wizardRef = useRef<HTMLDivElement>(null);

  const handleShowWizard = () => {
    setShowWizard(true);
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Espera breve para asegurar que el componente se renderice
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        role="region"
        aria-label={t("heroSectionLabel")}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img
            src={heroImage}
            alt={t("heroImageAlt")}
            loading="lazy"
            className="w-full h-full object-cover opacity-30"
          />
          {/* Degradado verdoso/azulado */}
          <div
            className="absolute inset-0"
            style={{
              background: "var(--gradient-hero)",
              opacity: 0.65,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Content */}
        <div
          className="relative z-10 container mx-auto px-4 py-20 text-center"
          role="main"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/0 text-foreground border border-primary/10 text-sm font-medium mb-6"
                role="status"
                aria-live="polite"
              >
                {t("heroBadge")}
              </span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg"
              role="heading"
              aria-level={1}
            >
              {t("heroTitle1")}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary-glow bg-clip-text text-transparent drop-shadow-lg">
                {t("heroTitle2")}
              </span>
              <br />
              {t("heroTitle3")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto drop-shadow">
              {t("heroDesc")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={handleShowWizard}
                aria-label={t("tryNow")}
                className="
                  px-8 py-3 font-bold
                  text-black
                  bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]
                  shadow-lg transition hover:brightness-110
                  border-none
                "
              >
                {t("tryNow")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 font-bold text-[hsl(var(--card-foreground))] bg-card border border-border hover:bg-muted transition"
                onClick={() => setShowExamples(true)}
                aria-label={t("seeExamples")}
              >
                {t("seeExamples")}
              </Button>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
              role="list"
              aria-label={t("statsLabel")}
            >
              <div className="space-y-2" role="listitem">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("statAccuracy")}
                </div>
              </div>
              <div className="space-y-2" role="listitem">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("statVisualized")}
                </div>
              </div>
              <div className="space-y-2" role="listitem">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  4.9★
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("statRating")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
      </section>

      {/* Wizard Section */}
      {showWizard && (
        <section
          ref={wizardRef}
          className="py-20 px-4"
          role="region"
          aria-label={t("wizardSectionLabel")}
        >
          <Suspense fallback={<div>{t("loading")}</div>}>
            <TattooWizard />
          </Suspense>
        </section>
      )}

      {/* Examples Section */}
      {showExamples && (
        <ExamplesGallery onClose={() => setShowExamples(false)} />
      )}

      {/* Features Section */}
      <section
        className="py-20 px-4 bg-gradient-to-b from-background to-muted/30"
        role="region"
        aria-label={t("featuresSectionLabel")}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              role="heading"
              aria-level={2}
            >
              {t("featuresTitle")}
            </h2>
            <p className="text-xl text-muted-foreground">{t("featuresDesc")}</p>
          </div>

          <div
            className="grid md:grid-cols-3 gap-8"
            role="list"
            aria-label={t("featuresListLabel")}
          >
            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/70 transition-all group"
              role="listitem"
            >
              <div
                className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all"
                aria-hidden="true"
              >
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("featureInstant")}</h3>
              <p className="text-muted-foreground">{t("featureInstantDesc")}</p>
            </div>

            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-secondary/50 transition-all group"
              role="listitem"
            >
              <div
                className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_hsl(var(--secondary)/0.5)] transition-all"
                aria-hidden="true"
              >
                <Shield className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("featurePrivate")}</h3>
              <p className="text-muted-foreground">{t("featurePrivateDesc")}</p>
            </div>

            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group"
              role="listitem"
            >
              <div
                className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all"
                aria-hidden="true"
              >
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("featureNetwork")}</h3>
              <p className="text-muted-foreground">{t("featureNetworkDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4"
        role="region"
        aria-label={t("ctaSectionLabel")}
      >
        <div className="container mx-auto max-w-4xl text-center ">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 border border-primary/30 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                role="heading"
                aria-level={2}
              >
                {t("ctaTitle")}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t("ctaDesc")}
              </p>
              <Button
                size="lg"
                onClick={handleShowWizard}
                aria-label={t("ctaButton")}
                className="
                  px-8 py-3 font-bold
                  text-black
                  bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]
                  shadow-lg transition hover:brightness-110
                  border-none
                "
              >
                {t("ctaButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
