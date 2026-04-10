// pages/EpisodeDetail.jsx
// Página de detalhes de um episódio — mostra informações, personagens e formulário do diário

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEpisode, getDiario, createDiario, updateDiario } from "../api/api";
import DiaryEntryForm from "../components/DiaryEntryForm";
import StarRating from "../components/StarRating";
import EPISODE_NAMES_PT from "../data/episodeNamesPt";

const STATUS_PT = { Alive: "Vivo", Dead: "Morto", unknown: "N/A" };

export default function EpisodeDetail() {
  const { id } = useParams();

  const [episode, setEpisode] = useState(null);
  const [diaryEntry, setDiaryEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Busca o episódio e as entradas do diário em paralelo
      const [epResponse, diarioResponse] = await Promise.all([
        getEpisode(id),
        getDiario({ limit: 100 }), // busca todas para encontrar a deste episódio
      ]);

      setEpisode(epResponse.data);

      // Encontra a entrada do diário correspondente a este episódio (se existir)
      const existingEntry = diarioResponse.data.find(
        (entry) => entry.episode_id === parseInt(id)
      );
      setDiaryEntry(existingEntry || null);
    } catch (err) {
      setError("Erro ao carregar os detalhes do episódio.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async ({ nota, avaliacao }) => {
    setFormLoading(true);
    setSuccessMsg("");
    try {
      if (diaryEntry) {
        // Atualiza entrada existente
        const response = await updateDiario(diaryEntry.id, { nota, avaliacao });
        setDiaryEntry(response.data);
        setSuccessMsg("Anotação atualizada com sucesso! ✅");
      } else {
        // Cria nova entrada
        const response = await createDiario({
          episode_id: parseInt(id),
          episode_name: EPISODE_NAMES_PT[episode.episode] ?? episode.name,
          nota,
          avaliacao,
        });
        setDiaryEntry(response.data);
        setSuccessMsg("Episódio adicionado ao seu diário! ✅");
      }
      setIsEditing(false);
    } catch (err) {
      setError("Erro ao salvar a anotação. Tente novamente.");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando episódio...</div>;
  if (error) return <div className="alert alert--error">{error}</div>;
  if (!episode) return null;

  return (
    <div className="page">
      <Link to="/" className="btn btn--back">← Voltar aos episódios</Link>

      {/* Cabeçalho do episódio */}
      <div className="episode-detail__header">
        <div className="episode-detail__badge">{episode.episode}</div>
        <h1>{EPISODE_NAMES_PT[episode.episode] ?? episode.name}</h1>
        <p>📅 {new Date(episode.air_date).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Grade de personagens */}
      {episode.characters && episode.characters.length > 0 && (
        <section className="episode-detail__section">
          <h2>Personagens ({episode.characters.length})</h2>
          <div className="character-grid">
            {episode.characters.map((char) => (
              <div key={char.id} className="character-card">
                <img src={char.image} alt={char.name} loading="lazy" />
                <p className="character-card__name">{char.name}</p>
                <span
                  className={`character-card__status character-card__status--${char.status?.toLowerCase()}`}
                >
                  {STATUS_PT[char.status] ?? char.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção do diário */}
      <section className="episode-detail__section">
        <h2>📔 Meu Diário</h2>

        {successMsg && <div className="alert alert--success">{successMsg}</div>}

        {diaryEntry && !isEditing ? (
          // Exibe a entrada existente
          <div className="diary-existing">
            <div className="diary-existing__rating">
              <StarRating value={diaryEntry.avaliacao} readOnly size={28} />
              <span>{diaryEntry.avaliacao}/5</span>
            </div>
            <blockquote className="diary-existing__nota">{diaryEntry.nota}</blockquote>
            <button
              className="btn btn--secondary"
              onClick={() => { setIsEditing(true); setSuccessMsg(""); }}
            >
              ✏️ Editar anotação
            </button>
          </div>
        ) : (
          // Exibe o formulário (nova entrada ou edição)
          <DiaryEntryForm
            existingEntry={isEditing ? diaryEntry : null}
            episodeName={EPISODE_NAMES_PT[episode.episode] ?? episode.name}
            onSubmit={handleSubmit}
            loading={formLoading}
          />
        )}
      </section>
    </div>
  );
}
