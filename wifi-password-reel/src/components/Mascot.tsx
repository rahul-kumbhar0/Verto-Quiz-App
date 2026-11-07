import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../theme";

export type MascotPose =
  | "idle"
  | "point-up"
  | "point-side"
  | "shrug"
  | "facepalm"
  | "thumbs-up"
  | "confused" // chin-stroke
  | "celebrate"
  | "ok-sign"
  | "wave"
  | "shock" // hands on head
  | "stop" // stop-palm
  | "arms-crossed"
  | "hold"; // holds a prop in the raised right hand

// ---- palette (cel shading) ----
const SKIN = "#F1BE94";
const SKIN_SH = "#D99F6F"; // shadow
const SKIN_HI = "#FAD4B2";
const HAIR = "#7E5230";
const HAIR_D = "#5C3A1E";
const HAIR_HI = "#A5744A";
const SHIRT = "#DF2E2E";
const SHIRT_D = "#B02020";
const SHIRT_D2 = "#8F1818";
const LIP = "#A96A4C";

/* ------------------------------------------------------------------ */
/* Hands (drawn pointing up in local space; rotate via the arm)        */
/* ------------------------------------------------------------------ */
const Hand: React.FC<{ kind: string }> = ({ kind }) => {
  switch (kind) {
    case "point":
      return (
        <g>
          <path
            d="M-16 6 Q-20 -8 -10 -14 L10 -14 Q20 -10 18 4 Q18 18 2 20 Q-14 20 -16 6 Z"
            fill={SKIN}
          />
          <rect x={-6} y={-52} width={13} height={44} rx={6.5} fill={SKIN} />
          <rect x={-6} y={-52} width={5} height={44} rx={2.5} fill={SKIN_HI} opacity={0.5} />
          <path d="M-16 2 Q-10 10 0 10" stroke={SKIN_SH} strokeWidth={3} fill="none" />
        </g>
      );
    case "open":
      return (
        <g>
          <path
            d="M-18 2 Q-20 -16 -8 -22 L6 -24 Q20 -20 20 -4 Q22 16 4 20 Q-14 22 -18 2 Z"
            fill={SKIN}
          />
          {[-11, -3, 5, 13].map((x, i) => (
            <rect key={i} x={x} y={-40 - (i === 1 || i === 2 ? 6 : 0)} width={9} height={26} rx={4.5} fill={SKIN} />
          ))}
          <path d="M-14 4 Q-4 12 8 10" stroke={SKIN_SH} strokeWidth={3} fill="none" />
        </g>
      );
    case "thumb":
      return (
        <g>
          <path d="M-16 -14 Q-20 10 -2 16 Q16 18 18 2 Q20 -12 6 -16 Z" fill={SKIN} />
          <rect x={-30} y={-34} width={13} height={34} rx={6.5} fill={SKIN} transform="rotate(-14)" />
          <path d="M-12 0 Q-2 8 10 6" stroke={SKIN_SH} strokeWidth={3} fill="none" />
        </g>
      );
    case "ok":
      return (
        <g>
          <path d="M-16 -8 Q-20 10 -2 16 Q16 18 18 0 Q18 -14 4 -16 Z" fill={SKIN} />
          <circle r={11} cy={-18} fill="none" stroke={SKIN} strokeWidth={9} />
          <circle r={11} cy={-18} fill="none" stroke={SKIN_SH} strokeWidth={2} opacity={0.4} />
          {[-2, 6, 14].map((x, i) => (
            <rect key={i} x={x} y={-40} width={8} height={22} rx={4} fill={SKIN} transform={`rotate(${8 * i})`} />
          ))}
        </g>
      );
    default: // fist
      return (
        <g>
          <path d="M-16 -14 Q-20 8 -4 16 Q14 20 18 2 Q20 -14 4 -18 Z" fill={SKIN} />
          <path d="M-12 -6 Q-2 2 12 -2" stroke={SKIN_SH} strokeWidth={3} fill="none" />
          <path d="M-10 4 Q0 10 12 6" stroke={SKIN_SH} strokeWidth={2.5} fill="none" opacity={0.7} />
        </g>
      );
  }
};

/* ------------------------------------------------------------------ */
/* Arm: shoulder-anchored, two segments, cel-shaded sleeve             */
/* ------------------------------------------------------------------ */
type ArmSpec = {
  side: "l" | "r";
  angle: number; // deg from straight-down, outward positive
  bend?: number;
  hand?: string;
  handRot?: number;
  prop?: React.ReactNode;
};

