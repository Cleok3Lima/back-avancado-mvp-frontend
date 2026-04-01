// api/api.js
// Camada de comunicação com o backend — centraliza todas as chamadas HTTP com Axios

import axios from "axios";

// Instância do Axios configurada com a URL base do backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta o Bearer token JWT em todas as requisições (se disponível)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata 401 globalmente: limpa o token expirado e redireciona para /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Episódios ────────────────────────────────────────────────────────────────

export const getEpisodes = (page = 1) =>
  api.get("/episodios", { params: { page } });

export const getEpisode = (id) => api.get(`/episodios/${id}`);

// ─── Diário ───────────────────────────────────────────────────────────────────

export const getDiario = (params = {}) => api.get("/diario", { params });

export const createDiario = (data) => api.post("/diario", data);

export const updateDiario = (id, data) => api.put(`/diario/${id}`, data);

export const deleteDiario = (id) => api.delete(`/diario/${id}`);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const register = (data) => api.post("/auth/register", data);

export const loginApi = (data) => api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");

export default api;
