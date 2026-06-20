import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/theme";
import { SafeArea, SafeAreaGuides } from "./SafeArea";

/**
 * STORY 1 — placeholder de estructura (ETAPA 1).
 * El diseño y las animaciones se construyen en la ETAPA 3.
 * Copy a conservar:
 *   "Hoy hay fútbol."
 *   "Pero también hay algo más en juego."
 */
export const Story1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <SafeArea
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: COLORS.inkSoft, fontSize: 40, fontFamily: "sans-serif" }}>
          Story 1 — placeholder
        </span>
      </SafeArea>
      <SafeAreaGuides show={false} />
    </AbsoluteFill>
  );
};
