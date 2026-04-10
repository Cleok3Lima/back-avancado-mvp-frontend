import { useState } from "react";

export default function StarRating({ value = 0, onChange, readOnly = false, size = 24 }) {
  const [hovered, setHovered] = useState(0);

  const activeColor = "#f5c518";
  const inactiveColor = "#444";

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
