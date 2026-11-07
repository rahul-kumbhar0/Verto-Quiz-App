import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * The signature "what you see / what you touch" exhibit:
 * two layers in a 3D-tilted stack that separate vertically,
 * with thin connector lines raining between them.
 */
export const ExplodedLayers: React.FC<{
  top: React.ReactNode;
  bottom: React.ReactNode;
  width: number;
  /** frame at which the explode starts */
  explodeAt?: number;
  gap?: number; // final separation px
  tiltX?: number;
  connectors?: number; // how many vertical lines
  connectorsAt?: number;
}> = ({
  top,
  bottom,
  width,
  explodeAt = 0,
  gap = 240,
  tiltX = 42,
  connectors = 0,
  connectorsAt,
}) => {
  const frame = useCurrentFrame();
  const sep = interpolate(frame, [explodeAt, explodeAt + 20], [0, gap], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const bob = Math.sin(frame / 22) * 4;
  const sway = Math.sin(frame / 35) * 1.5;
  const cAt = connectorsAt ?? explodeAt + 8;
  const cGrow = interpolate(frame, [cAt, cAt + 12], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });

  return (
    <div
      style={{
        perspective: 1400,
        width,
        translate: `0px ${bob}px`,
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          rotate: "-2deg",
          transform: `rotateX(${tiltX + sway}deg)`,
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>{top}</div>
        {/* connectors */}
        {connectors > 0 ? (
          <div
            style={{
              position: "relative",
              height: sep,
              zIndex: 1,
            }}
          >
            {Array.from({ length: connectors }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${((i + 0.5) / connectors) * 100}%`,
                  top: 0,
                  width: 1.5,
                  height: `${cGrow * 100}%`,
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.12))",
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ height: sep }} />
        )}
        <div style={{ position: "relative", zIndex: 2 }}>{bottom}</div>
      </div>
    </div>
  );
};

/** Simple floating 3D-tilted panel for single-layer exhibits. */
export const FloatingPanel: React.FC<{
  children: React.ReactNode;
  width: number;
  tiltX?: number;
  enterAt?: number;
}> = ({ children, width, tiltX = 30, enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 22) * 4;
  const sway = Math.sin(frame / 35) * 1.5;
  const inAnim = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <div
      style={{
        perspective: 1400,
        width,
        opacity: inAnim,
        translate: `0px ${bob + (1 - inAnim) * 24}px`,
        scale: String(0.96 + inAnim * 0.04),
      }}
    >
      <div style={{ transform: `rotateX(${tiltX + sway}deg)` }}>{children}</div>
    </div>
  );
};
