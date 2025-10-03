import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { i18n, t } = useTranslation();

  return (
    <header
      role="navigation"
      aria-label={t("headerNavigation")}
      className="w-full py-6 px-4 border-b border-border bg-background shadow-sm"
    >
      <div className="container mx-auto flex justify-between items-center">
        <span className="font-bold text-xl text-primary">Tattoo Vision AI</span>
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
    </header>
  );
};

export default Header;
