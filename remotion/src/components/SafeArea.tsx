import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../lib/theme";

/**
 * Contenedor que respeta las safe areas de Instagram Story.
 * Coloca su contenido dentro de los márgenes seguros (top/bottom/side).
 */
export const SafeArea: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
        paddingLeft: SAFE.side,
        paddingRight: SAFE.side,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Overlay visual de debug para ver las safe areas durante el diseño.
 * Activar con la prop `show` en el componente de cada story (no se renderiza
 * en el export final).
 */
export const SafeAreaGuides: React.FC<{ show?: boolean }> = ({ show }) => {
  if (!show) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9999 }}>
      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          border: "2px dashed rgba(224,122,63,0.8)",
        }}
      />
    </AbsoluteFill>
  );
};
