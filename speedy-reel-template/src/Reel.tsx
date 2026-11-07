import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { DottedGrid } from "./components/DottedGrid";
import { Captions, CaptionWord } from "./components/Captions";
import { Keyboard, keyboardLayout } from "./components/Keyboard";
import { MascotSlot, MascotPose } from "./components/Mascot";
import { Finger } from "./components/Finger";
import { Callout, Footnote, Measure } from "./components/Callout";
import { ExplodedLayers, FloatingPanel } from "./components/ExplodedLayers";
import { PhoneFrame, Bubble, InputBar } from "./components/PhoneFrame";
import { EASE, theme } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- helpers ----------

const w = (
  t: string,
  style?: CaptionWord["style"],
  at?: number,
): CaptionWord => ({ t, style, at });

/** Character-preview balloon (the gray callout above a pressed key). */
const CharPreview: React.FC<{
  letter: string;
  x: number;
  y: number;
  size: number;
  enterAt: number;
}> = ({ letter, x, y, size, enterAt }) => {
  const frame = useCurrentFrame();
  const s = interpolate(
    frame,
    [enterAt, enterAt + 4, enterAt + 7],
    [0, 1.06, 1],
    { ...clamp, easing: Easing.bezier(...EASE) },
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -100%",
        scale: String(s),
        transformOrigin: "50% 100%",
        zIndex: 25,
        opacity: s > 0.01 ? 1 : 0,
      }}
    >
      <div
        style={{
          width: size,
          height: size * 1.15,
          background: "#6B6B6F",
          borderRadius: size * 0.18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: size * 0.62,
          boxShadow: "0 12px 30px rgba(0,0,0,0.55)",
        }}
      >
        {letter}
      </div>
      <div
        style={{
          width: size * 0.5,
          height: size * 0.34,
          background: "#6B6B6F",
          margin: "0 auto",
          clipPath: "polygon(0 0, 100% 0, 72% 100%, 28% 100%)",
          marginTop: -1,
        }}
      />
    </div>
  );
};

// ---------- beats ----------

const B1_HOOK: React.FC = () => {
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("Every"), w("key", "box"), w("on"), w("your"), w("iPhone")],
          [w("is"), w("smaller", "bold", 24), w("than"), w("your"), w("fingertip.", "bold", 38)],
        ]}
        spreadFrames={22}
      />
      <div
        style={{
          position: "absolute",
          top: 620,
          left: "50%",
          translate: "-50% 0",
        }}
      >
        <FloatingPanel width={880} tiltX={34}>
          <Keyboard
            width={880}
            suggestions={['"tim"', "time", "times"]}
            showPanel
          />
        </FloatingPanel>
      </div>
      <Finger x={620} y={1210} width={520} enterAt={10} tapAt={55} rotate={-10} />
      <Footnote
        lines={["Magnified illustration.", "Keys drawn to scale."]}
        x={64}
        y={1700}
        enterAt={20}
      />
    </AbsoluteFill>
  );
};

const B2_EXPLODE: React.FC = () => {
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("Because"), w("you"), w("see", "box"), w("one"), w("keyboard,")],
          [w("but"), w("you"), w("touch", "box", 34), w("another.", "bold", 44)],
        ]}
        spreadFrames={48}
      />
      <div
        style={{
          position: "absolute",
          top: 470,
          left: "50%",
          translate: "-50% 0",
        }}
      >
        <ExplodedLayers
          width={740}
          explodeAt={25}
          gap={140}
          tiltX={48}
          connectors={10}
          top={
            <Keyboard
              width={740}
              suggestions={["I", "The", "I'm"]}
              showPanel
            />
          }
          bottom={<Keyboard width={740} mode="zones" glow={24} />}
        />
      </div>
      <Callout
        x={400}
        y={850}
        dx={-170}
        dy={46}
        label="what you see"
        enterAt={38}
        labelX={-336}
      />
      <Callout
        x={400}
        y={1230}
        dx={-170}
        dy={46}
        label="what you touch"
        enterAt={48}
        labelX={-336}
      />
      <Footnote
        lines={["Zones drawn visible.", "On a real iPhone they are invisible."]}
        x={64}
        y={1430}
        enterAt={55}
      />
      <MascotSlot pose="shrug" offsetX={290} width={360} />
    </AbsoluteFill>
  );
};

