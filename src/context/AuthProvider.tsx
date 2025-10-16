import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

type User = {
  id: string;
  email: string;
  role?: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setJwt(token);
      // Opcional: obtener datos del usuario con el token
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => setUser(data))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      setIsLoading(false);
      return false;
    }
    const { access_token } = await res.json();
    setJwt(access_token);
    localStorage.setItem("jwt", access_token);
    // Obtener datos del usuario
    const userRes = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (userRes.ok) {
      setUser(await userRes.json());
    }
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setJwt(null);
    setUser(null);
    localStorage.removeItem("jwt");
  };

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};