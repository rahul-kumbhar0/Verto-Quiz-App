import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE, theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Thin-line annotation: a dot at the anchor, an elbow line, and a bold label.
 * Matches "what you see" / "hit region" callouts in the reference.
 */
export const Callout: React.FC<{
  x: number; // anchor (dot) position
  y: number;
  dx?: number; // elbow horizontal run (negative = left)
  dy?: number; // vertical drop before the elbow
  label: string;
  sub?: string[];
  enterAt?: number;
  fontSize?: number;
  /** absolute label offset from the anchor (overrides auto placement); label is left-aligned there */
  labelX?: number;
}> = ({ x, y, dx = -180, dy = 60, label, sub, enterAt = 0, fontSize = 34, labelX }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const fade = interpolate(frame, [enterAt + 6, enterAt + 14], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const labelLeft = dx < 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 15 }}>
      <div
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: 5,
          background: "#fff",
          translate: "-50% -50%",
          opacity: grow,
        }}
      />
      {/* vertical segment */}
      <div
        style={{
          position: "absolute",
          left: -1,
          top: 0,
          width: 2,
          height: dy * grow,
          background: "rgba(255,255,255,0.85)",
        }}
      />
      {/* horizontal segment */}
      <div
        style={{
          position: "absolute",
          top: dy - 1,
          left: labelLeft ? dx * grow : 0,
          width: Math.abs(dx) * grow,
          height: 2,
          background: "rgba(255,255,255,0.85)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: dy - fontSize * 0.72,
          left: labelX ?? (labelLeft ? dx - 20 : dx + 20),
          translate: labelX !== undefined ? "0 0" : labelLeft ? "-100% 0" : "0 0",
          whiteSpace: "nowrap",
          textAlign: labelX !== undefined ? "left" : labelLeft ? "right" : "left",
          opacity: fade,
          color: "#fff",
          fontWeight: 700,
          fontSize,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
        {sub ? (
          <div
            style={{
              fontWeight: 400,
              fontSize: fontSize * 0.72,
              color: theme.footnote,
              lineHeight: 1.4,
              marginTop: 6,
            }}
          >
            {sub.map((s, i) => (
              <div key={i}>{s}</div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Tiny gray honesty disclaimer ("Zones drawn visible. …") */
export const Footnote: React.FC<{
  lines: string[];
  x?: number;
  y?: number;
  right?: boolean;
  enterAt?: number;
}> = ({ lines, x = 64, y, right = false, enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <div
      style={{
        position: "absolute",
        [right ? "right" : "left"]: x,
        top: y,
        color: theme.footnote,
        fontSize: 26,
        lineHeight: 1.5,
        opacity: o,
        textAlign: right ? "right" : "left",
        zIndex: 15,
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ fontWeight: i === 0 ? 600 : 400 }}>
          {l}
        </div>
      ))}
    </div>
  );
};

/** Dimension line with end ticks + px label (measurement beats). */
export const Measure: React.FC<{
  x: number;
  y: number;
  length: number;
  vertical?: boolean;
  label: string;
  red?: boolean;
  enterAt?: number;
  labelSize?: number;
}> = ({ x, y, length, vertical = false, label, red = false, enterAt = 0, labelSize = 30 }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const o = interpolate(frame, [enterAt + 6, enterAt + 12], [0, 1], clamp);
  const col = red ? theme.accentRed : "#FFFFFF";
  const tick = 16;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 15 }}>
      <div
        style={{
          position: "absolute",
          width: vertical ? 2 : length * grow,
          height: vertical ? length * grow : 2,
          background: col,
          left: vertical ? -1 : 0,
          top: vertical ? 0 : -1,
        }}
      />
      {/* end ticks */}
      {[0, 1].map((e) => (
        <div
          key={e}
          style={{
            position: "absolute",
            width: vertical ? tick : 2,
            height: vertical ? 2 : tick,
            background: col,
            opacity: grow,
            left: vertical ? -tick / 2 : e * length - 1,
            top: vertical ? e * length - 1 : -tick / 2,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: vertical ? 14 : length / 2,
          top: vertical ? length / 2 : -14,
          translate: vertical ? "0 -50%" : "-50% -100%",
          color: col,
          fontWeight: 700,
          fontSize: labelSize,
          whiteSpace: "nowrap",
          opacity: o,
        }}
      >
        {label}
      </div>
    </div>
  );
};
