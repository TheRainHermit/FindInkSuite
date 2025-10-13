import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPaintBrush, FaUserTie } from "react-icons/fa";
import heroImage from "@/assets/hero-tattoo.jpg";
import { useTranslation } from "react-i18next";
import HomeHeader from "@/components/HomeHeader";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    
    <div
      className="min-h-screen flex flex-col items-center justify-center relative animate-in fade-in duration-500"
      style={{
        background: "var(--gradient-hero)",
        transition: "var(--transition-smooth)",
      }}
    >
      <HomeHeader />
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src={heroImage}
          alt={t("homepage.heroImageAlt")}
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
      
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center animate-in fade-in duration-700 border"
        style={{
          boxShadow: "var(--shadow-neon-primary)",
          borderColor: "hsl(var(--border))",
        }}
      >
        <h1
          className="text-5xl font-extrabold mb-4 text-center"
          style={{
            background: "var(--gradient-primary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("homepage.title")}
        </h1>
        <p className="text-lg mb-8 text-center text-[hsl(var(--muted-foreground))] font-semibold">
          {t("homepage.subtitle")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <button
            className="group rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform hover:scale-105 focus:outline-none border"
            style={{
              background: "var(--gradient-primary)",
              color: "hsl(var(--card-foreground))",
              boxShadow: "var(--shadow-neon-primary)",
              borderColor: "hsl(var(--border))",
            }}
            onClick={() => navigate("/tattoovision")}
          >
            <FaPaintBrush className="text-5xl text-black mb-4 group-hover:animate-bounce" />
            <span className="text-2xl text-black font-semibold mb-2">
              {t("homepage.tattooVisionTitle")}
            </span>
            <span className="text-sm text-black opacity-80 text-center">
              {t("homepage.tattooVisionDesc")}
            </span>
          </button>
          <button
            className="group rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform hover:scale-105 focus:outline-none border"
            style={{
              background: "var(--gradient-secondary)",
              color: "hsl(var(--card-foreground))",
              boxShadow: "var(--shadow-neon-secondary)",
              borderColor: "hsl(var(--border))",
            }}
            onClick={() => navigate("/crm")}
          >
            <FaUserTie className="text-5xl text-black mb-4 group-hover:animate-bounce" />
            <span className="text-2xl text-black font-semibold mb-2">
              {t("homepage.crmTitle")}
            </span>
            <span className="text-sm text-black opacity-80 text-center">
              {t("homepage.crmDesc")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
