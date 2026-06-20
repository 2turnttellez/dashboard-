/**
 * Tokens de diseño — Speak ESG Stories.
 *
 * NOTA: Los valores de color son provisionales. Se calibrarán con las
 * referencias reales (story-*-base.jpg, logo-speak-esg.png) en la ETAPA 2 —
 * Análisis visual. No tomar estos hex como definitivos todavía.
 */

export const COLORS = {
  // Fondo crema editorial.
  cream: "#F3EDE1",
  creamDeep: "#EAE1D0",

  // Azul Speak ESG (color principal) — provisional, se ajusta con refs.
  blue: "#1B3A6B",
  blueDeep: "#122A4D",
  blueSoft: "#2E5A9E",

  // Acento naranja sutil (solo si aporta).
  orange: "#E07A3F",

  // Tinta / texto.
  ink: "#1A1A1A",
  inkSoft: "#4A4A4A",
} as const;

export const FPS = 30;

export const VIDEO = {
  width: 1080,
  height: 1920,
} as const;

/**
 * Safe areas de Instagram Story (en px, sobre 1080x1920).
 * - top: zona del avatar/usuario.
 * - bottom: zona de respuesta / link / stickers.
 * - side: márgenes laterales para no cortar texto.
 * Todo el contenido crítico debe vivir dentro de estos márgenes.
 */
export const SAFE = {
  top: 250,
  bottom: 320,
  side: 80,
} as const;

export const DURATION = {
  // Duración por story en segundos (provisional).
  story: 6,
} as const;