const B3_ZONES: React.FC = () => {
  const frame = useCurrentFrame();
  const swell = interpolate(frame, [30, 44], [1, 2.1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const squeeze = interpolate(frame, [30, 44], [1, 0.62], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("the"), w("E"), w("gets"), w("bigger,", "box", 20)],
          [
            w("and", undefined, 34),
            w("its"),
            w("neighbors"),
            w("get"),
            w("squeezed.", "box", 52),
          ],
        ]}
        spreadFrames={30}
      />
      {/* macro camera: keyboard rendered huge, centered on E */}
      <div style={{ position: "absolute", left: -42, top: 580 }}>
        <Keyboard
          width={2300}
          zoneOverlay
          pct={{ w: "0%", r: "3%" }}
          zoneState={{
            e: { scale: swell, pct: "96%" },
            w: { scale: squeeze, pct: "0%" },
            r: { scale: squeeze },
            s: { scale: squeeze },
            d: { scale: Math.min(squeeze + 0.15, 1) },
          }}
          glow={30}
        />
      </div>
      <Footnote
        lines={[
          "Zone sizes from English word counts,",
          "not Apple's own model.",
        ]}
        x={64}
        y={1560}
        enterAt={40}
      />
      <MascotSlot pose="point-up" offsetX={300} width={380} />
    </AbsoluteFill>
  );
};

const B4_TAP: React.FC = () => {
  const frame = useCurrentFrame();
  const kbW = 2300;
  const { keys } = keyboardLayout(kbW);
  const hKey = keys.find((k) => k.label === "h")!;
  // place keyboard so the H key sits center-frame
  const left = 540 - (hKey.x + hKey.w / 2) - 0;
  const top = 1000 - (hKey.y + hKey.h / 2);
  const hiAmt = interpolate(frame, [48, 54, 70], [0, 1, 0], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("the"), w("hit region", "box"), w("is"), w("what")],
          [w("actually", "bold", 26), w("catches", "box", 36), w("your"), w("tap.", "bold", 50)],
        ]}
        spreadFrames={28}
      />
      <div style={{ position: "absolute", left, top }}>
        <Keyboard
          width={kbW}
          highlightKey="h"
          highlightAmt={hiAmt}
          zoneOverlay
          zoneLetters={["h"]}
          zoneState={{ h: { scale: 1.35 } }}
          glow={26}
        />
      </div>
      <CharPreview letter="h" x={540} y={905} size={210} enterAt={50} />
      <Finger x={560} y={1065} width={620} enterAt={8} tapAt={48} rotate={-8} />
      <Footnote
        lines={['"Hit region" — Apple\'s name for it.', "US Patent 8,232,973."]}
        x={64}
        y={1700}
        enterAt={60}
      />
    </AbsoluteFill>
  );
};

