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
        toast.error(t("imageTooLarge"));
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
      toast.error(t("wizardMissingImages"));
      setError(t("wizardMissingImages"));
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
            <ImageIcon
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
              {t("chooseDesignDescription")}
            </p>
          </div>
          <div className="space-y-6">
            {!tattooDesign ? (
              <label className="block" htmlFor="tattoo-design-upload">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-secondary transition-all hover:bg-muted/50">
                  <ImageIcon
                    className="w-12 h-12 mx-auto mb-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-muted-foreground mb-2">
                    {t("clickToUploadDesign")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("imageFormats")}
                  </p>
                </div>
                <input
                  id="tattoo-design-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleTattooDesignUpload}
                  className="hidden"
                  aria-label={t("chooseDesignTitle")}
                />
              </label>
            ) : (
              <div className="space-y-4">
                <img
                  src={tattooDesign}
                  alt={t("tattooDesignAlt")}
                  loading="lazy"
                  className="w-full max-h-96 object-contain rounded-lg bg-white p-4"
                />
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    aria-label={t("back")}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" aria-hidden="true" />{" "}
                    {t("back")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setTattooDesign(null)}
                    className="flex-1"
                    aria-label={t("changeDesign")}
                  >
                    {t("changeDesign")}
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-secondary via-primary to-secondary-glow"
                    aria-label={t("generatePreview")}
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles
                          className="mr-2 w-4 h-4 animate-spin"
                          aria-hidden="true"
                        />
                        {t("generating")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 w-4 h-4" aria-hidden="true" />
                        {t("generatePreview")}
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
        </Card>
      )}
    </div>
  );
};

export default TattooWizard;
