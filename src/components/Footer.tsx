import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted py-12 px-4 border-t border-border bg-gradient-to-b from-background to-muted/30" >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start text-muted-foreground">
        {/* Columna 1: Logo */}
        <div className="flex flex-col items-center justify-center text-center h-full">
          <img
            src="/logo.jpg"
            alt="Tattoo Vision AI Logo"
            className="w-24 h-24 mb-3 mx-auto rounded-full shadow-lg object-cover"
          />
          <span className="text-base text-muted-foreground mt-2">{t("footerTagline")}</span>
        </div>
        {/* Columna 2: Descripción */}
        <div className="flex flex-col items-start md:items-start text-center md:text-left">
          <h3 className="font-bold text-lg mb-2 text-foreground">
            Tattoo Vision AI
          </h3>
          <p className="mb-4">{t("footerDescription")}</p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://github.com/TheRainHermit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 hover:text-primary transition" />
            </a>
            <a
              href="https://linkedin.com/in/mianfamo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 hover:text-primary transition" />
            </a>
            <a href="mailto:info@tattoovision.ai" aria-label="Email">
              <Mail className="w-6 h-6 hover:text-primary transition" />
            </a>
          </div>
        </div>
        {/* Columna 3: Enlaces rápidos */}
        <div className="flex flex-col items-start md:items-start text-center md:text-left">
          <h3 className="font-bold text-lg mb-2 text-foreground">
            {t("quickLinks")}
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="hover:text-primary transition"
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/galeria"
                className="hover:text-primary transition"
              >
                {t("gallery")}
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className="hover:text-primary transition"
              >
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link
                to="/privacidad"
                className="hover:text-primary transition"
              >
                {t("privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link
                to="/terminos"
                className="hover:text-primary transition"
              >
                {t("termsOfUse")}
              </Link>
            </li>
          </ul>
        </div>
        {/* Columna 4: Contacto */}
        <div className="flex flex-col items-start md:items-start text-center md:text-left">
          <h3 className="font-bold text-lg mb-2 text-foreground">{t("contact")}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@findink.co" className="hover:text-primary transition">info@findink.co</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+573042144195" className="hover:text-primary transition">+57 3042144195</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                Medellín, Colombia<br />
                Latinoamérica
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 text-center text-xs text-muted-foreground">
        © 2025 Tattoo Vision AI. {t("allRightsReserved")}
      </div>
    </footer>
  );
};

export default Footer;
