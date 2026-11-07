import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DottedGrid } from "./components/DottedGrid";
import { Captions, CaptionWord } from "./components/Captions";
import { MascotSlot } from "./components/Mascot";
import { Footnote } from "./components/Callout";
import { Bubble, InputBar } from "./components/PhoneFrame";
import { Chip, DataPanel } from "./components/Devices";
import {
  PipelineBar,
  FieldArcs,
  CapsLabel,
  StatCard,
  Gauge,
  Wire,
} from "./components/Exhibits";
import { Studio3D } from "./components/Studio3D";
import { EASE, theme } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const w = (t: string, style?: CaptionWord["style"], at?: number): CaptionWord => ({ t, style, at });
const MONO = "'SF Mono', Consolas, monospace";

const STAGES = ["tap", "token", "network", "bank", "ok"];

/* little flat card SVG used as a mascot prop + exhibit piece */
const MiniCard: React.FC<{ width?: number }> = ({ width = 150 }) => (
  <svg viewBox="0 0 150 95" width={width}>
    <rect width={150} height={95} rx={12} fill="#1F2A44" stroke="#3D4E78" strokeWidth={2} />
    <rect x={14} y={30} width={30} height={22} rx={5} fill="#E8C66A" />
    <rect x={14} y={66} width={70} height={8} rx={4} fill="rgba(255,255,255,0.4)" />
    <path d="M118 18 a14 14 0 0 1 0 22 M124 12 a22 22 0 0 1 0 34" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
  </svg>
);

/* ---------------- B1 — HOOK: Studio3D card turntable ---------------- */
const B1: React.FC = () => {
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("When"), w("you"), w("tap", "box"), w("to"), w("pay,")],
          [w("your"), w("card number", "box"), w("is"), w("never", "bold"), w("sent.", "bold")],
        ]}
        spreadFrames={155}
      />
      <div style={{ position: "absolute", top: 470, left: "50%", translate: "-50% 0" }}>
        <Studio3D width={900} height={860} dist={7.2} speed={0.25}>
          <group>
            <mesh>
              <boxGeometry args={[3.4, 0.09, 2.15]} />
              <meshStandardMaterial color="#2A3A66" roughness={0.3} metalness={0.45} />
            </mesh>
            {/* gold chip */}
            <mesh position={[-1.05, 0.06, -0.45]}>
              <boxGeometry args={[0.52, 0.03, 0.42]} />
              <meshStandardMaterial color="#E8C66A" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        </Studio3D>
      </div>
      <CapsLabel x={540} y={1270} text="contactless card" drop={-70} enterAt={30} />
      <Footnote lines={["Illustrative."]} x={64} y={1700} enterAt={20} />
      <MascotSlot pose="idle" talking offsetX={330} width={400} />
    </AbsoluteFill>
  );
};

