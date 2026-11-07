import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE, theme } from "../theme";

export type CaptionWord = {
  t: string;
  style?: "muted" | "bold" | "box";
  at?: number; // frame (within the parent Sequence) when the word appears
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Handle: React.FC<{ x: string; y: string }> = ({ x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 10,
      height: 10,
      translate: "-50% -50%",
      background: theme.selectBlue,
      border: "2px solid #fff",
      borderRadius: 2,
    }}
  />
);

const Word: React.FC<{ w: CaptionWord; appearAt: number; light?: boolean }> = ({
  w,
  appearAt,
  light,
}) => {
  const bright = light ? "#1A1A1C" : theme.captionBright;
  const muted = light ? "#8A8A8E" : theme.captionMuted;
  const frame = useCurrentFrame();
  const pop = {
    opacity: interpolate(frame, [appearAt, appearAt + 4], [0, 1], {
      ...clamp,
      easing: Easing.bezier(...EASE),
    }),
    scale: String(
      interpolate(frame, [appearAt, appearAt + 6], [0.92, 1], {
        ...clamp,
        easing: Easing.bezier(...EASE),
      }),
    ),
    translate:
      "0px " +
      interpolate(frame, [appearAt, appearAt + 6], [6, 0], {
        ...clamp,
        easing: Easing.bezier(...EASE),
      }) +
      "px",
  };

  if (w.style === "box") {
    const boxIn = interpolate(frame, [appearAt + 3, appearAt + 7], [0, 1], {
      ...clamp,
      easing: Easing.bezier(...EASE),
    });
    return (
      <span
        style={{
          display: "inline-block",
          position: "relative",
          color: bright,
          fontWeight: 700,
          padding: "2px 14px",
          margin: "0 2px",
          ...pop,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            border: `2.5px solid ${theme.selectBlue}`,
            borderRadius: 8,
            opacity: boxIn,
            boxShadow: "0 0 28px rgba(59,130,246,0.35)",
          }}
        >
          <Handle x="0%" y="0%" />
          <Handle x="100%" y="0%" />
          <Handle x="0%" y="100%" />
          <Handle x="100%" y="100%" />
        </span>
        {w.t}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-block",
        color: w.style === "bold" ? bright : muted,
        fontWeight: w.style === "bold" ? 700 : 500,
        ...pop,
      }}
    >
      {w.t}
    </span>
  );
};

/**
 * Karaoke captions at the TOP of the frame. 1–2 lines, words pop in
 * as spoken. Default timing spaces words evenly across `spreadFrames`.
 */
export const Captions: React.FC<{
  lines: CaptionWord[][];
  spreadFrames?: number; // frames over which unscheduled words appear
  top?: number;
  mode?: "dark" | "light";
}> = ({ lines, spreadFrames = 20, top = 200, mode = "dark" }) => {
  const all = lines.flat();
  const n = all.length;
  let i = 0;
  const timed = lines.map((line) =>
    line.map((w) => {
      const at = w.at ?? Math.round((i / Math.max(1, n)) * spreadFrames);
      i++;
      return { w, at };
    }),
  );
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        fontSize: 66,
        lineHeight: 1.45,
        letterSpacing: "-0.02em",
        zIndex: 50,
        textShadow: mode === "light" ? "none" : "0 2px 24px rgba(0,0,0,0.8)",
      }}
    >
      {timed.map((line, li) => (
        <div key={li}>
          {line.map(({ w, at }, wi) => (
            <React.Fragment key={wi}>
              <Word w={w} appearAt={at} light={mode === "light"} />
              {wi < line.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};
