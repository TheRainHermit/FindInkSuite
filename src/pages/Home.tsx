import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPaintBrush, FaUserTie } from "react-icons/fa";
import heroImage from "@/assets/hero-tattoo.jpg";
import { useTranslation } from "react-i18next";
//import Footer from "../components/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[hsl(var(--ink-purple))] via-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))]">
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
      <div className="bg-primary/20 border-primary/10 bg-gradient-to-r from-primary via-secondary to-primary-glow backdrop-blur-lg rounded-2xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center animate-in fade-in duration-700">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[hsl(var(--ink-purple))] via-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))] bg-clip-text text-foreground text-center">
          Bienvenido a FindInk Suite
        </h1>
        <p className="text-lg text-gray-700 font-bold mb-8 text-center">
          Elige el módulo que deseas explorar:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <button
            className="group bg-gradient-to-br from-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))] text-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform hover:scale-105 focus:outline-none"
            onClick={() => navigate("/tattoovision")}
          >
            <FaPaintBrush className="text-5xl mb-4 group-hover:animate-bounce" />
            <span className="text-2xl font-semibold mb-2">Tattoo Vision</span>
            <span className="text-sm opacity-80 text-center">
              Genera vistas previas de tatuajes con IA.
            </span>
          </button>
          <button
            className="group bg-gradient-to-br from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] text-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform hover:scale-105 focus:outline-none"
            onClick={() => navigate("/crm")}
          >
            <FaUserTie className="text-5xl mb-4 group-hover:animate-bounce" />
            <span className="text-2xl font-semibold mb-2">InkFlow CRM</span>
            <span className="text-sm opacity-80 text-center">
              Gestiona clientes, citas y tu estudio.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;