/* ---------------- B2 — LIGHT MODE: NFC field between phone & terminal */
const B2: React.FC = () => {
  const frame = useCurrentFrame();
  const dip = interpolate(frame, [30, 55], [120, 0], { ...clamp, easing: Easing.bezier(...EASE) });
  return (
    <AbsoluteFill>
      <Captions
        mode="light"
        lines={[
          [w("the"), w("terminal"), w("powers", "bold"), w("your"), w("card")],
          [w("through"), w("the"), w("air", "box"), w("—"), w("4 cm", "box"), w("of"), w("field.", "bold")],
        ]}
        spreadFrames={164}
      />
      {/* payment terminal */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1050,
          translate: "-50% 0",
          width: 420,
          height: 330,
          background: "#1C1C1E",
          borderRadius: 34,
          boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
          padding: 26,
        }}
      >
        <div
          style={{
            background: "#0B0B0D",
            borderRadius: 20,
            height: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          ₹249
          <div style={{ fontSize: 22, color: "#8E8E93", fontWeight: 400, marginTop: 6 }}>Tap to pay</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <svg width={70} height={70} viewBox="0 0 70 70">
            <path d="M20 25 a18 18 0 0 1 0 20 M30 17 a30 30 0 0 1 0 36 M40 9 a42 42 0 0 1 0 52" stroke="#34C759" strokeWidth={5} fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* field arcs rising from terminal */}
      <div style={{ position: "absolute", left: "50%", top: 905, translate: "-50% 0" }}>
        <FieldArcs width={430} height={150} count={8} enterAt={26} />
      </div>
      {/* phone dipping toward the field */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 620 + dip,
          translate: "-50% 0",
          rotate: "9deg",
          width: 300,
          height: 300,
          background: "#101014",
          borderRadius: 40,
          border: "4px solid #3C3C40",
          boxShadow: "0 36px 70px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        <div style={{ margin: "40px 24px", color: "#fff", fontFamily: theme.font }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>₹249</div>
          <div style={{ fontSize: 20, color: "#8E8E93", marginTop: 6 }}>Hold near reader</div>
          <div style={{ marginTop: 26 }}>
            <MiniCard width={180} />
          </div>
        </div>
      </div>
      <CapsLabel x={190} y={880} text="nfc field — 4 cm" drop={60} enterAt={46} onLight />
      <Footnote lines={["Field drawn visible.", "It is invisible in real life."]} x={60} y={1500} right enterAt={60} />
      <MascotSlot pose="point-side" talking offsetX={-330} width={430} />
    </AbsoluteFill>
  );
};

/* ---------------- B3 — PIPELINE INTRO ---------------- */
const B3: React.FC = () => {
  const frame = useCurrentFrame();
  const counter = 84_213_117 + frame * 1890;
  return (
    <AbsoluteFill>
      <PipelineBar stages={STAGES} active={0} counter={counter} counterLabel="taps today" accent="#3B82F6" />
      <Captions
        top={260}
        lines={[
          [w("Every"), w("tap"), w("starts"), w("a"), w("relay,", "bold")],
          [w("with"), w("five", "box"), w("checkpoints.", "bold")],
        ]}
        spreadFrames={96}
      />
      <StatCard value="5" label="checkpoints" source="tap → token → network → bank → approved" x={330} y={900} enterAt={30} />
      <StatCard value="< 1" label="second total" x={330} y={1120} enterAt={60} />
      <MascotSlot pose="point-up" talking offsetX={-10} width={500} />
    </AbsoluteFill>
  );
};

/* ---------------- B4 — TOKENIZATION ---------------- */
const B4: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PipelineBar stages={STAGES} active={1} counter={84_514_200 + frame * 1890} counterLabel="taps today" accent="#3B82F6" />
      <Captions
        top={260}
        lines={[
          [w("your"), w("real"), w("number"), w("is"), w("swapped", "bold")],
          [w("for"), w("a"), w("one-time", "bold"), w("token.", "box")],
        ]}
        spreadFrames={110}
      />
      <div style={{ position: "absolute", left: "50%", top: 760, translate: "-50% 0" }}>
        <DataPanel width={840} title="tokenization" enterAt={6}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: theme.footnote, fontSize: 26, marginBottom: 10 }}>your card</div>
            <Chip text="4833 1200 3412 9931" fontSize={34} enterAt={16} />
            <div
              style={{
                color: theme.footnote,
                fontSize: 40,
                margin: "12px 0",
                opacity: interpolate(frame, [30, 38], [0, 1], clamp),
              }}
            >
              ↓
            </div>
            <div style={{ color: theme.footnote, fontSize: 26, marginBottom: 10 }}>what the shop sees</div>
            <Chip text="TKN 8f3a 77c2 05d1" fontSize={34} amber enterAt={44} />
          </div>
        </DataPanel>
      </div>
      <Footnote
        lines={["EMV tokenization.", "The shop never stores your real number."]}
        x={64}
        y={1400}
        enterAt={60}
      />
      <MascotSlot pose="hold" talking offsetX={250} width={460} prop={<foreignObject x={-75} y={-100} width={150} height={95}><MiniCard /></foreignObject>} />
    </AbsoluteFill>
  );
};

