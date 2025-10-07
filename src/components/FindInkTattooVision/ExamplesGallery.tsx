import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import example1 from "@/assets/example1.jpg";
import example2 from "@/assets/example2.jpg";
import example3 from "@/assets/example3.jpg";

const exampleImages = [
  // Usa imágenes reales o de muestra en /assets/
  example1,
  example2,
  example3,
];

const ExamplesGallery = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  // Foco y Escape para cerrar modal
  useEffect(() => {
    modalRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("galleryTitle")}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 outline-none"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl p-8 max-w-2xl w-full relative"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="outline"
          className="absolute top-4 right-4"
          onClick={onClose}
          aria-label={t("close")}
        >
          {t("close")}
        </Button>
        <h2
          className="text-2xl font-bold mb-6 text-center"
          role="heading"
          aria-level={2}
        >
          {t("galleryTitle")}
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          role="list"
          aria-label={t("galleryTitle")}
        >
          {exampleImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={t("galleryTitle") + ` ${idx + 1}`}
              loading="lazy"
              className="rounded-lg shadow-md object-cover w-full h-48"
              role="listitem"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamplesGallery;