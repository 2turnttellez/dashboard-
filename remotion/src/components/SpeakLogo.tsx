import React from "react";
import { Img } from "remotion";
import { COLORS } from "../lib/theme";
import { FONTS } from "../lib/fonts";
import logoSrc from "../assets/logo-speak-esg.png";

/**
 * Lockup del logo Speak ESG Podcast para el header (arriba-izquierda).
 *
 * variant:
 *  - "lockup" (default): recreación nítida en texto, fiel a los colores del
 *     logo (SPEAK azul · pill naranja PODCAST · ESG azul). Garantiza que NO
 *     aparezca el recuadro gris del JPEG y se ve crisp a tamaño pequeño.
 *  - "image": usa el archivo real con mix-blend-mode: multiply para fundir el
 *     fondo claro en la crema. Disponible para verificar una vez habilitados
 *     los renders; puede dejar un recuadro tenue por no ser fondo blanco puro.
 */
export const SpeakLogo: React.FC<{
  variant?: "lockup" | "image";
  height?: number;
}> = ({ variant = "lockup", height = 34 }) => {
  if (variant === "image") {
    return (
      <Img
        src={logoSrc}
        style={{
          height: height * 2.6,
          width: "auto",
          mixBlendMode: "multiply",
        }}
      />
    );
  }

  const fontSize = height;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: fontSize * 0.34,
        fontFamily: FONTS.sans,
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 800,
          fontStyle: "italic",
          letterSpacing: "-0.01em",
          color: COLORS.blueLogo,
          lineHeight: 1,
        }}
      >
        SPEAK
      </span>
      <span
        style={{
          fontSize: fontSize * 0.42,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: COLORS.white,
          backgroundColor: COLORS.orange,
          padding: `${fontSize * 0.12}px ${fontSize * 0.28}px`,
          borderRadius: fontSize * 0.28,
          lineHeight: 1,
        }}
      >
        PODCAST
      </span>
      <span
        style={{
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          color: COLORS.blueLogo,
          lineHeight: 1,
        }}
      >
        ESG
      </span>
    </div>
  );
};
