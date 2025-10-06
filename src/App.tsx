import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
const Index = React.lazy(() => import("./pages/Index"));
// Make sure the file exists at the specified path, or update the import path if the file is named differently, e.g. Contacto
const Contact = React.lazy(() => import("./pages/Contact"));
const Gallery = React.lazy(() => import("./pages/Gallery"));
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import NotFound from "./pages/NotFound";
import { ErrorProvider, useError } from "@/context/ErrorContext";
import { useTranslation } from "react-i18next";
import ApiTest from "./components/ApiTest";

const GlobalError = () => {
  const { error, setError } = useError();
  if (!error) return null;
  return (
    <div
      role="alert"
      className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
      onClick={() => setError(null)}
      tabIndex={0}
      aria-label={error}
    >
      {error}
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
  // Si no hay preferencia guardada, activa modo oscuro por defecto
  const theme = localStorage.getItem("theme");
  if (!theme) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
  }, []);

  return (
    <ErrorProvider>
      <GlobalError />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <Index />
                </Suspense>
              }
            />
            <Route
              path="/contacto"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <Contact />
                </Suspense>
              }
            />
            <Route
              path="/galeria"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <Gallery />
                </Suspense>
              }
            />
            <Route
              path="/privacidad"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <PrivacyPolicy />
                </Suspense>
              }
            />
            <Route
              path="/api-test"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <ApiTest />
                </Suspense>
              }
            />
            <Route
              path="/terminos"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <TermsOfUse />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorProvider>
  );
};

export default App;
