import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SAFE } from "../lib/theme";
import { FONTS } from "../lib/fonts";
import { Header } from "./Header";
import { Ticket } from "./Ticket";

// ─── helpers ────────────────────────────────────────────────────────────────

const useEnter = (delay: number, config = { damping: 22, stiffness: 160, mass: 0.7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config, durationInFrames: 30 });
};

const FadeUp: React.FC<{
  delay: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, distance = 36, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 180, mass: 0.6 },
    durationInFrames: 28,
  });
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 0.01], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── Story 1 ────────────────────────────────────────────────────────────────

export const Story1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Punto azul al final de "fútbol." — aparece con ligero delay dramático.
  const dotScale = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
    durationInFrames: 20,
  });

  // Header: entrada rápida desde arriba.
  const headerProgress = spring({
    frame: frame - 2,
    fps,
    config: { damping: 26, stiffness: 200, mass: 0.6 },
    durationInFrames: 22,
  });
  const headerY = interpolate(headerProgress, [0, 1], [-20, 0]);
  const headerOp = interpolate(headerProgress, [0, 0.01], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Ticket entra tarde, deja que el texto respire primero.
  const TICKET_DELAY = 28;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      {/* ── Header (sin barra de progreso) ── */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          opacity: headerOp,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <Header enter={1} />
      </div>

      {/* ── Zona de texto editorial ── */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 90,
          left: SAFE.side,
          right: SAFE.side,
        }}
      >
        {/* Label micro / eyebrow */}
        <FadeUp delay={5}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 24,
              letterSpacing: "0.22em",
              color: COLORS.blue,
              marginBottom: 32,
              fontWeight: 400,
            }}
          >
            DÍA DE PARTIDO
          </div>
        </FadeUp>

        {/* Titular línea 1: "Hoy hay" */}
        <FadeUp delay={9} distance={50}>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 152,
              fontWeight: 700,
              color: COLORS.ink,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            Hoy hay
          </div>
        </FadeUp>

        {/* Titular línea 2: "fútbol." + punto azul animado */}
        <FadeUp delay={14} distance={50}>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 152,
              fontWeight: 700,
              color: COLORS.ink,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              display: "flex",
              alignItems: "baseline",
              gap: 0,
            }}
          >
            <span>fútbol</span>
            <span
              style={{
                color: COLORS.blue,
                transform: `scale(${dotScale})`,
                display: "inline-block",
                transformOrigin: "bottom center",
              }}
            >
              .
            </span>
          </div>
        </FadeUp>

        {/* Subtítulo */}
        <FadeUp delay={22} distance={28}>
          <div
            style={{
              marginTop: 52,
              fontFamily: FONTS.sans,
              fontSize: 38,
              color: COLORS.inkBody,
              lineHeight: 1.45,
              fontWeight: 400,
            }}
          >
            Pero también hay{" "}
            <strong style={{ fontWeight: 700 }}>algo más en juego.</strong>
          </div>
        </FadeUp>
      </div>

      {/* ── Ticket Apple Wallet ── */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 20,
          left: SAFE.side,
          right: SAFE.side,
        }}
      >
        <Ticket delay={TICKET_DELAY} />
      </div>
    </AbsoluteFill>
  );
};
