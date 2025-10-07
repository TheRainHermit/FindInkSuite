import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import example1 from "@/assets/example1.jpg";
import example2 from "@/assets/example2.jpg";
import example3 from "@/assets/example3.jpg";

const images = [example1, example2, example3];

const Gallery = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal con Escape y manejar foco
  useEffect(() => {
    if (selected !== null) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelected(null);
      };
      window.addEventListener("keydown", handleKeyDown);

      // Foco en el modal
      modalRef.current?.focus();

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [selected]);

  return (
    <>
      <Header />
      <main role="main" className="min-h-[70vh] bg-background py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-primary">
            {t("galleryTitle")}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="bg-card rounded-xl shadow-lg overflow-hidden flex items-center justify-center h-80 cursor-pointer"
                onClick={() => setSelected(idx)}
                tabIndex={0}
                role="button"
                aria-label={t("openImage") + ` ${idx + 1}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelected(idx);
                }}
              >
                <img
                  src={img}
                  alt={t("galleryTitle") + ` ${idx + 1}`}
                  loading="lazy"
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Lightbox Modal */}
        {selected !== null && (
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("galleryTitle")}
            tabIndex={-1}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 outline-none"
            onClick={() => setSelected(null)}
          >
            <img
              src={images[selected]}
              alt={t("galleryTitle") + ` ${selected + 1}`}
              className="max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl border-4 border-primary"
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gallery;
