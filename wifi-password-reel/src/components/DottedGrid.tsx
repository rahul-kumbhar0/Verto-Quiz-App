import React from "react";
import { AbsoluteFill } from "remotion";
import { light, theme } from "../theme";

/**
 * The canvas: near-black dotted grid by default; mode="light" gives the
 * warm paper-white scenes the reference reels alternate into for rhythm.
 */
export const DottedGrid: React.FC<{
  children?: React.ReactNode;
  mode?: "dark" | "light";
}> = ({ children, mode = "dark" }) => {
  const isLight = mode === "light";
  return (
    <AbsoluteFill
      style={{
        backgroundColor: isLight ? light.bg : theme.bg,
        backgroundImage: `radial-gradient(${isLight ? light.gridDot : theme.gridDot} 1.5px, transparent 1.5px)`,
        backgroundSize: "64px 64px",
        backgroundPosition: "32px 32px",
        fontFamily: theme.font,
      }}
    >
      {/* soft vignette */}
      <AbsoluteFill
        style={{
          background: isLight
            ? "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 65%, rgba(0,0,0,0.08) 100%)"
            : "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 60%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
