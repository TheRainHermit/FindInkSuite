import { useTranslation } from "react-i18next";

const HomeHeader = () => {
  const { i18n, t } = useTranslation();

  return (
    <header
      role="navigation"
      aria-label={t("headerNavigation")}
      className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-card/95 border-b border-border shadow-md z-20"
      style={{
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center">
        <img src="/logo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
        <span className="font-bold text-2xl text-foreground">FindInk Suite</span>
      </div>
      <div className="flex items-center">
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

export default HomeHeader;