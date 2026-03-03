import React, { createContext, useContext, useMemo, useState } from "react";
import { apiFetch } from "../api/client";
import type { AuthContextValue, LoginPayload, LoginResponse } from "../types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token"),
  );
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem("user_email"),
  );

  const isAuthed = !!token;

  async function login({ username, password }: LoginPayload) {
    const data = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      data: { email: username, password },
    });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_email", username);
    setToken(data.access_token);
    setUserEmail(username);
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    setToken(null);
    setUserEmail(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({ token, isAuthed, userEmail, login, logout }),
    [token, isAuthed, userEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