const Arm: React.FC<ArmSpec> = ({ side, angle, bend = 0, hand = "fist", handRot = 0, prop }) => {
  const sx = side === "l" ? 118 : 282;
  const dir = side === "l" ? 1 : -1;
  return (
    <g transform={`translate(${sx} 345) rotate(${angle * dir})`}>
      {/* sleeve */}
      <path d="M-26 -14 Q-30 0 -26 24 L-26 52 Q0 66 26 52 L26 24 Q30 0 26 -14 Q0 -26 -26 -14 Z" fill={SHIRT} />
      <path d="M8 -18 Q26 -12 26 24 L26 52 Q18 57 8 59 Z" fill={SHIRT_D} opacity={0.75} />
      {/* upper arm */}
      <path d="M-18 48 L-18 92 Q-18 104 0 104 Q18 104 18 92 L18 48 Q0 58 -18 48 Z" fill={SKIN} />
      <path d="M8 50 L8 100 Q14 99 18 92 L18 48 Q14 50 8 50 Z" fill={SKIN_SH} opacity={0.55} />
      <g transform={`translate(0 98) rotate(${bend * dir})`}>
        {/* forearm */}
        <path d="M-15 -4 L-15 78 Q-15 90 0 90 Q15 90 15 78 L15 -4 Q0 4 -15 -4 Z" fill={SKIN} />
        <path d="M7 -2 L7 86 Q12 84 15 78 L15 -4 Q11 -2 7 -2 Z" fill={SKIN_SH} opacity={0.5} />
        <g transform={`translate(0 100) rotate(${(-angle * dir - bend * dir) + handRot})`}>
          <Hand kind={hand} />
          {prop ? <g transform="translate(0 -40)">{prop}</g> : null}
        </g>
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Pose table                                                          */
/* ------------------------------------------------------------------ */
const POSES: Record<MascotPose, { l: ArmSpec; r: ArmSpec; crossed?: boolean }> = {
  idle: { l: { side: "l", angle: 10 }, r: { side: "r", angle: 10 } },
  "point-up": {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 168, bend: 6, hand: "point" },
  },
  "point-side": {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 98, bend: -4, hand: "point", handRot: 90 },
  },
  shrug: {
    l: { side: "l", angle: 42, bend: -100, hand: "open", handRot: 80 },
    r: { side: "r", angle: 42, bend: -100, hand: "open", handRot: -80 },
  },
  facepalm: {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 152, bend: 76, hand: "open", handRot: 24 },
  },
  "thumbs-up": {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 52, bend: -118, hand: "thumb" },
  },
  confused: {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 126, bend: 84, hand: "fist" }, // chin-stroke
  },
  celebrate: {
    l: { side: "l", angle: 155, bend: -14, hand: "fist" },
    r: { side: "r", angle: 155, bend: 14, hand: "fist" },
  },
  "ok-sign": {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 112, bend: -36, hand: "ok" },
  },
  wave: {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 118, bend: -58, hand: "open" },
  },
  shock: {
    l: { side: "l", angle: 128, bend: 58, hand: "open", handRot: 60 },
    r: { side: "r", angle: 128, bend: 58, hand: "open", handRot: -60 },
  },
  stop: {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 80, bend: -108, hand: "open" },
  },
  "arms-crossed": {
    l: { side: "l", angle: 30, bend: -108, hand: "fist" },
    r: { side: "r", angle: 30, bend: -108, hand: "fist" },
    crossed: true,
  },
  hold: {
    l: { side: "l", angle: 10 },
    r: { side: "r", angle: 96, bend: -86, hand: "open" },
  },
};

const MOUTHS: Partial<Record<MascotPose, React.ReactNode>> = {
  idle: (
    <g>
      <path d="M176 208 Q200 226 224 208 Q220 222 200 223 Q180 222 176 208 Z" fill="#6E3A20" />
      <path d="M181 210 Q200 219 219 210 L217 214 Q200 221 183 214 Z" fill="#fff" />
    </g>
  ),
  celebrate: (
    <g>
      <ellipse cx={200} cy={213} rx={19} ry={13} fill="#5C2E16" />
      <path d="M183 208 Q200 214 217 208 L217 211 Q200 217 183 211 Z" fill="#fff" />
    </g>
  ),
  shock: <ellipse cx={200} cy={214} rx={12} ry={16} fill="#5C2E16" />,
  confused: <path d="M184 214 Q200 207 218 215" stroke={LIP} strokeWidth={5.5} fill="none" strokeLinecap="round" />,
  facepalm: <path d="M184 216 Q200 210 216 216" stroke={LIP} strokeWidth={5.5} fill="none" strokeLinecap="round" />,
  stop: <path d="M184 214 Q200 210 216 214" stroke={LIP} strokeWidth={5.5} fill="none" strokeLinecap="round" />,
  "arms-crossed": (
    <path d="M182 210 Q200 220 218 210" stroke={LIP} strokeWidth={5.5} fill="none" strokeLinecap="round" />
  ),
};

