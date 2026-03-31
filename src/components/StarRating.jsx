// components/StarRating.jsx
// Componente de avaliação por estrelas — pode ser interativo (input) ou somente leitura

import { useState } from "react";

/**
 * @param {number} value - Valor atual (1-5)
 * @param {function} onChange - Callback chamado ao clicar em uma estrela (apenas modo interativo)
 * @param {boolean} readOnly - Se true, desativa a interação
 * @param {number} size - Tamanho da estrela em px (padrão: 24)
 */
export default function StarRating({ value = 0, onChange, readOnly = false, size = 24 }) {
  // Hover state para feedback visual durante navegação com mouse
  const [hovered, setHovered] = useState(0);

  const activeColor = "#f5c518"; // Amarelo ouro
  const inactiveColor = "#444";  // Cinza escuro

  return (
    <div style={{ display: "flex", gap: "4px", cursor: readOnly ? "default" : "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readOnly ? star <= value : star <= (hovered || value);
        return (
          <span
            key={star}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => !readOnly && onChange && onChange(star)}
            title={readOnly ? `${value} estrela(s)` : `Avaliar com ${star} estrela(s)`}
            style={{
              fontSize: `${size}px`,
              color: filled ? activeColor : inactiveColor,
              transition: "color 0.15s",
              userSelect: "none",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
