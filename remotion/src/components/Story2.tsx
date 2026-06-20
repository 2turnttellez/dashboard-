import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/theme";
import { SafeArea, SafeAreaGuides } from "./SafeArea";

/**
 * STORY 2 — placeholder de estructura (ETAPA 1).
 * El diseño y las animaciones se construyen en la ETAPA 4.
 * Mejoras previstas: Apple pills con datos FIFA reales + crowd con micro-motion.
 */
export const Story2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <SafeArea
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: COLORS.inkSoft, fontSize: 40, fontFamily: "sans-serif" }}>
          Story 2 — placeholder
        </span>
      </SafeArea>
      <SafeAreaGuides show={false} />
    </AbsoluteFill>
  );
};
