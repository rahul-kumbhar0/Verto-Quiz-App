import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE, theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Flat dark WiFi router with antennas + status LEDs. */
export const RouterIcon: React.FC<{
  width?: number;
  ledBlink?: boolean;
  enterAt?: number;
}> = ({ width = 320, ledBlink = true, enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const inA = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const blink = ledBlink ? (Math.floor(frame / 12) % 2 === 0 ? 1 : 0.35) : 1;
  return (
    <svg
      viewBox="0 0 320 190"
      width={width}
      style={{
        opacity: inA,
        translate: `0px ${(1 - inA) * 20}px`,
        display: "block",
      }}
    >
      {/* antennas */}
      <rect x={52} y={10} width={14} height={92} rx={7} fill="#3A3A3C" transform="rotate(-14 59 102)" />
      <rect x={254} y={10} width={14} height={92} rx={7} fill="#3A3A3C" transform="rotate(14 261 102)" />
      <circle cx={46} cy={16} r={9} fill="#4A4A4E" />
      <circle cx={274} cy={16} r={9} fill="#4A4A4E" />
      {/* body */}
      <rect x={16} y={96} width={288} height={78} rx={22} fill="#232325" stroke="#3C3C40" strokeWidth={3} />
      <rect x={16} y={96} width={288} height={30} rx={16} fill="rgba(255,255,255,0.04)" />
      {/* LEDs */}
      <circle cx={58} cy={138} r={7} fill="#34C759" opacity={blink} />
      <circle cx={88} cy={138} r={7} fill={theme.zoneAmberHi} opacity={ledBlink ? 1.35 - blink : 1} />
      <circle cx={118} cy={138} r={7} fill="#3A3A3C" />
      {/* vents */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={200 + i * 22} y={130} width={12} height={16} rx={4} fill="#2F2F31" />
      ))}
    </svg>
  );
};

/** Minimal flat phone (front view, dark) with a tiny screen slot. */
export const PhoneIcon: React.FC<{
  width?: number;
  enterAt?: number;
  children?: React.ReactNode;
}> = ({ width = 180, enterAt = 0, children }) => {
  const frame = useCurrentFrame();
  const inA = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const h = width * 2;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.18,
        background: "#1C1C1E",
        border: "3px solid #3C3C40",
        opacity: inA,
        translate: `0px ${(1 - inA) * 20}px`,
        position: "relative",
        boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          translate: "-50% 0",
          width: width * 0.28,
          height: width * 0.07,
          borderRadius: width * 0.04,
          background: "#0A0A0A",
          zIndex: 3,
        }}
      />
      <div style={{ position: "absolute", inset: 6, borderRadius: width * 0.13, background: "#0A0A0C", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

/** Amber radio-wave arcs radiating from a point (the invisible made visible). */
export const WaveArcs: React.FC<{
  x: number;
  y: number;
  count?: number;
  size?: number;
  enterAt?: number;
  flip?: boolean;
}> = ({ x, y, count = 3, size = 56, enterAt = 0, flip = false }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        rotate: flip ? "180deg" : "0deg",
        zIndex: 8,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const on = frame >= enterAt + i * 6;
        const pulse = 0.35 + 0.65 * Math.max(0, Math.sin(((frame - enterAt) / 14 - i * 0.9)));
        const r = size * (i + 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: r * 2,
              height: r * 2,
              left: -r,
              top: -r,
              borderRadius: "50%",
              border: `4px solid ${theme.zoneAmberHi}`,
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              rotate: "-45deg",
              opacity: on ? pulse * 0.9 : 0,
              filter: `drop-shadow(0 0 10px ${theme.zoneGlow})`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Rounded mono "data chip" (hex keys, nonces, MICs). */
export const Chip: React.FC<{
  text: string;
  amber?: boolean;
  red?: boolean;
  green?: boolean;
  fontSize?: number;
  enterAt?: number;
  style?: React.CSSProperties;
}> = ({ text, amber, red, green, fontSize = 30, enterAt = 0, style }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [enterAt, enterAt + 4, enterAt + 8], [0, 1.06, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const border = amber
    ? theme.zoneAmberHi
    : red
      ? theme.accentRed
      : green
        ? "#34C759"
        : "rgba(255,255,255,0.25)";
  const bg = amber
    ? "rgba(232,163,61,0.16)"
    : red
      ? "rgba(229,57,53,0.14)"
      : green
        ? "rgba(52,199,89,0.14)"
        : "rgba(255,255,255,0.05)";
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: "'SF Mono', Consolas, monospace",
        fontSize,
        color: amber ? theme.zoneAmberHi : green ? "#6CE08B" : red ? "#FF6B6B" : "#E8E8EA",
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 14,
        padding: `${fontSize * 0.32}px ${fontSize * 0.55}px`,
        scale: String(s),
        opacity: s > 0.01 ? 1 : 0,
        boxShadow: amber ? `0 0 26px ${theme.zoneGlow}` : undefined,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Dark rounded terminal/data panel (frequency-table look from the reference). */
export const DataPanel: React.FC<{
  width: number;
  title?: string;
  children: React.ReactNode;
  enterAt?: number;
  style?: React.CSSProperties;
}> = ({ width, title, children, enterAt = 0, style }) => {
  const frame = useCurrentFrame();
  const inA = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <div
      style={{
        width,
        background: theme.panel,
        border: "1.5px solid rgba(255,255,255,0.09)",
        borderRadius: 28,
        padding: "28px 34px",
        opacity: inA,
        translate: `0px ${(1 - inA) * 18}px`,
        fontFamily: "'SF Mono', Consolas, monospace",
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            color: theme.footnote,
            fontSize: 26,
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ display: "flex", gap: 8 }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.85 }} />
            ))}
          </span>
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
};
