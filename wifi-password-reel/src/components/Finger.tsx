import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../theme";

/**
 * Giant photoreal-ish finger cursor (SVG with soft gradients).
 * Slides in from a corner, hovers with drift, taps at `tapAt`.
 * Tip of the finger = the (x, y) anchor point.
 */
export const Finger: React.FC<{
  x: number;
  y: number;
  width?: number;
  enterAt?: number;
  tapAt?: number; // frame of contact
  fromCorner?: "bottom-right" | "bottom-left";
  rotate?: number;
}> = ({
  x,
  y,
  width = 420,
  enterAt = 0,
  tapAt,
  fromCorner = "bottom-right",
  rotate = -12,
}) => {
  const frame = useCurrentFrame();
  const dirX = fromCorner === "bottom-right" ? 1 : -1;

  const slide = interpolate(frame, [enterAt, enterAt + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });

  const driftX = Math.sin(frame / 25) * 3;
  const driftY = Math.cos(frame / 31) * 3;

  let tap = 0;
  if (tapAt !== undefined) {
    tap = interpolate(frame, [tapAt - 6, tapAt, tapAt + 8], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    });
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `${slide * 420 * dirX + driftX}px ${slide * 560 + driftY + tap * -16}px`,
        rotate: `${rotate * dirX}deg`,
        zIndex: 30,
        pointerEvents: "none",
        filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.65))",
      }}
    >
      <svg viewBox="0 0 200 420" width={width * (200 / 420)} style={{ translate: "-38% -4%" }}>
        <defs>
          <linearGradient id="fskin" x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0" stopColor="#E8B48E" />
            <stop offset="0.45" stopColor="#F7CFAE" />
            <stop offset="1" stopColor="#E3A97F" />
          </linearGradient>
          <linearGradient id="fnail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6DCC8" />
            <stop offset="1" stopColor="#EFC9AC" />
          </linearGradient>
        </defs>
        {/* finger body, tip at top center */}
        <path
          d="M100 8 Q150 10 156 80 L162 420 L38 420 L44 80 Q50 10 100 8 Z"
          fill="url(#fskin)"
        />
        {/* nail */}
        <path
          d="M100 26 Q134 28 136 78 Q136 120 100 124 Q64 120 64 78 Q66 28 100 26 Z"
          fill="url(#fnail)"
          stroke="rgba(160,110,70,0.35)"
          strokeWidth={2}
        />
        {/* knuckle creases */}
        <path d="M52 200 Q100 212 148 200" stroke="rgba(150,95,55,0.25)" strokeWidth={5} fill="none" />
        <path d="M50 290 Q100 304 150 290" stroke="rgba(150,95,55,0.22)" strokeWidth={5} fill="none" />
        {/* side shading */}
        <path d="M44 80 L38 420 L62 420 L64 90 Q58 40 72 22 Q50 30 44 80 Z" fill="rgba(140,85,45,0.18)" />
      </svg>
    </div>
  );
};
