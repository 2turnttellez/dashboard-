import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../lib/theme";
import { FONTS } from "../lib/fonts";

export const Ticket: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide-up + settle elástico.
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 110 },
    durationInFrames: 45,
  });
  const translateY = interpolate(enter, [0, 1], [260, 0]);
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Micro-motion EN JUEGO + colon.
  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * 1.1);
  const colonOn = Math.sin((frame / fps) * Math.PI * 2) > -0.3 ? 1 : 0.2;

  const notch = (side: "left" | "right") => (
    <div
      style={{
        position: "absolute",
        top: "50%",
        [side]: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.cream,
        transform: "translateY(-50%)",
      }}
    />
  );

  return (
    <div
      style={{
        position: "relative",
        transform: `translateY(${translateY}px)`,
        opacity,
        borderRadius: 32,
        backgroundColor: COLORS.creamCard,
        boxShadow: [
          "0 32px 72px rgba(26,24,19,0.14)",
          "0 8px 20px rgba(26,24,19,0.07)",
          "0 2px 0 rgba(255,255,255,0.72) inset",
        ].join(", "),
        border: "1px solid rgba(26,24,19,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Stripe azul (identidad del pase) */}
      <div style={{ height: 10, backgroundColor: COLORS.blue, width: "100%" }} />

      <div style={{ padding: "44px 48px 48px" }}>
        {/* Fila mono superior */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: FONTS.mono,
            fontSize: 19,
            letterSpacing: "0.12em",
            color: COLORS.inkSoft,
          }}
        >
          <span>MATCHDAY · MEX 2026</span>
          <span>ACCESO GENERAL</span>
        </div>

        {/* Divisor perforado */}
        <div
          style={{
            marginTop: 24,
            marginBottom: 28,
            borderTop: "2px dashed rgba(26,24,19,0.14)",
          }}
        />

        {/* Fila principal: sede + tiempo */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Columna izquierda */}
          <div>
            <div
              style={{
                fontFamily: FONTS.serif,
                fontSize: 58,
                fontWeight: 700,
                color: COLORS.ink,
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
              }}
            >
              MEX · Sede 01
            </div>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONTS.mono,
                fontSize: 20,
                letterSpacing: "0.1em",
                color: COLORS.blue,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: COLORS.blue,
                  opacity: pulse,
                  boxShadow: `0 0 ${12 * pulse}px ${COLORS.blue}88`,
                  flexShrink: 0,
                }}
              />
              EN JUEGO
            </div>
          </div>

          {/* Columna derecha: tiempo */}
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 72,
              fontWeight: 700,
              color: COLORS.blue,
              letterSpacing: "0.01em",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            90<span style={{ opacity: colonOn }}>:</span>00
          </div>
        </div>
      </div>

      {notch("left")}
      {notch("right")}
    </div>
  );
};
