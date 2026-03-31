// api/api.js
// Camada de comunicação com o backend — centraliza todas as chamadas HTTP com Axios

import axios from "axios";

// Instância do Axios configurada com a URL base do backend
// O valor vem da variável de ambiente VITE_API_URL (definida no .env)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Episódios ────────────────────────────────────────────────────────────────

/**
 * Busca a lista de episódios paginada do backend (que consulta a API do Rick and Morty).
 * @param {number} page - Número da página
 */
export const getEpisodes = (page = 1) =>
  api.get("/episodios", { params: { page } });

/**
 * Busca os detalhes de um episódio específico, incluindo os personagens.
 * @param {number} id - ID do episódio
 */
export const getEpisode = (id) => api.get(`/episodios/${id}`);

// ─── Diário ───────────────────────────────────────────────────────────────────

/**
 * Busca todas as entradas do diário com filtros opcionais.
 * @param {object} params - { page, limit, avaliacao, order_by }
 */
export const getDiario = (params = {}) => api.get("/diario", { params });

/**
 * Cria uma nova entrada no diário.
 * @param {{ episode_id, episode_name, nota, avaliacao }} data
 */
export const createDiario = (data) => api.post("/diario", data);

/**
 * Atualiza a nota e/ou avaliação de uma entrada existente.
 * @param {number} id - ID da entrada
 * @param {{ nota?, avaliacao? }} data
 */
export const updateDiario = (id, data) => api.put(`/diario/${id}`, data);

/**
 * Remove uma entrada do diário pelo ID.
 * @param {number} id - ID da entrada
 */
export const deleteDiario = (id) => api.delete(`/diario/${id}`);

export default api;