const B5_MEASURE: React.FC = () => {
  const frame = useCurrentFrame();
  const phoneW = 560;
  const kbInnerW = phoneW * 0.94 - phoneW * 0.06;
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("the"), w("first", "box"), w("iPhone"), w("was"), w("only")],
          [w("320", "box", 30), w("pixels"), w("wide.", "bold", 44)],
        ]}
        spreadFrames={26}
      />
      <div
        style={{
          position: "absolute",
          top: 600,
          left: "50%",
          translate: "-50% 0",
          scale: String(
            interpolate(frame, [0, 10], [0.96, 1], {
              ...clamp,
              easing: Easing.bezier(...EASE),
            }),
          ),
        }}
      >
        <PhoneFrame width={phoneW}>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "3%",
              width: "94%",
              paddingBottom: 20,
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: 24,
                background: theme.bubbleIn,
                borderRadius: 18,
                padding: "10px 16px",
                width: "fit-content",
                margin: "0 0 16px 6px",
              }}
            >
              dinner tonight?
            </div>
            <Keyboard width={kbInnerW} suggestions={["I", "The", "I'm"]} />
          </div>
        </PhoneFrame>
      </div>
      <Measure x={254} y={548} length={572} label="320 px" enterAt={30} labelSize={34} />
      <Measure
        x={262}
        y={1398}
        length={64}
        vertical
        label="44 px"
        enterAt={44}
        labelSize={28}
      />
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 1310,
          textAlign: "left",
          fontSize: 38,
          color: "#fff",
          fontWeight: 700,
          opacity: interpolate(frame, [56, 64], [0, 1], clamp),
        }}
      >
        10 × 44
        <div
          style={{
            color: theme.accentRed,
            scale: String(
              interpolate(frame, [64, 70], [1.18, 1], {
                ...clamp,
                easing: Easing.bezier(...EASE),
              }),
            ),
            opacity: interpolate(frame, [64, 68], [0, 1], clamp),
          }}
        >
          = 440 px
        </div>
      </div>
      <Footnote lines={["Illustrative."]} x={64} y={1700} enterAt={20} />
      <MascotSlot pose="shock" offsetX={-300} width={360} />
    </AbsoluteFill>
  );
};

const B6_ENDCARD: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.max(
    0,
    Math.min(Math.floor((frame - 70) / 4), "so unfair 😤".length),
  );
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("send", "box"), w("this"), w("to"), w("the"), w("friend")],
          [
            w("who", undefined, 28),
            w("blames", "bold", 34),
            w("autocorrect", "box", 42),
            w("for"),
            w("everything.", "bold", 58),
          ],
        ]}
        spreadFrames={34}
      />
      <div
        style={{
          position: "absolute",
          top: 640,
          left: "50%",
          translate: "-50% 0",
          width: 760,
          background: theme.panel,
          borderRadius: 36,
          padding: 36,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          opacity: interpolate(frame, [6, 14], [0, 1], {
            ...clamp,
            easing: Easing.bezier(...EASE),
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 18,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#E02B2B,#2BC06A)",
            }}
          />
          <div style={{ color: "#fff", fontSize: 30, fontWeight: 700 }}>
            Sofia
            <div style={{ color: theme.footnote, fontSize: 22, fontWeight: 400 }}>
              Active now
            </div>
          </div>
        </div>
        {frame > 24 ? <Bubble text="autocorrect again 🙃" /> : null}
        {frame > 44 ? (
          <Bubble text="ok so it was never autocorrect" out />
        ) : null}
        <InputBar text="so unfair 😤" chars={typed} fontSize={28} />
      </div>
      <MascotSlot pose="wave" offsetX={0} width={440} />
    </AbsoluteFill>
  );
};

// ---------- timeline ----------

type Beat = {
  id: string;
  dur: number;
  Comp: React.FC;
  pose?: MascotPose | "hidden";
};

export const BEATS: Beat[] = [
  { id: "hook", dur: 120, Comp: B1_HOOK },
  { id: "explode", dur: 150, Comp: B2_EXPLODE },
  { id: "zones", dur: 130, Comp: B3_ZONES },
  { id: "tap", dur: 130, Comp: B4_TAP },
  { id: "measure", dur: 150, Comp: B5_MEASURE },
  { id: "endcard", dur: 150, Comp: B6_ENDCARD },
];

export const TOTAL_FRAMES = BEATS.reduce((a, b) => a + b.dur, 0);

export const Reel: React.FC = () => {
  let at = 0;
  return (
    <DottedGrid>
      {BEATS.map((b) => {
        const from = at;
        at += b.dur;
        return (
          <Sequence
            key={b.id}
            from={from}
            durationInFrames={b.dur}
            name={b.id}
            layout="absolute-fill"
          >
            <b.Comp />
          </Sequence>
        );
      })}
    </DottedGrid>
  );
};
