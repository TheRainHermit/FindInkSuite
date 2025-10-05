import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeSwitch from "@/components/ThemeSwitch";

const Header = () => {
  const { i18n, t } = useTranslation();

  return (
    <header
      role="navigation"
      aria-label={t("headerNavigation")}
      className="w-full flex items-center justify-between px-6 py-4 bg-card border-b border-border"
    >
      <img src="/logo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
      <span className="font-bold text-xl text-foreground">Tattoo Vision AI</span>
      <div className="container mx-auto flex justify-center items-center">
        
        <nav className="flex gap-8" aria-label={t("mainNavigation")}>
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary font-medium transition"
          >
            {t("home")}
          </Link>
          <Link
            to="/galeria"
            className="text-muted-foreground hover:text-primary font-medium transition"
          >
            {t("gallery")}
          </Link>
          <Link
            to="/contacto"
            className="text-muted-foreground hover:text-primary font-medium transition"
          >
            {t("contact")}
          </Link>
        </nav>
        
      </div>
      <div className="flex items-center px-9">
      <label htmlFor="language-select" className="sr-only">
          {t("selectLanguage")}
        </label>
        <select
          id="language-select"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="ml-4 px-2 py-1 rounded border border-border bg-background"
          aria-label={t("selectLanguage")}
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
        </div>
      <ThemeSwitch />
    </header>
  );
};

export default Header;
