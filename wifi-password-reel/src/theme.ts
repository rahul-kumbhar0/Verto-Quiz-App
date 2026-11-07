export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const theme = {
  bg: "#0C0C0C",
  gridDot: "rgba(255,255,255,0.045)",
  captionMuted: "#8E8E93",
  captionBright: "#FFFFFF",
  selectBlue: "#3B82F6",
  keyGray: "#6B6B6F",
  keyDark: "#3A3A3C",
  keyText: "#FFFFFF",
  kbBg: "#2B2B2D",
  zoneAmber: "#E8A33D",
  zoneAmberHi: "#F5C563",
  zoneGlow: "rgba(232,163,61,0.55)",
  footnote: "#6E6E73",
  accentRed: "#E53935",
  sendBlue: "#0A84FF",
  bubbleIn: "#26262A",
  panel: "#1A1A1C",
  font: "Inter, 'SF Pro Display', -apple-system, sans-serif",
} as const;

// Light-mode scene palette (battery/architecture reels alternate dark ↔ light beats)
export const light = {
  bg: "#F1EFEA",
  gridDot: "rgba(0,0,0,0.05)",
  captionMuted: "#8A8A8E",
  captionBright: "#1A1A1C",
  panel: "#FFFFFF",
  footnote: "#9A9A9E",
} as const;

// Standard easing used everywhere (punchy ease-out)
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