/** Talking visemes: closed → mid → open, cycled pseudo-randomly per frame. */
const TALK_MOUTHS: React.ReactNode[] = [
  // closed (soft smile)
  <path key="c" d="M181 212 Q200 222 219 212" stroke={LIP} strokeWidth={6} fill="none" strokeLinecap="round" />,
  // mid (teeth showing)
  <g key="m">
    <path d="M178 206 Q200 200 222 206 Q222 220 200 222 Q178 220 178 206 Z" fill="#5C2E16" />
    <path d="M182 207 Q200 202 218 207 L217 212 Q200 208 183 212 Z" fill="#fff" />
  </g>,
  // open (vowel)
  <g key="o">
    <ellipse cx={200} cy={214} rx={16} ry={13} fill="#5C2E16" />
    <path d="M186 207 Q200 203 214 207 L213 211 Q200 208 187 211 Z" fill="#fff" />
    <ellipse cx={200} cy={222} rx={8} ry={4} fill="#B4604A" />
  </g>,
];

/* ------------------------------------------------------------------ */
/* The mascot                                                          */
/* ------------------------------------------------------------------ */
export const Mascot: React.FC<{
  pose: MascotPose;
  width?: number;
  enterAt?: number;
  headTilt?: number;
  /** rendered in the right hand when pose="hold" */
  prop?: React.ReactNode;
  /** animate the mouth + a subtle head bob, as if speaking the VO */
  talking?: boolean;
}> = ({ pose, width = 520, enterAt = 0, headTilt = 0, prop, talking = false }) => {
  const frame = useCurrentFrame();
  const spec = POSES[pose];
  const breathe = Math.sin(frame / 15) * 2.5;
  const pop = interpolate(frame, [enterAt, enterAt + 6], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  // pseudo-random viseme cycle (~8–10 mouth changes per second at 30fps)
  const ph = Math.abs(Math.sin(frame * 0.9) + 0.6 * Math.sin(frame * 0.53 + 1.3));
  const viseme = ph > 1.05 ? 2 : ph > 0.45 ? 1 : 0;
  const talkNod = talking ? Math.sin(frame / 7) * 1.8 : 0;
  const tilt =
    headTilt +
    talkNod +
    (pose === "confused" ? -6 : pose === "facepalm" ? 5 : pose === "point-up" ? -3 : 0);
  const waveRock = pose === "wave" ? Math.sin(frame / 5) * 7 : 0;

  return (
    <svg
      viewBox="0 0 400 600"
      width={width}
      style={{ scale: String(pop), transformOrigin: "50% 100%", display: "block" }}
    >
      <defs>
        <linearGradient id="mShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1C9A58" />
          <stop offset="0.42" stopColor="#36D178" />
          <stop offset="0.72" stopColor="#1E9FB8" />
          <stop offset="1" stopColor="#1A6FC0" />
        </linearGradient>
        <linearGradient id="mShirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SHIRT} />
          <stop offset="1" stopColor={SHIRT_D} />
        </linearGradient>
      </defs>

      <g transform={`translate(0 ${breathe}) rotate(${waveRock * 0.15} 200 420)`}>
        {/* ---- arms behind torso ---- */}
        <g transform={pose === "wave" ? `rotate(${waveRock} 282 345)` : undefined}>
          <Arm {...spec.r} prop={pose === "hold" ? prop : undefined} />
        </g>
        <Arm {...spec.l} />

        {/* ---- torso (taller: waist + jeans hint) ---- */}
        <path
          d="M104 600 L106 400 Q106 356 128 340 Q156 322 200 322 Q244 322 272 340 Q294 356 294 400 L296 600 Z"
          fill="url(#mShirt)"
        />
        {/* side shadow */}
        <path d="M250 330 Q294 356 294 400 L296 600 L258 600 Q266 460 250 330 Z" fill={SHIRT_D2} opacity={0.5} />
        {/* collar */}
        <path d="M160 328 Q200 352 240 328 Q238 342 200 348 Q162 342 160 328 Z" fill={SHIRT_D2} />
        {/* folds */}
        <path d="M150 420 Q190 432 240 424" stroke={SHIRT_D2} strokeWidth={4} fill="none" opacity={0.45} />
        <path d="M140 500 Q196 514 252 504" stroke={SHIRT_D2} strokeWidth={4} fill="none" opacity={0.35} />
        {/* jeans hint at the very bottom */}
        <path d="M110 578 L290 578 L290 600 L110 600 Z" fill="#26303E" />

        {/* crossed forearms overlay */}
        {spec.crossed ? (
          <g>
            <path d="M126 395 Q200 430 274 388 L278 414 Q200 455 122 420 Z" fill={SKIN} />
            <path d="M126 395 Q200 430 274 388 L275 396 Q200 436 125 403 Z" fill={SKIN_SH} opacity={0.4} />
          </g>
        ) : null}

        {/* ---- neck ---- */}
        <path d="M178 268 L222 268 L222 320 Q200 330 178 320 Z" fill={SKIN} />
        <path d="M178 268 Q200 290 222 268 L222 282 Q200 300 178 282 Z" fill={SKIN_SH} opacity={0.7} />

        {/* ---- head ---- */}
        <g transform={`rotate(${tilt} 200 180)`}>
          {/* ears */}
          <ellipse cx={122} cy={180} rx={15} ry={20} fill={SKIN} />
          <ellipse cx={278} cy={180} rx={15} ry={20} fill={SKIN} />
          <path d="M118 176 Q124 182 120 190" stroke={SKIN_SH} strokeWidth={3} fill="none" />
          <path d="M282 176 Q276 182 280 190" stroke={SKIN_SH} strokeWidth={3} fill="none" />
          {/* face */}
          <path
            d="M126 160 Q126 92 200 88 Q274 92 274 160 Q274 204 254 228 Q230 252 200 252 Q170 252 146 228 Q126 204 126 160 Z"
            fill={SKIN}
          />
          {/* cheek/jaw shadow */}
          <path
            d="M252 150 Q262 200 240 226 Q252 196 248 152 Z M200 252 Q230 250 248 230 Q236 248 200 252 Z"
            fill={SKIN_SH}
            opacity={0.45}
          />
          {/* stubble */}
          <path
            d="M150 214 Q168 246 200 246 Q232 246 250 214 Q246 240 224 250 Q200 258 176 250 Q154 240 150 214 Z"
            fill={HAIR_D}
            opacity={0.16}
          />
          {/* mustache */}
          <path d="M178 202 Q200 196 222 202 Q212 194 200 194 Q188 194 178 202 Z" fill={HAIR_D} opacity={0.35} />
          {/* nose */}
          <path d="M200 168 Q209 186 201 194 Q196 197 192 193" stroke={SKIN_SH} strokeWidth={5} fill="none" strokeLinecap="round" />
          {/* mouth */}
          {talking ? TALK_MOUTHS[viseme] : (MOUTHS[pose] ?? MOUTHS.idle)}
          {/* hair: back mass + front sweep + highlights */}
          <path
            d="M124 160 Q116 76 196 60 Q282 64 276 158 Q278 120 258 104 Q272 92 262 78 Q240 92 206 86 Q168 82 148 102 Q128 118 128 148 Z"
            fill={HAIR}
          />
          <path d="M196 60 Q252 60 268 96 Q250 78 216 80 Q190 80 174 72 Q182 62 196 60 Z" fill={HAIR_HI} opacity={0.7} />
          <path d="M148 102 Q168 84 206 86 Q240 92 262 78 Q252 98 224 100 Q186 102 166 112 Q152 120 148 102 Z" fill={HAIR_D} opacity={0.5} />
          <path d="M158 92 Q186 76 224 82" stroke={HAIR_HI} strokeWidth={5} fill="none" opacity={0.65} strokeLinecap="round" />
          {/* wrap sunglasses */}
          <path
            d="M126 150 Q200 132 274 150 L270 184 Q238 200 200 194 Q162 200 130 184 Z"
            fill="url(#mShade)"
          />
          <path d="M126 150 Q200 132 274 150 L273 158 Q200 141 127 158 Z" fill="#10242E" />
          <path d="M138 156 Q172 146 198 154 L190 174 Q162 166 142 172 Z" fill="#fff" opacity={0.38} />
          <path d="M214 152 Q232 148 252 154 L246 168 Q230 162 218 164 Z" fill="#fff" opacity={0.22} />
          <rect x={116} y={148} width={12} height={18} rx={5} fill="#10242E" />
          <rect x={272} y={148} width={12} height={18} rx={5} fill="#10242E" />
        </g>
      </g>
    </svg>
  );
};

/** Positioned wrapper: bottom-center of the 1080×1920 frame. */
export const MascotSlot: React.FC<{
  pose: MascotPose;
  enterAt?: number;
  offsetX?: number;
  width?: number;
  prop?: React.ReactNode;
  talking?: boolean;
}> = ({ pose, enterAt, offsetX = 0, width = 520, prop, talking }) => (
  <div
    style={{
      position: "absolute",
      bottom: -36,
      left: "50%",
      translate: `${-width / 2 + offsetX}px 0px`,
      zIndex: 20,
    }}
  >
    <Mascot pose={pose} enterAt={enterAt} width={width} prop={prop} talking={talking} />
  </div>
);
