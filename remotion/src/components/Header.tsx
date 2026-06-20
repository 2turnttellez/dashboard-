import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../lib/theme";
import { FONTS } from "../lib/fonts";
import { SpeakLogo } from "./SpeakLogo";

/**
 * Header del sistema visual — SIN barra de progreso ni indicadores 1/3.
 * Solo: lockup Speak ESG Podcast (izquierda) + "MUNDIAL 2026" (derecha).
 * `enter` (0..1) anima la entrada (fade + slide corto).
 */
export const Header: React.FC<{ enter?: number }> = ({ enter = 1 }) => {
  const opacity = enter;
  const translateY = interpolate(enter, [0, 1], [-18, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <SpeakLogo variant="lockup" height={34} />
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 22,
          letterSpacing: "0.22em",
          color: COLORS.inkSoft,
          fontWeight: 400,
        }}
      >
        MUNDIAL 2026
      </span>
    </div>
  );
};
