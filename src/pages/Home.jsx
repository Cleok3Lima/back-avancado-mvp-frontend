// pages/Home.jsx
// Página inicial — lista de episódios com paginação e filtro por temporada

import { useState, useEffect } from "react";
import { getEpisodes } from "../api/api";
import EpisodeCard from "../components/EpisodeCard";

const SEASONS = [1, 2, 3, 4, 5];

export default function Home() {
  const [episodes, setEpisodes] = useState([]);
  const [pageInfo, setPageInfo] = useState({ count: 0, pages: 1, next: null, prev: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEpisodes(currentPage, selectedSeason);
  }, [currentPage, selectedSeason]);

  const fetchEpisodes = async (page, season) => {
    setLoading(true);
    setError("");
    try {
      const response = await getEpisodes(page, season);
      setEpisodes(response.data.results);
      setPageInfo(response.data.info);
    } catch (err) {
      setError("Erro ao carregar episódios. Verifique se o backend está rodando.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function handleSeasonChange(e) {
    const value = e.target.value;
    setSelectedSeason(value ? parseInt(value) : null);
    setCurrentPage(1);
  }

  const showPagination = !selectedSeason && !loading && !error;

  return (
    <div className="page">
      <div className="page__header">
        <h1>🛸 Episódios de Rick and Morty</h1>
        <p className="page__subtitle">
          {pageInfo.count} episódios no total
          {!selectedSeason && ` • Página ${currentPage} de ${pageInfo.pages}`}
        </p>
      </div>

      <div className="page__filters">
        <select
          className="filter-select"
          value={selectedSeason ?? ""}
          onChange={handleSeasonChange}
        >
          <option value="">Todas as temporadas</option>
          {SEASONS.map((s) => (
            <option key={s} value={s}>Temporada {s}</option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Carregando episódios...</div>}

      {error && <div className="alert alert--error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="episode-grid">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>

          {showPagination && (
            <div className="pagination">
              <button
                className="btn btn--secondary"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={!pageInfo.prev}
              >
                ← Anterior
              </button>
              <span className="pagination__info">
                {currentPage} / {pageInfo.pages}
              </span>
              <button
                className="btn btn--secondary"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!pageInfo.next}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
