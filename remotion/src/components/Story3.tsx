import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/theme";
import { SafeArea, SafeAreaGuides } from "./SafeArea";

/**
 * STORY 3 — placeholder de estructura (ETAPA 1).
 * El diseño y las animaciones se construyen en la ETAPA 5.
 * Copy a conservar:
 *   "El legado no se mide solo en goles."
 *   "Se mide en lo que queda en la ciudad."
 */
export const Story3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <SafeArea
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: COLORS.inkSoft, fontSize: 40, fontFamily: "sans-serif" }}>
          Story 3 — placeholder
        </span>
      </SafeArea>
      <SafeAreaGuides show={false} />
    </AbsoluteFill>
  );
};
