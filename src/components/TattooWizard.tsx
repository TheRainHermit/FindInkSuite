import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type WizardStep = 1 | 2 | 3;

const TattooWizard = () => {
  const [step, setStep] = useState<WizardStep>(1);
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [tattooDesign, setTattooDesign] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBodyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBodyImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTattooDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTattooDesign(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!bodyImage || !tattooDesign) {
      toast.error("Por favor, sube ambas imágenes");
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("apply-tattoo", {
        body: {
          bodyImage,
          tattooDesign,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.image) {
        setResultImage(data.image);
        setStep(3);
        toast.success("¡Tatuaje aplicado con éxito!");
      } else {
        throw new Error("No se recibió imagen");
      }
    } catch (error) {
      console.error("Error generating tattoo:", error);
      toast.error("Error al generar el tatuaje. Por favor, intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setBodyImage(null);
    setTattooDesign(null);
    setResultImage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12 gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s
                  ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 transition-all ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Upload Body Image */}
      {step === 1 && (
        <Card className="p-8 bg-card border-border">
          <div className="text-center mb-8">
            <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-2">Sube tu foto</h2>
            <p className="text-muted-foreground">
              Toma una foto de la parte del cuerpo donde quieres ver el tatuaje
            </p>
          </div>

          <div className="space-y-6">
            {!bodyImage ? (
              <label className="block">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-all hover:bg-muted/50">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Haz clic para subir tu foto
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Formatos: JPG, PNG (máx. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBodyImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <img
                  src={bodyImage}
                  alt="Body part"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setBodyImage(null)}
                    className="flex-1"
                  >
                    Cambiar foto
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                  >
                    Continuar <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Step 2: Upload Tattoo Design */}
      {step === 2 && (
        <Card className="p-8 bg-card border-border">
          <div className="text-center mb-8">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl font-bold mb-2">Elige tu diseño</h2>
            <p className="text-muted-foreground">
              Sube el diseño de tatuaje que quieres visualizar
            </p>
          </div>

          <div className="space-y-6">
            {!tattooDesign ? (
              <label className="block">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-secondary transition-all hover:bg-muted/50">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Haz clic para subir el diseño
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Formatos: JPG, PNG (máx. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTattooDesignUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <img
                  src={tattooDesign}
                  alt="Tattoo design"
                  className="w-full max-h-96 object-contain rounded-lg bg-white p-4"
                />
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Atrás
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setTattooDesign(null)}
                    className="flex-1"
                  >
                    Cambiar diseño
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-secondary via-primary to-secondary-glow"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="mr-2 w-4 h-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 w-4 h-4" />
                        Generar Vista Previa
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Step 3: Show Result */}
      {step === 3 && resultImage && (
        <Card className="p-8 bg-card border-border">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-2">¡Tu tatuaje visualizado!</h2>
            <p className="text-muted-foreground">
              Así se vería el tatuaje en tu piel
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <img
                src={resultImage}
                alt="Result"
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 rounded-lg shadow-[0_0_40px_hsl(var(--primary)/0.3)] pointer-events-none" />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={resetWizard}
                className="flex-1"
              >
                Probar otro diseño
              </Button>
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = resultImage;
                  link.download = "mi-tatuaje-preview.png";
                  link.click();
                }}
                className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
              >
                Descargar imagen
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TattooWizard;
