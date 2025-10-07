import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useError } from "@/context/ErrorContext";

type WizardStep = 1 | 2 | 3;

const TattooWizard = () => {
  const { setError } = useError();
  const { t } = useTranslation();
  const [step, setStep] = useState<WizardStep>(1);
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [tattooDesign, setTattooDesign] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tattooPrompt, setTattooPrompt] = useState<string>("");

  const handleBodyImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 10MB");
        return;
      }
      try {
        // Subir imagen al storage de Supabase
        const { data, error } = await supabase.storage
          .from("tattoo-images")
          .upload(`body/${Date.now()}_${file.name}`, file);

        console.log("Upload result:", { data, error });

        if (error) {
          throw error;
        }

        if (!data || !data.path) {
          setError("No se pudo obtener la URL de la imagen subida.");
          toast.error("No se pudo obtener la URL de la imagen subida.");
          return;
        }

        // CORRECTO: getPublicUrl retorna un objeto { publicUrl: string }
        const { data: urlData } = supabase.storage
          .from("tattoo-images")
          .getPublicUrl(data.path);

        const publicUrl = urlData?.publicUrl;

        console.log("Body image URL:", publicUrl);

        setBodyImage(publicUrl);
      } catch (error) {
        setError(t("wizardGlobalError"));
        console.error("Error uploading body image:", error);
        toast.error(t("wizardGlobalError"));
      }
    }
  };

  const handleTattooDesignUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("imageTooLarge"));
        return;
      }
      try {
        // Subir diseño al storage de Supabase
        const { data, error } = await supabase.storage
          .from("tattoo-images")
          .upload(`design/${Date.now()}_${file.name}`, file);

        console.log("Upload result (design):", { data, error });

        if (error) {
          throw error;
        }

        if (!data || !data.path) {
          setError("No se pudo obtener la URL del diseño subido.");
          toast.error("No se pudo obtener la URL del diseño subido.");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("tattoo-images")
          .getPublicUrl(data.path);

        const publicUrl = urlData?.publicUrl;

        console.log("Tattoo design URL:", publicUrl);

        setTattooDesign(publicUrl);
      } catch (error) {
        setError(t("wizardGlobalError"));
        console.error("Error uploading tattoo design:", error);
        toast.error(t("wizardGlobalError"));
      }
    }
  };

  const handleGenerate = async () => {
    if (!bodyImage || tattooPrompt.trim().length < 15) {
      toast.error(t("wizardMissingImages"));
      setError(t("wizardMissingImages"));
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("apply-tattoo", {
        body: {
          bodyImage,
          tattooPrompt,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.image) {
        setResultImage(data.image);
        setStep(3);
        toast.success(t("wizardSuccess"));
      } else {
        throw new Error("No se recibió imagen");
      }
    } catch (error) {
      setError(t("wizardGlobalError"));
      console.error("Error generating tattoo:", error);
      toast.error(t("wizardGlobalError"));
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
    <div
      className="w-full max-w-4xl mx-auto"
      role="region"
      aria-label={t("wizardTitle")}
    >
      <h2 className="text-3xl font-bold mb-4" role="heading" aria-level={2}>
        {t("wizardTitle")}
      </h2>
      {/* Progress Steps */}
      <nav
        aria-label={t("wizardStepsLabel")}
        className="flex items-center justify-center mb-12 gap-4"
      >
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s
                  ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                  : "bg-muted text-muted-foreground"
              }`}
              aria-current={step === s ? "step" : undefined}
              aria-label={t(`wizardStep${s}`)}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-8 transition-all ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </nav>

      {/* Step 1: Upload Body Image */}
      {step === 1 && (
        <Card
          className="p-8 bg-card border-border"
          role="form"
          aria-label={t("uploadPhotoTitle")}
        >
          <div className="text-center mb-8">
            <Upload
              className="w-16 h-16 mx-auto mb-4 text-primary"
              aria-hidden="true"
            />
            <h2
              className="text-3xl font-bold mb-2"
              role="heading"
              aria-level={3}
            >
              {t("uploadPhotoTitle")}
            </h2>
            <p className="text-muted-foreground">
              {t("uploadPhotoDescription")}
            </p>
          </div>
          <div className="space-y-6">
            {!bodyImage ? (
              <label className="block" htmlFor="body-image-upload">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-all hover:bg-muted/50">
                  <Upload
                    className="w-12 h-12 mx-auto mb-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-muted-foreground mb-2">
                    {t("clickToUploadPhoto")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("imageFormats")}
                  </p>
                </div>
                <input
                  id="body-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBodyImageUpload}
                  className="hidden"
                  aria-label={t("uploadPhotoTitle")}
                />
              </label>
            ) : (
              <div className="space-y-4">
                <img
                  src={bodyImage}
                  alt={t("bodyImageAlt")}
                  loading="lazy"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setBodyImage(null)}
                    className="flex-1"
                    aria-label={t("changePhoto")}
                  >
                    {t("changePhoto")}
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                    aria-label={t("continue")}
                  >
                    {t("continue")}{" "}
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Step 2: Upload Tattoo Design */}
      {step === 2 && (
        <Card
          className="p-8 bg-card border-border"
          role="form"
          aria-label={t("chooseDesignTitle")}
        >
          <div className="text-center mb-8">
            <Sparkles
              className="w-16 h-16 mx-auto mb-4 text-secondary"
              aria-hidden="true"
            />
            <h2
              className="text-3xl font-bold mb-2"
              role="heading"
              aria-level={3}
            >
              {t("chooseDesignTitle")}
            </h2>
            <p className="text-muted-foreground">
              Describe el diseño del tatuaje que quieres visualizar sobre tu
              piel.
            </p>
          </div>
          <div>
            <label
              htmlFor="tattooPrompt"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              {t("tattooPromptLabel")}
            </label>
            <textarea
              id="tattooPrompt"
              value={tattooPrompt}
              onChange={(e) => setTattooPrompt(e.target.value)}
              placeholder={t("tattooPromptPlaceholder")}
              rows={4}
              className="w-full p-2 rounded-md bg-muted text-foreground placeholder:text-muted-foreground border focus:ring-2 focus:ring-primary focus:outline-none"
              aria-label={t("tattooPromptLabel")}
            />
            <div className="text-xs text-muted-foreground mt-2">
              {t("tattooPromptExamples")}
              <ul className="list-disc ml-4">
                <li>{t("tattooPromptExample1")}</li>
                <li>{t("tattooPromptExample2")}</li>
                <li>{t("tattooPromptExample3")}</li>
              </ul>
            </div>
            <div className="flex items-center justify-between mt-8">
              <Button
                onClick={handleGenerate}
                disabled={
                  isProcessing || !bodyImage || tattooPrompt.trim().length < 15
                }
                className={`w-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center gap-2 ${
                  isProcessing ? "opacity-60 cursor-not-allowed" : ""
                }`}
                aria-label={t("generatePreview")}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                    </span>
                    Generando...
                  </>
                ) : (
                  t("generatePreview")
                )}
              </Button>
            </div>
            {tattooPrompt.trim().length > 0 &&
              tattooPrompt.trim().length < 15 && (
                <p className="text-xs text-warning mt-2">
                  {t("tattooPromptWarning")}
                </p>
              )}
          </div>
        </Card>
      )}

      {/* Step 3: Show Result */}
      {step === 3 && resultImage && (
        <Card
          className="p-8 bg-card border-border"
          role="region"
          aria-label={t("tattooVisualized")}
        >
          <div className="text-center mb-8">
            <Sparkles
              className="w-16 h-16 mx-auto mb-4 text-primary"
              aria-hidden="true"
            />
            <h2
              className="text-3xl font-bold mb-2"
              role="heading"
              aria-level={3}
            >
              {t("tattooVisualized")}
            </h2>
            <p className="text-muted-foreground">
              {t("tattooVisualizationDescription")}
            </p>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <img
                src={resultImage}
                alt={t("resultImageAlt")}
                loading="lazy"
                className="w-full rounded-lg shadow-2xl"
              />
              <div
                className="absolute inset-0 rounded-lg shadow-[0_0_40px_hsl(var(--primary)/0.3)] pointer-events-none"
                aria-hidden="true"
              />
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={resetWizard}
                className="flex-1"
                aria-label={t("tryAnotherDesign")}
              >
                {t("tryAnotherDesign")}
              </Button>
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = resultImage;
                  link.download = "mi-tatuaje-preview.png";
                  link.click();
                }}
                className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                aria-label={t("downloadImage")}
              >
                {t("downloadImage")}
              </Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <strong>Prompt usado:</strong> {tattooPrompt}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TattooWizard;