/* ---------------- B5 — NETWORK RACE: wires + gauge ---------------- */
const B5: React.FC = () => {
  const frame = useCurrentFrame();
  const ms = interpolate(frame, [30, 120], [0, 0.4], { ...clamp, easing: Easing.bezier(...EASE) });
  const Node: React.FC<{ x: number; y: number; label: string; at: number }> = ({ x, y, label, at }) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        background: theme.panel,
        border: "1.5px solid rgba(255,255,255,0.14)",
        borderRadius: 18,
        padding: "16px 26px",
        color: "#fff",
        fontSize: 28,
        fontWeight: 700,
        fontFamily: MONO,
        opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
        zIndex: 10,
      }}
    >
      {label}
    </div>
  );
  return (
    <AbsoluteFill>
      <PipelineBar stages={STAGES} active={3} counter={84_815_400 + frame * 1890} counterLabel="taps today" accent="#3B82F6" />
      <Captions
        top={260}
        lines={[
          [w("it"), w("races", "bold"), w("the"), w("network", "box"), w("—")],
          [w("your"), w("bank"), w("answers"), w("in"), w("400 ms.", "box")],
        ]}
        spreadFrames={166}
      />
      <Wire x1={225} y1={800} x2={540} y2={720} enterAt={14} />
      <Wire x1={540} y1={720} x2={860} y2={800} enterAt={26} />
      <Wire x1={860} y1={800} x2={540} y2={720} enterAt={70} color="rgba(52,199,89,0.5)" />
      <Node x={225} y={800} label="TERMINAL" at={8} />
      <Node x={540} y={720} label="NETWORK" at={20} />
      <Node x={860} y={800} label="BANK" at={32} />
      <div style={{ position: "absolute", left: "50%", top: 960, translate: "-50% 0" }}>
        <Gauge size={460} value={ms} display={`${Math.round(ms * 1000)} ms`} sub="tap → approved" />
      </div>
      <Footnote lines={["Typical contactless round trip.", "Values illustrative."]} x={64} y={1560} enterAt={80} />
      <MascotSlot pose="idle" talking offsetX={340} width={380} />
    </AbsoluteFill>
  );
};

/* ---------------- B6 — SCALE: stat beat ---------------- */
const B6: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [20, 90], [0, 65000], { ...clamp, easing: Easing.bezier(0.3, 0, 0.7, 1) }));
  return (
    <AbsoluteFill>
      <PipelineBar stages={STAGES} active={4} counter={85_101_300 + frame * 9450} counterLabel="taps today" accent="#3B82F6" />
      <Captions
        top={260}
        lines={[
          [w("Visa"), w("alone"), w("handles")],
          [w("65,000", "box"), w("of"), w("these,"), w("every"), w("second.", "bold")],
        ]}
        spreadFrames={132}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 820,
          textAlign: "center",
          color: "#fff",
          fontSize: 150,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          fontFamily: MONO,
        }}
      >
        {n.toLocaleString("en-US")}
        <div style={{ fontSize: 40, color: theme.footnote, fontWeight: 400, marginTop: 6, fontFamily: theme.font }}>
          messages / second
        </div>
      </div>
      <Footnote lines={["VisaNet stated capacity.", "Daily average is far lower."]} x={64} y={1400} enterAt={70} />
      <MascotSlot pose="shock" talking offsetX={0} width={490} />
    </AbsoluteFill>
  );
};

