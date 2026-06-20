import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../lib/theme";
import { FONTS } from "../lib/fonts";

/**
 * Pase digital tipo Apple Wallet (Story 1).
 * Entrada: slide-up desde abajo + settle elástico (spring).
 * El punto "EN JUEGO" late en loop sutil; el ":" del 90:00 parpadea suave.
 */
export const Ticket: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide-up + settle.
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 110 },
    durationInFrames: 45,
  });
  const translateY = interpolate(enter, [0, 1], [240, 0]);
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Micro-motion del estado en vivo.
  const pulse = 0.55 + 0.45 * Math.sin((frame / fps) * Math.PI * 2 * 1.1);
  const colonOn = Math.sin((frame / fps) * Math.PI * 2) > -0.3 ? 1 : 0.25;

  const notch = (side: "left" | "right") => (
    <div
      style={{
        position: "absolute",
        top: "50%",
        [side]: -18,
        width: 36,
        height: 36,
        borderRadius: 18,
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
        borderRadius: 30,
        backgroundColor: COLORS.creamCard,
        boxShadow:
          "0 24px 60px rgba(26,24,19,0.16), 0 2px 0 rgba(255,255,255,0.6) inset",
        border: `1px solid rgba(26,24,19,0.08)`,
        overflow: "hidden",
      }}
    >
      {/* Franja superior de color (acento pase digital) */}
      <div style={{ height: 8, backgroundColor: COLORS.blue, width: "100%" }} />

      <div style={{ padding: "34px 40px 38px" }}>
        {/* Cabecera mono */}
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
            marginTop: 22,
            marginBottom: 26,
            borderTop: `2px dashed rgba(26,24,19,0.18)`,
          }}
        />

        {/* Fila principal */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONTS.serif,
                fontSize: 56,
                fontWeight: 600,
                color: COLORS.ink,
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
              }}
            >
              MEX · Sede 01
            </div>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONTS.mono,
                fontSize: 19,
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
                  boxShadow: `0 0 ${10 * pulse}px ${COLORS.blue}`,
                }}
              />
              EN JUEGO
            </div>
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.blue,
              letterSpacing: "0.02em",
              lineHeight: 1,
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
