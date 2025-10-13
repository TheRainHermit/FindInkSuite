import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-5xl font-bold mb-4 text-primary">{t("notFoundTitle")}</h1>
      <p className="text-lg mb-8 text-muted-foreground">{t("notFoundDesc")}</p>
      <Link to="/" className="text-primary underline text-lg">{t("notFoundHome")}</Link>
    </div>
  );
};

export default NotFound;
