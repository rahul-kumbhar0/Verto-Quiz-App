import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE, theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MONO = "'SF Mono', Consolas, monospace";

/* ------------------------------------------------------------------ */
/* PipelineBar — the Supabase/Vercel-style top progress strip:         */
/* stage ticks + labels + a live counter on the right.                 */
/* ------------------------------------------------------------------ */
export const PipelineBar: React.FC<{
  stages: string[];
  active: number; // index of the lit stage
  counter?: number; // live number on the right (animate from the beat)
  counterLabel?: string;
  accent?: string; // '#3ECF8E' supabase green / '#3B82F6' blue
  y?: number;
  width?: number;
}> = ({ stages, active, counter, counterLabel, accent = "#3ECF8E", y = 120, width = 960 }) => {
  const frame = useCurrentFrame();
  const inA = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: Easing.bezier(...EASE) });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: "50%",
        translate: "-50% 0",
        width,
        opacity: inA,
        fontFamily: MONO,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: accent, fontSize: 26 }}>⚡</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          {stages.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: i === active ? 14 : 9,
                    height: i === active ? 14 : 9,
                    borderRadius: "50%",
                    background: i <= active ? accent : "rgba(255,255,255,0.18)",
                    boxShadow: i === active ? `0 0 16px ${accent}` : undefined,
                  }}
                />
                <div
                  style={{
                    fontSize: 16,
                    letterSpacing: "0.08em",
                    color: i === active ? "#fff" : "rgba(255,255,255,0.35)",
                    fontWeight: i === active ? 700 : 400,
                  }}
                >
                  {s.toUpperCase()}
                </div>
              </div>
              {i < stages.length - 1 ? (
                <div style={{ flex: 1, height: 2, background: i < active ? accent : "rgba(255,255,255,0.12)", margin: "0 8px 22px" }} />
              ) : null}
            </React.Fragment>
          ))}
        </div>
        {counter !== undefined ? (
          <div style={{ textAlign: "right", marginLeft: 18, marginBottom: 18 }}>
            <div style={{ color: "#fff", fontSize: 30, fontWeight: 700 }}>
              {Math.round(counter).toLocaleString("en-US")}
            </div>
            {counterLabel ? (
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>{counterLabel}</div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* FieldArcs — glowing gold electric-field arcs (touchscreen look).    */
/* Arcs spring from a baseline, like charge lines above electrodes.    */
/* ------------------------------------------------------------------ */
export const FieldArcs: React.FC<{
  width: number;
  height?: number;
  count?: number;
  enterAt?: number;
  /** 0..1 — where along the width the arcs concentrate (e.g. finger x) */
  focus?: number;
  color?: string;
}> = ({ width, height = 160, count = 9, enterAt = 0, focus, color = theme.zoneAmberHi }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const t = (i + 0.5) / count;
        const x = t * width;
        const pull = focus !== undefined ? (focus - t) * width * 0.55 : 0;
        const h = height * (0.45 + 0.5 * Math.abs(Math.sin(i * 2.4)));
        const sway = Math.sin(frame / 9 + i * 1.7) * 6;
        const grow = interpolate(frame, [enterAt + i * 2, enterAt + i * 2 + 10], [0, 1], {
          ...clamp,
          easing: Easing.bezier(...EASE),
        });
        const flick = 0.55 + 0.45 * Math.abs(Math.sin(frame / 7 + i * 2.1));
        return (
          <path
            key={i}
            d={`M ${x - 14} ${height} Q ${x + sway + pull * 0.4} ${height - h * 2} ${x + 14 + pull} ${height}`}
            stroke={color}
            strokeWidth={3}
            fill="none"
            filter="url(#arcGlow)"
            opacity={grow * flick}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* RGBStrip — the sub-pixel strip seen under the glass cross-section.  */
/* ------------------------------------------------------------------ */
export const RGBStrip: React.FC<{ width: number; cell?: number }> = ({ width, cell = 26 }) => {
  const n = Math.floor(width / cell);
  const cols = ["#E53935", "#34C759", "#2F6BFF"];
  return (
    <div style={{ display: "flex", gap: cell * 0.25, width, overflow: "hidden" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          style={{
            width: cell * 0.75,
            height: cell,
            borderRadius: 3,
            background: cols[i % 3],
            opacity: 0.9,
            boxShadow: `0 0 8px ${cols[i % 3]}55`,
          }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CapsLabel — tiny uppercase spec label with a leader line            */
/* ("WIRES", "GLASS", "CHARGE", "BLADDER 350 PSI").                    */
/* ------------------------------------------------------------------ */
export const CapsLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  /** line drops DOWN from label to target by this many px (negative = up) */
  drop?: number;
  enterAt?: number;
  /** dark text for light-mode scenes */
  onLight?: boolean;
}> = ({ x, y, text, drop = 60, enterAt = 0, onLight = false }) => {
  const frame = useCurrentFrame();
  const inA = interpolate(frame, [enterAt, enterAt + 8], [0, 1], { ...clamp, easing: Easing.bezier(...EASE) });
  const col = onLight ? "#1A1A1C" : "#fff";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: inA, zIndex: 25, textAlign: "center", translate: "-50% 0" }}>
      <div style={{ color: col, fontSize: 22, fontWeight: 700, letterSpacing: "0.14em", whiteSpace: "nowrap" }}>
        {text.toUpperCase()}
      </div>
      <div
        style={{
          width: 1.5,
          height: Math.abs(drop) * inA,
          background: onLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)",
          margin: "6px auto 0",
          transformOrigin: "top",
          scale: drop < 0 ? "1 -1" : undefined,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* StatCard — big number + unit + source line ("120 scans a second").  */
/* ------------------------------------------------------------------ */
export const StatCard: React.FC<{
  value: string;
  label: string;
  source?: string;
  x?: number;
  y?: number;
  enterAt?: number;
}> = ({ value, label, source, x = 64, y = 1200, enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const inA = interpolate(frame, [enterAt, enterAt + 4, enterAt + 9], [0, 1.1, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <div style={{ position: "absolute", left: x, top: y, scale: String(Math.max(inA, 0.001)), opacity: inA > 0.01 ? 1 : 0, transformOrigin: "0 50%", zIndex: 25 }}>
      <span style={{ color: "#fff", fontSize: 72, fontWeight: 800, letterSpacing: "-0.02em" }}>{value}</span>
      <span style={{ color: "#fff", fontSize: 34, fontWeight: 700, marginLeft: 14 }}>{label}</span>
      {source ? <div style={{ color: theme.footnote, fontSize: 24, marginTop: 4 }}>{source}</div> : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Gauge — the Vercel speedometer (ticks, needle, live value).         */
/* ------------------------------------------------------------------ */
export const Gauge: React.FC<{
  size?: number;
  /** 0..1 needle position (animate from the beat) */
  value: number;
  display: string;
  sub?: string;
  accent?: string;
}> = ({ size = 420, value, display, sub, accent = "#3B82F6" }) => {
  const r = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const a0 = -210;
  const a1 = 30;
  const ang = a0 + (a1 - a0) * Math.min(1, Math.max(0, value));
  const ticks = 24;
  return (
    <div style={{ position: "relative", width: size, height: size * 0.72, fontFamily: MONO }}>
      <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`} style={{ overflow: "visible" }}>
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const a = ((a0 + ((a1 - a0) * i) / ticks) * Math.PI) / 180;
          const on = i / ticks <= value;
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * (r - 16)}
              y1={cy + Math.sin(a) * (r - 16)}
              x2={cx + Math.cos(a) * r}
              y2={cy + Math.sin(a) * r}
              stroke={on ? accent : "rgba(255,255,255,0.18)"}
              strokeWidth={i % 4 === 0 ? 5 : 3}
              strokeLinecap="round"
            />
          );
        })}
        <line
          x1={cx}
          y1={cy}
          x2={cx + Math.cos((ang * Math.PI) / 180) * (r - 34)}
          y2={cy + Math.sin((ang * Math.PI) / 180) * (r - 34)}
          stroke="#fff"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={12} fill="#fff" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: size * 0.46, textAlign: "center" }}>
        <div style={{ color: "#fff", fontSize: size * 0.11, fontWeight: 800 }}>{display}</div>
        {sub ? <div style={{ color: theme.footnote, fontSize: size * 0.055 }}>{sub}</div> : null}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* NodeFlow — architecture diagram: cards connected by animated wires  */
/* with traveling pulse dots (Supabase/Vercel style).                  */
/* ------------------------------------------------------------------ */
export const Wire: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  enterAt?: number;
  pulse?: boolean;
  color?: string;
}> = ({ x1, y1, x2, y2, enterAt = 0, pulse = true, color = "rgba(255,255,255,0.3)" }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [enterAt, enterAt + 12], [0, 1], { ...clamp, easing: Easing.bezier(...EASE) });
  const t = ((frame - enterAt) / 40) % 1;
  const mx = (x1 + x2) / 2;
  const px = x1 + (x2 - x1) * t;
  const py = y1 + (y2 - y1) * t;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: 5 }} width="1080" height="1920">
      <path
        d={`M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeDasharray={1200}
        strokeDashoffset={1200 * (1 - grow)}
      />
      {pulse && grow >= 1 ? (
        <circle cx={px} cy={py} r={6} fill={theme.zoneAmberHi} style={{ filter: `drop-shadow(0 0 8px ${theme.zoneGlow})` }} />
      ) : null}
    </svg>
  );
};
