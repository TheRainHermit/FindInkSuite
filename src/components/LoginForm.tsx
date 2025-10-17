import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, RefreshCcw, UserPlus, Loader2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [recoveryMsg, setRecoveryMsg] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Correo inválido");
      valid = false;
    }
    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!validate()) return;
    const successLogin = await login(email, password);
    if (!successLogin) {
      setError("Correo o contraseña incorrectos");
    }else {
      navigate("/crm"); // <-- Redirige al dashboard
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMsg("");
    if (!/\S+@\S+\.\S+/.test(email)) {
      setRecoveryMsg("Ingresa un correo válido.");
      return;
    }
    setTimeout(() => {
      setRecoveryMsg("Enlace de recuperación enviado a tu correo.");
    }, 800);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMsg("");
    setTimeout(() => {
      setRegisterMsg(
        "Registro exitoso. Revisa tu correo para activar la cuenta."
      );
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--ink-purple)), hsl(var(--ink-cyan)))",
        backgroundImage:
          "url('/src/assets/hero-tattoo.jpg'), linear-gradient(135deg, hsl(var(--ink-purple)), hsl(var(--ink-cyan)))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="w-full max-w-md bg-card/80 rounded-lg shadow-lg p-8 backdrop-blur">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center text-2xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] bg-clip-text text-white">
            Iniciar sesión
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Correo electrónico"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            {emailError && (
              <div className="text-red-500 text-sm text-center">
                {emailError}
              </div>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Contraseña"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {passwordError && (
              <div className="text-red-500 text-sm text-center">
                {passwordError}
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm text-center">{success}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
          <div className="flex justify-between pt-2">
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-[hsl(var(--ink-purple))] hover:underline"
              onClick={() => {
                setShowRecovery(true);
                setRecoveryMsg("");
              }}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4" /> ¿Olvidaste tu contraseña?
            </button>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-[hsl(var(--ink-cyan))] hover:underline"
              onClick={() => navigate("/register")}
              disabled={isLoading}
            >
              <UserPlus className="h-4 w-4" /> Registro rápido
            </button>
          </div>
        </form>

        {showRecovery && (
          <form onSubmit={handleRecovery} className="mt-6 space-y-4">
            <div className="text-center text-lg font-semibold">
              Recuperar contraseña
            </div>
            <Input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            {recoveryMsg && (
              <div
                className={`text-sm text-center ${
                  recoveryMsg.includes("enviado")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {recoveryMsg}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              Enviar enlace
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowRecovery(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </form>
        )}

        {showRegister && (
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div className="text-center text-lg font-semibold">
              Registro rápido
            </div>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Nombre"
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              required
              disabled={isLoading}
            />
            {registerMsg && (
              <div className="text-green-500 text-sm text-center">
                {registerMsg}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              Registrarse
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowRegister(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </form>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-full mt-4 flex items-center justify-center gap-2"
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5" />
          Volver a Home
        </Button>
      </div>
    </div>
  );
}
