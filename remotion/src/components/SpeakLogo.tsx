import React from "react";
import { Img } from "remotion";
import { staticFile } from "remotion";

/**
 * Logo oficial Speak ESG Podcast.
 *
 * REGLA: no se modifica, no se recrea, no se reinterpreta.
 * Solo se usa el archivo original logo-speak-esg.png.
 *
 * Estado actual del archivo: el PNG tiene fondo blanco/gris claro (no transparente).
 * Sobre el fondo crema (#F0E9DB) se ve un recuadro visible.
 *
 * blendMode:
 *  - "multiply" (default): mix-blend-mode multiply para integrar el fondo
 *    blanco del PNG con el fondo crema. Workaround visual, no perfecto.
 *  - "none": sin blend, muestra el recuadro gris (útil para debug).
 *
 * Para el render final se necesita el PNG con canal alpha (fondo transparente).
 */
export const SpeakLogo: React.FC<{
  height?: number;
  blendMode?: "multiply" | "none";
}> = ({ height = 90, blendMode = "multiply" }) => {
  return (
    <Img
      src={staticFile("logo-speak-esg.png")}
      style={{
        height,
        width: "auto",
        display: "block",
        mixBlendMode: blendMode === "multiply" ? "multiply" : "normal",
      }}
    />
  );
};
