// pages/MyDiary.jsx
// Página "Meu Diário" — lista todas as entradas salvas com opções de editar e deletar

import { useState, useEffect } from "react";
import { getDiario, updateDiario, deleteDiario } from "../api/api";
import DiaryEntryCard from "../components/DiaryEntryCard";
import { Link } from "react-router-dom";

export default function MyDiary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [filterRating, setFilterRating] = useState("");
  const [orderBy, setOrderBy] = useState("created_at_desc");

  useEffect(() => {
    fetchEntries();
  }, [filterRating, orderBy]);

  const fetchEntries = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { limit: 100, order_by: orderBy };
      if (filterRating) params.avaliacao = filterRating;

      const response = await getDiario(params);
      setEntries(response.data);
    } catch (err) {
      setError("Erro ao carregar o diário.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const response = await updateDiario(id, data);
      // Atualiza somente a entrada editada na lista (sem re-fetch)
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? response.data : entry))
      );
    } catch (err) {
      alert("Erro ao atualizar a entrada. Tente novamente.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDiario(id);
      // Remove a entrada deletada da lista local
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      alert("Erro ao deletar a entrada. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1>📔 Meu Diário</h1>
        <p className="page__subtitle">
          {entries.length} {entries.length === 1 ? "episódio anotado" : "episódios anotados"}
        </p>
      </div>

      {/* Filtros e ordenação */}
      <div className="diary-filters">
        <div className="diary-filters__group">
          <label htmlFor="filter-rating">Filtrar por avaliação:</label>
          <select
            id="filter-rating"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </select>
        </div>

        <div className="diary-filters__group">
          <label htmlFor="order-by">Ordenar por:</label>
          <select
            id="order-by"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value="created_at_desc">Data (mais recentes)</option>
            <option value="created_at_asc">Data (mais antigos)</option>
            <option value="avaliacao_desc">Avaliação (maiores)</option>
            <option value="avaliacao_asc">Avaliação (menores)</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Carregando diário...</div>}

      {error && <div className="alert alert--error">{error}</div>}

      {!loading && !error && entries.length === 0 && (
        <div className="empty-state">
          <p>Seu diário está vazio. Que tal começar a explorar os episódios?</p>
          <Link to="/" className="btn btn--primary">Ver episódios</Link>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="diary-list">
          {entries.map((entry) => (
            <DiaryEntryCard
              key={entry.id}
              entry={entry}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
