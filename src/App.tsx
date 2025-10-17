import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { ErrorProvider, useError } from "./hooks/useError";
import { AuthProvider } from "./context/AuthProvider";
import Home from "./pages/Home";
import { useAuth } from "./hooks/useAuth";
const Layout = React.lazy(
  () => import("./components/FindInk_InkFlowCRMAI/Layout")
);
const Dashboard = React.lazy(
  () => import("./pages/FindInk_InkFlowCRMAI/Dashboard")
);
const Clients = React.lazy(
  () => import("./pages/FindInk_InkFlowCRMAI/Clients")
);
const CalendarPage = React.lazy(
  () => import("./pages/FindInk_InkFlowCRMAI/CalendarPage")
);
const Assistant = React.lazy(
  () => import("./pages/FindInk_InkFlowCRMAI/Assistant")
);
const Portfolio = React.lazy(
  () => import("./pages/FindInk_InkFlowCRMAI/Portfolio")
);
const Artists = React.lazy(
  () => import("./pages/FindInk_InkFlowCRMAI/Artists")
);
const NotFound = React.lazy(() => import("./pages/NotFound"));
const TattooVision = React.lazy(
  () => import("./pages/FindInk_TattooVision/Index")
);
const RealidadAumentada = React.lazy(
  () => import("./pages/Realidad_Aumentada/Index")
);
const LoginForm = React.lazy(() => import("./components/LoginForm"));
const RegisterPage = React.lazy(
  () => import("./pages/FindInk_InkFlowCRMAI/RegisterPage")
);
const AppointmentRequestPage = React.lazy(
  () => import("./pages/FindInk_InkFlowCRMAI/AppointmentRequestPage")
);

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

// Ruta protegida para el CRM
function ProtectedCRM() {
  const { jwt, user, isLoading } = useAuth();
  if (isLoading) return <div className="p-8 text-center">Cargando...</div>;
  if (!jwt || !user) return <LoginForm />;
  return <Outlet />;
}

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
    <AuthProvider>
      <ErrorProvider>
        <GlobalError />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<div>{t("loading")}</div>}>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/tattoovision" element={<TattooVision />} />
                <Route
                  path="/realidad-aumentada"
                  element={<RealidadAumentada />}
                />
                {/* CRM protegido */}
                <Route path="/crm" element={<ProtectedCRM />}>
                  <Route element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="assistant" element={<Assistant />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="artists" element={<Artists />} />
                    <Route path="/crm/appointments/request" element={<AppointmentRequestPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorProvider>
    </AuthProvider>
  );
};

export default App;
