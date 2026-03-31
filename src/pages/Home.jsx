// pages/Home.jsx
// Página inicial — lista de episódios com paginação

import { useState, useEffect } from "react";
import { getEpisodes } from "../api/api";
import EpisodeCard from "../components/EpisodeCard";

export default function Home() {
  const [episodes, setEpisodes] = useState([]);
  const [pageInfo, setPageInfo] = useState({ count: 0, pages: 1, next: null, prev: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEpisodes(currentPage);
  }, [currentPage]);

  const fetchEpisodes = async (page) => {
    setLoading(true);
    setError("");
    try {
      const response = await getEpisodes(page);
      setEpisodes(response.data.results);
      setPageInfo(response.data.info);
    } catch (err) {
      setError("Erro ao carregar episódios. Verifique se o backend está rodando.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1>🛸 Episódios de Rick and Morty</h1>
        <p className="page__subtitle">
          {pageInfo.count} episódios no total • Página {currentPage} de {pageInfo.pages}
        </p>
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

          {/* Controles de paginação */}
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
        </>
      )}
    </div>
  );
}
