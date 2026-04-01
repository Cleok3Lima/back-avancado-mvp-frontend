// context/AuthContext.jsx
// Estado global de autenticação — expõe user, loading, login() e logout()

import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // null = não autenticado; objeto = dados do usuário logado
  const [user, setUser] = useState(null);
  // true enquanto valida o token salvo no localStorage (evita flash de redirect)
  const [loading, setLoading] = useState(true);

  // Ao montar: verifica se há um token válido e hidrata o estado do usuário
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  function login(token, userData) {
    localStorage.setItem("token", token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
