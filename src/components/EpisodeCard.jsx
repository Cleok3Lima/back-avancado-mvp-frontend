// components/EpisodeCard.jsx
// Card exibido na página inicial para cada episódio

import { Link } from "react-router-dom";

/**
 * @param {object} episode - Objeto do episódio vindo da API
 *   { id, name, episode, air_date }
 */
export default function EpisodeCard({ episode }) {
  // O campo "episode" da API vem no formato "S01E01"
  const season = episode.episode ? episode.episode.slice(1, 3) : "?";
  const epNumber = episode.episode ? episode.episode.slice(4) : "?";

  return (
    <div className="episode-card">
      <div className="episode-card__badges">
        <span className="badge badge--season">Temporada {parseInt(season)}</span>
        <span className="badge badge--ep">Ep. {parseInt(epNumber)}</span>
      </div>

      <h3 className="episode-card__title">{episode.name}</h3>

      <p className="episode-card__date">
        📅 {episode.air_date}
      </p>

      <Link to={`/episodio/${episode.id}`} className="btn btn--primary">
        Ver detalhes →
      </Link>
    </div>
  );
}