/* ---------------- B7 — STOLEN TOKEN = USELESS ---------------- */
const B7: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame > 56 && frame < 68 ? Math.sin(frame * 2.4) * 5 : 0;
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("a"), w("stolen", "bold"), w("token", "box"), w("is")],
          [w("useless", "box"), w("anywhere"), w("else.", "bold")],
        ]}
        spreadFrames={127}
      />
      <div style={{ position: "absolute", left: "50%", top: 700, translate: "-50% 0", textAlign: "center" }}>
        <Chip text="TKN 8f3a 77c2 05d1" fontSize={36} amber enterAt={10} />
      </div>
      {/* original shop: accepted */}
      <div style={{ position: "absolute", left: 160, top: 920, textAlign: "center" }}>
        <div style={{ color: theme.footnote, fontSize: 26, marginBottom: 12 }}>the coffee shop</div>
        <div
          style={{
            width: 110,
            height: 110,
            margin: "0 auto",
            borderRadius: "50%",
            border: "4px solid #34C759",
            background: "rgba(52,199,89,0.14)",
            color: "#34C759",
            fontSize: 60,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(frame, [34, 42], [0, 1], clamp),
            boxShadow: "0 0 40px rgba(52,199,89,0.3)",
          }}
        >
          ✓
        </div>
      </div>
      {/* thief's terminal: declined */}
      <div style={{ position: "absolute", right: 160, top: 920, textAlign: "center", translate: `${shake}px 0px` }}>
        <div style={{ color: theme.footnote, fontSize: 26, marginBottom: 12 }}>anywhere else</div>
        <div
          style={{
            width: 110,
            height: 110,
            margin: "0 auto",
            borderRadius: "50%",
            border: `4px solid ${theme.accentRed}`,
            background: "rgba(229,57,53,0.14)",
            color: theme.accentRed,
            fontSize: 60,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(frame, [56, 62], [0, 1], clamp),
            boxShadow: "0 0 40px rgba(229,57,53,0.3)",
          }}
        >
          ✗
        </div>
      </div>
      <Footnote lines={["One token — one merchant, one use."]} x={64} y={1400} enterAt={76} />
      <MascotSlot pose="celebrate" talking offsetX={0} width={500} />
    </AbsoluteFill>
  );
};

/* ---------------- B8 — CTA (light) ---------------- */
const B8: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, Math.min(Math.floor((frame - 66) / 4), "cash is heavy bro".length));
  return (
    <AbsoluteFill>
      <Captions
        mode="light"
        lines={[
          [w("send", "box"), w("this"), w("to"), w("the"), w("friend")],
          [w("who"), w("still"), w("pays"), w("in"), w("cash.", "bold")],
        ]}
        spreadFrames={88}
      />
      <div
        style={{
          position: "absolute",
          top: 640,
          left: "50%",
          translate: "-50% 0",
          width: 760,
          background: "#FFFFFF",
          borderRadius: 36,
          padding: 36,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          boxShadow: "0 30px 70px rgba(0,0,0,0.14)",
          opacity: interpolate(frame, [6, 14], [0, 1], { ...clamp, easing: Easing.bezier(...EASE) }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#E8A33D)" }} />
          <div style={{ color: "#1A1A1C", fontSize: 30, fontWeight: 700 }}>
            Rohan
            <div style={{ color: "#9A9A9E", fontSize: 22, fontWeight: 400 }}>Active now</div>
          </div>
        </div>
        {frame > 22 ? <Bubble text="did you just pay with your watch 💀" /> : null}
        {frame > 42 ? <Bubble text="tap tap baby 😎" out /> : null}
        <InputBar text="cash is heavy bro" chars={typed} fontSize={28} />
      </div>
      <MascotSlot pose="wave" talking offsetX={0} width={510} />
    </AbsoluteFill>
  );
};

/* ---------------- timeline ---------------- */

type Beat = { id: string; dur: number; Comp: React.FC; vo: string; mode?: "dark" | "light" };

// VO: en-IN-PrabhatNeural via edge-tts
export const BEATS: Beat[] = [
  { id: "hook3d", dur: 205, Comp: B1, vo: "b1" },
  { id: "nfc", dur: 216, Comp: B2, vo: "b2", mode: "light" },
  { id: "pipeline", dur: 132, Comp: B3, vo: "b3" },
  { id: "token", dur: 150, Comp: B4, vo: "b4" },
  { id: "network", dur: 219, Comp: B5, vo: "b5" },
  { id: "scale", dur: 176, Comp: B6, vo: "b6" },
  { id: "stolen", dur: 170, Comp: B7, vo: "b7" },
  { id: "cta", dur: 165, Comp: B8, vo: "b8", mode: "light" },
];

export const TOTAL_FRAMES = BEATS.reduce((a, b) => a + b.dur, 0);

export const Reel: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      {BEATS.map((b) => {
        const from = at;
        at += b.dur;
        return (
          <Sequence key={b.id} from={from} durationInFrames={b.dur} name={b.id} layout="absolute-fill">
            <DottedGrid mode={b.mode ?? "dark"}>
              <Audio src={staticFile(`vo/${b.vo}.mp3`)} />
              <b.Comp />
            </DottedGrid>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
