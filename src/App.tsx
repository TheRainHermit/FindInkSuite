import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { ErrorProvider, useError } from "./hooks/useError";
import Home from "./pages/Home";

const TattooVision = React.lazy(
  () => import("./pages/FindInk_TattooVision/Index")
);
const CRM = React.lazy(() => import("./pages/FindInk_InkFlowCRMAI/Dashboard"));

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
          <Suspense fallback={<div>{t("loading")}</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tattoovision" element={<TattooVision />} />
              <Route path="/crm" element={<CRM />} />
            </Routes>
          </Suspense>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorProvider>
  );
};

export default App;
