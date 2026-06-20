import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceMono } from "@remotion/google-fonts/SpaceMono";

// Serif display editorial (alto contraste, retro-moderno) — titulares.
const fraunces = loadFraunces();
// Sans limpio — cuerpo y lockup.
const inter = loadInter();
// Mono — micro-labels (DÍA DE PARTIDO, MUNDIAL 2026, datos del ticket).
const spaceMono = loadSpaceMono();

export const FONTS = {
  serif: fraunces.fontFamily,
  sans: inter.fontFamily,
  mono: spaceMono.fontFamily,
} as const;
