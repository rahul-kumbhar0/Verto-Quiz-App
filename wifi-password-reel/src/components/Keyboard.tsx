import React from "react";
import { theme } from "../theme";

export type KeyRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  special?: boolean;
};

const ROW1 = "qwertyuiop".split("");
const ROW2 = "asdfghjkl".split("");
const ROW3 = "zxcvbnm".split("");

/** Compute iOS-faithful key layout for a given keyboard width. */
export const keyboardLayout = (kbW: number): { keys: KeyRect[]; height: number; unit: number } => {
  const gap = kbW * 0.012;
  const u = (kbW - gap * 11) / 10; // letter key width
  const kh = u * 1.5; // iOS keys are taller than wide
  const rowGap = kbW * 0.022;
  const keys: KeyRect[] = [];
  let y = 0;
  ROW1.forEach((k, i) => keys.push({ x: gap + i * (u + gap), y, w: u, h: kh, label: k }));
  y += kh + rowGap;
  const r2Offset = (kbW - (ROW2.length * (u + gap) - gap)) / 2;
  ROW2.forEach((k, i) => keys.push({ x: r2Offset + i * (u + gap), y, w: u, h: kh, label: k }));
  y += kh + rowGap;
  const shiftW = u * 1.4;
  keys.push({ x: gap, y, w: shiftW, h: kh, label: "⇧", special: true });
  const r3Offset = (kbW - (ROW3.length * (u + gap) - gap)) / 2;
  ROW3.forEach((k, i) => keys.push({ x: r3Offset + i * (u + gap), y, w: u, h: kh, label: k }));
  keys.push({ x: kbW - gap - shiftW, y, w: shiftW, h: kh, label: "⌫", special: true });
  y += kh + rowGap;
  const bottomH = kh * 0.95;
  keys.push({ x: gap, y, w: u * 2.4, h: bottomH, label: "123", special: true });
  keys.push({ x: gap * 2 + u * 2.4, y, w: kbW - gap * 4 - u * 2.4 - u * 2.6, h: bottomH, label: "space", special: true });
  keys.push({ x: kbW - gap - u * 2.6, y, w: u * 2.6, h: bottomH, label: "return", special: true });
  return { keys, height: y + bottomH, unit: u };
};

/** Zone override: per-letter scale + optional % label. */
export type ZoneState = Record<string, { scale?: number; pct?: string }>;

export const Keyboard: React.FC<{
  width: number;
  /** normal = gray iOS keys; zones = amber hit-regions; ghost = dim equal keys */
  mode?: "normal" | "zones" | "ghost";
  /** draw amber zone overlay on top of normal keys */
  zoneOverlay?: boolean;
  /** restrict the overlay to these letters (default: all letter keys) */
  zoneLetters?: string[];
  zoneState?: ZoneState;
  /** per-letter % labels shown inside keys (normal mode) */
  pct?: Record<string, string>;
  suggestions?: string[];
  highlightKey?: string;
  /** 0..1 — brightness pop on highlighted key */
  highlightAmt?: number;
  showPanel?: boolean; // rounded dark panel behind keyboard
  glow?: number; // zone glow blur px
}> = ({
  width,
  mode = "normal",
  zoneOverlay = false,
  zoneLetters,
  zoneState = {},
  pct = {},
  suggestions,
  highlightKey,
  highlightAmt = 0,
  showPanel = false,
  glow = 20,
}) => {
  const { keys, height, unit } = keyboardLayout(width);
  const suggH = suggestions ? unit * 0.95 : 0;
  const fontSize = unit * 0.52;

  const keyFill = (k: KeyRect): string => {
    if (mode === "ghost") return "#2A2A2C";
    if (mode === "zones") return k.special ? "#1E1E20" : theme.zoneAmber;
    return k.special ? theme.keyDark : theme.keyGray;
  };

  const zoneRect = (k: KeyRect) => {
    const z = zoneState[k.label];
    const s = z?.scale ?? 1;
    const cx = k.x + k.w / 2;
    const cy = k.y + k.h / 2;
    const w = k.w * s;
    const h = k.h * (1 + (s - 1) * 0.45);
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        height: height + suggH + (showPanel ? unit * 0.8 : 0),
        background: showPanel ? theme.kbBg : "transparent",
        borderRadius: showPanel ? unit * 0.6 : 0,
        padding: showPanel ? unit * 0.4 : 0,
        boxSizing: "content-box",
      }}
    >
      {suggestions ? (
        <div
          style={{
            display: "flex",
            height: suggH,
            alignItems: "center",
            color: theme.keyText,
            fontSize: fontSize * 0.82,
            fontWeight: 400,
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                borderRight:
                  i < suggestions.length - 1
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "none",
                opacity: 0.9,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      ) : null}

      <div style={{ position: "relative", top: suggH ? 6 : 0 }}>
        {keys.map((k, i) => {
          const isHi = highlightKey === k.label;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: k.x,
                top: k.y,
                width: k.w,
                height: k.h,
                background: keyFill(k),
                borderRadius: unit * 0.16,
                boxShadow:
                  mode === "zones" && !k.special
                    ? `0 0 ${glow}px ${theme.zoneGlow}, 0 1px 0 rgba(0,0,0,0.5)`
                    : "0 1.5px 0 rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color:
                  mode === "zones" && !k.special ? "#4A3410" : theme.keyText,
                fontSize: k.special ? fontSize * 0.62 : fontSize,
                fontWeight: 400,
                scale: String(1 + (isHi ? 0.14 * highlightAmt : 0)),
                filter: isHi
                  ? `brightness(${1 + 0.35 * highlightAmt})`
                  : undefined,
                opacity: mode === "ghost" ? 0.75 : 1,
                zIndex: isHi ? 3 : 1,
              }}
            >
              <span>{k.label}</span>
              {pct[k.label] ? (
                <span
                  style={{
                    fontSize: fontSize * 0.55,
                    fontWeight: 700,
                    marginTop: -4,
                  }}
                >
                  {pct[k.label]}
                </span>
              ) : null}
            </div>
          );
        })}

        {/* amber zone overlay (irregular hit regions over normal keys) */}
        {zoneOverlay
          ? keys
              .filter(
                (k) =>
                  !k.special &&
                  (zoneLetters ? zoneLetters.includes(k.label) : true),
              )
              .map((k, i) => {
                const r = zoneRect(k);
                const z = zoneState[k.label];
                const emphasized = (z?.scale ?? 1) > 1.05;
                return (
                  <div
                    key={"z" + i}
                    style={{
                      position: "absolute",
                      left: r.x,
                      top: r.y,
                      width: r.w,
                      height: r.h,
                      background: emphasized
                        ? "rgba(232,163,61,0.85)"
                        : "rgba(232,163,61,0.20)",
                      border: `2px solid ${emphasized ? theme.zoneAmberHi : "rgba(245,197,99,0.55)"}`,
                      borderRadius: emphasized ? r.w * 0.28 : unit * 0.2,
                      boxShadow: `0 0 ${glow * (emphasized ? 1.8 : 1)}px ${theme.zoneGlow}`,
                      zIndex: emphasized ? 5 : 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: emphasized ? "#3A2A08" : "transparent",
                      fontSize: fontSize * 0.6,
                      fontWeight: 700,
                    }}
                  >
                    {z?.pct ?? ""}
                  </div>
                );
              })
          : null}
      </div>
    </div>
  );
};
