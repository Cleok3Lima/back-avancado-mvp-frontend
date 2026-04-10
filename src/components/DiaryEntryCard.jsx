import { useState } from "react";
import StarRating from "./StarRating";
import DiaryEntryForm from "./DiaryEntryForm";

export default function DiaryEntryCard({ entry, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = async (data) => {
    setLoading(true);
    await onUpdate(entry.id, data);
    setLoading(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await onDelete(entry.id);
    setLoading(false);
    setShowConfirm(false);
  };

  const formattedDate = new Date(entry.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="diary-card">
      <div className="diary-card__header">
        <div>
          <h3 className="diary-card__title">{entry.episode_name}</h3>
          <p className="diary-card__date">Anotado em {formattedDate}</p>
        </div>
        <StarRating value={entry.avaliacao} readOnly size={20} />
      </div>

      {!isEditing ? (
        <>
          <p className="diary-card__nota">{entry.nota}</p>

          <div className="diary-card__actions">
            <button
              className="btn btn--secondary"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Editar
            </button>
            <button
              className="btn btn--danger"
              onClick={() => setShowConfirm(true)}
            >
              🗑️ Deletar
            </button>
          </div>

          {showConfirm && (
            <div className="confirm-overlay">
              <div className="confirm-box">
                <p>Tem certeza que deseja deletar esta entrada?</p>
                <div className="confirm-box__actions">
                  <button
                    className="btn btn--danger"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? "Deletando..." : "Sim, deletar"}
                  </button>
                  <button
                    className="btn btn--secondary"
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <DiaryEntryForm
            existingEntry={entry}
            onSubmit={handleUpdate}
            loading={loading}
          />
          <button
            className="btn btn--secondary"
            onClick={() => setIsEditing(false)}
            style={{ marginTop: "8px" }}
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  );
}
