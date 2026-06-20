/**
 * Tokens de diseño — Speak ESG Stories.
 * Paleta calibrada a partir de las bases aprobadas (story-*-base.jpg) y del
 * logo del podcast.
 */

export const COLORS = {
  // Fondo crema editorial.
  cream: "#F0E9DB",
  creamCard: "#F7F2E8", // superficie de tarjetas (ticket), un punto más clara
  creamNotch: "#F0E9DB",

  // Azul Speak ESG (color principal).
  blue: "#2742DD",
  blueLogo: "#2F4EE8", // azul del wordmark del logo (un punto más brillante)
  blueDeep: "#1B2FA8",

  // Acento naranja sutil (solo si aporta — viene del logo).
  orange: "#E8842A",

  // Tinta / texto.
  ink: "#1A1813",
  inkSoft: "#7C786E", // gris cálido para labels mono
  inkBody: "#3A372F",

  white: "#FFFFFF",
} as const;

export const FPS = 30;

export const VIDEO = {
  width: 1080,
  height: 1920,
} as const;

/**
 * Safe areas de Instagram Story (px sobre 1080x1920).
 * El contenido crítico — incluido el header — vive DENTRO de estos márgenes.
 * top: zona del avatar/usuario IG. bottom: zona de respuesta/link/stickers.
 */
export const SAFE = {
  top: 250,
  bottom: 320,
  side: 80,
} as const;

export const DURATION = {
  story: 6, // segundos
} as const;
