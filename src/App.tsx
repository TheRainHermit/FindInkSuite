import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
const Index = React.lazy(() => import("./pages/FindInkTattooVision/Index"));
const Contact = React.lazy(() => import("./pages/FindInkTattooVision/Contact"));
const Gallery = React.lazy(() => import("./pages/FindInkTattooVision/Gallery"));
import PrivacyPolicy from "./pages/FindInkTattooVision/PrivacyPolicy";
import TermsOfUse from "./pages/FindInkTattooVision/TermsOfUse";
import NotFound from "./pages/NotFound";
import { ErrorProvider, useError } from "@/context/ErrorContext";
import { useTranslation } from "react-i18next";
import ApiTest from "./components/ApiTest";
import Dashboard from "./pages/FindInkInkFlowCRMAI/Dashboard";
import Clients from "./pages/FindInkInkFlowCRMAI/Clients";
import CalendarPage from "./pages/FindInkInkFlowCRMAI/CalendarPage";
import Assistant from "./pages/FindInkInkFlowCRMAI/Assistant";
import Portfolio from "./pages/FindInkInkFlowCRMAI/Portfolio";

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
            <Route
              path="/assistant"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <Assistant />
                </Suspense>
              }
            />
            <Route
              path="/clients"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <Clients />
                </Suspense>
              }
            />
            <Route
              path="/calendar"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <CalendarPage />
                </Suspense>
              }
            />
            <Route
              path="/portfolio"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <Portfolio />
                </Suspense>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <Dashboard />
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
