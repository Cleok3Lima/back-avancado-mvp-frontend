import { useState } from "react";
import StarRating from "./StarRating";

export default function DiaryEntryForm({ existingEntry, episodeName, onSubmit, loading }) {
  const [nota, setNota] = useState(existingEntry?.nota || "");
  const [avaliacao, setAvaliacao] = useState(existingEntry?.avaliacao || 0);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nota.trim()) {
      setError("Escreva sua nota antes de salvar.");
      return;
    }
    if (avaliacao === 0) {
      setError("Selecione uma avaliação de 1 a 5 estrelas.");
      return;
    }

    setError("");
    onSubmit({ nota: nota.trim(), avaliacao });
  };

  return (
    <form className="diary-form" onSubmit={handleSubmit}>
      <h3 className="diary-form__title">
        {existingEntry ? "✏️ Editar anotação" : "📝 Adicionar ao diário"}
      </h3>

      {episodeName && (
        <p className="diary-form__episode-name">Episódio: <strong>{episodeName}</strong></p>
      )}

      <div className="diary-form__field">
        <label htmlFor="nota">Minha anotação</label>
        <textarea
          id="nota"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Escreva o que você achou deste episódio..."
          rows={4}
          maxLength={1000}
        />
        <span className="diary-form__char-count">{nota.length}/1000</span>
      </div>

      <div className="diary-form__field">
        <label>Minha avaliação</label>
        <StarRating value={avaliacao} onChange={setAvaliacao} size={32} />
      </div>

      {error && <p className="diary-form__error">{error}</p>}

      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Salvando..." : existingEntry ? "Salvar alterações" : "Adicionar ao diário"}
      </button>
    </form>
  );
}
