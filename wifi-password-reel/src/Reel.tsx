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
import { Callout, Footnote } from "./components/Callout";
import { Bubble, InputBar } from "./components/PhoneFrame";
import {
  RouterIcon,
  PhoneIcon,
  WaveArcs,
  Chip,
  DataPanel,
} from "./components/Devices";
import { EASE, theme } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const w = (
  t: string,
  style?: CaptionWord["style"],
  at?: number,
): CaptionWord => ({ t, style, at });

const MONO = "'SF Mono', Consolas, monospace";

/** dashed connection line between the two devices */
const Link: React.FC<{ x1: number; x2: number; y: number; enterAt?: number }> = ({
  x1,
  x2,
  y,
  enterAt = 0,
}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [enterAt, enterAt + 12], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y,
        width: (x2 - x1) * grow,
        borderTop: "3px dashed rgba(255,255,255,0.25)",
      }}
    />
  );
};

// ---------- B1 HOOK ----------
const B1_HOOK: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [52, 62], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("Your"), w("WiFi"), w("password", "box"), w("is")],
          [w("never", "bold"), w("sent."), w("Not"), w("once.", "bold")],
        ]}
        spreadFrames={146}
      />
      <div style={{ position: "absolute", left: 110, top: 660 }}>
        <PhoneIcon width={220} enterAt={4}>
          <div style={{ padding: "60px 18px", color: "#fff", fontFamily: theme.font }}>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}>HomeWiFi</div>
            <div
              style={{
                background: "#1C1C1E",
                border: "1.5px solid #3A3A3C",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 22,
                letterSpacing: 4,
                color: "#D0D0D4",
              }}
            >
              ••••••••
            </div>
            <div
              style={{
                marginTop: 14,
                background: theme.sendBlue,
                borderRadius: 12,
                textAlign: "center",
                padding: "10px 0",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              Join
            </div>
          </div>
        </PhoneIcon>
      </div>
      <div style={{ position: "absolute", left: 660, top: 800 }}>
        <RouterIcon width={330} enterAt={10} />
      </div>
      <Link x1={345} x2={700} y={905} enterAt={18} />
      <WaveArcs x={360} y={905} enterAt={20} size={44} />
      {/* the password trying to cross — crossed out */}
      <div style={{ position: "absolute", left: 540, top: 905, translate: "-50% -50%", zIndex: 10 }}>
        <Chip text="hunter2" fontSize={34} enterAt={34} />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 220 * strike,
            height: 6,
            background: theme.accentRed,
            translate: "-50% -50%",
            rotate: "-14deg",
            borderRadius: 3,
            boxShadow: "0 0 18px rgba(229,57,53,0.6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -54,
            top: -34,
            color: theme.accentRed,
            fontSize: 54,
            fontWeight: 800,
            opacity: strike,
          }}
        >
          ✗
        </div>
      </div>
      <Footnote
        lines={["Illustrative.", "WPA2-Personal shown."]}
        x={64}
        y={1330}
        enterAt={30}
      />
    </AbsoluteFill>
  );
};

// ---------- B2 QUESTION ----------
const B2_QUESTION: React.FC = () => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 14) * 8;
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("So"), w("how"), w("does"), w("it"), w("know", "bold")],
          [w("you"), w("typed"), w("it"), w("right?", "box")],
        ]}
        spreadFrames={72}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 870,
          translate: "-50% 0",
        }}
      >
        <RouterIcon width={460} enterAt={4} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 640 + bob,
          translate: "-50% 0",
          color: "#fff",
          fontSize: 150,
          fontWeight: 800,
          opacity: interpolate(frame, [14, 24], [0, 1], {
            ...clamp,
            easing: Easing.bezier(...EASE),
          }),
          textShadow: "0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        ?
      </div>
      <Callout
        x={330}
        y={1010}
        dx={-110}
        dy={60}
        label="accepts or rejects"
        sub={["in milliseconds"]}
        enterAt={40}
        fontSize={30}
        labelX={-266}
      />
      <MascotSlot pose="confused" offsetX={-10} width={500} />
    </AbsoluteFill>
  );
};

// ---------- B3 KEY DERIVATION ----------
const B3_DERIVE: React.FC = () => {
  const frame = useCurrentFrame();
  const rounds = Math.round(
    interpolate(frame, [34, 86], [1, 4096], {
      ...clamp,
      easing: Easing.bezier(0.3, 0, 0.7, 1),
    }),
  );
  const Arrow: React.FC<{ at: number }> = ({ at }) => (
    <div
      style={{
        textAlign: "center",
        color: theme.footnote,
        fontSize: 40,
        margin: "10px 0",
        opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
      }}
    >
      ↓
    </div>
  );
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("Both"), w("sides"), w("turn"), w("it"), w("into")],
          [w("a"), w("secret key", "box"), w("—"), w("before", "bold"), w("connecting.")],
        ]}
        spreadFrames={128}
      />
      <div style={{ position: "absolute", left: "50%", top: 620, translate: "-50% 0" }}>
        <DataPanel width={840} title="key derivation" enterAt={4}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: theme.footnote, fontSize: 26, marginBottom: 10 }}>password</div>
            <Chip text="hunter2" fontSize={36} enterAt={14} />
            <Arrow at={24} />
            <div
              style={{
                color: "#E8E8EA",
                fontSize: 34,
                opacity: interpolate(frame, [30, 38], [0, 1], clamp),
                fontFamily: MONO,
              }}
            >
              PBKDF2 ×{" "}
              <span style={{ color: theme.zoneAmberHi, fontWeight: 700 }}>
                {rounds.toLocaleString("en-US")}
              </span>{" "}
              rounds
            </div>
            <Arrow at={88} />
            <div style={{ color: theme.footnote, fontSize: 26, margin: "4px 0 10px" }}>
              the key — never transmitted
            </div>
            <Chip text="c2 9f 41 7b d8 03 6e a1 …" fontSize={32} amber enterAt={96} />
          </div>
        </DataPanel>
      </div>
      <Footnote
        lines={["PBKDF2-SHA1, network name as salt (WPA2).", "Your router did the same math when you set it up."]}
        x={64}
        y={1420}
        enterAt={100}
      />
      <MascotSlot pose="point-up" offsetX={290} width={470} />
    </AbsoluteFill>
  );
};

// ---------- B4 HANDSHAKE ----------
const B4_HANDSHAKE: React.FC = () => {
  const frame = useCurrentFrame();
  const aX = interpolate(frame, [26, 48], [700, 330], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const sX = interpolate(frame, [58, 80], [330, 700], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("then"), w("they"), w("swap"), w("random numbers", "box"), w("—")],
          [w("never", "bold"), w("the"), w("key.", "bold")],
        ]}
        spreadFrames={114}
      />
      <div style={{ position: "absolute", left: 120, top: 700 }}>
        <PhoneIcon width={190} enterAt={4} />
      </div>
      <div style={{ position: "absolute", left: 700, top: 830 }}>
        <RouterIcon width={290} enterAt={8} />
      </div>
      <Link x1={330} x2={720} y={940} enterAt={14} />
      {/* ANonce: router -> phone */}
      {frame >= 26 && frame < 58 ? (
        <div style={{ position: "absolute", left: aX, top: 880, translate: "-50% 0", zIndex: 10 }}>
          <Chip text="ANonce 7f 20 9c" fontSize={27} enterAt={26} />
        </div>
      ) : null}
      {/* SNonce: phone -> router */}
      {frame >= 58 && frame < 92 ? (
        <div style={{ position: "absolute", left: sX, top: 960, translate: "-50% 0", zIndex: 10 }}>
          <Chip text="SNonce b4 11 e0" fontSize={27} enterAt={58} />
        </div>
      ) : null}
      {/* both derive the same key locally */}
      <div style={{ position: "absolute", left: 215, top: 1180, translate: "-50% 0" }}>
        <Chip text="PTK 9f c2 d4 88 …" fontSize={27} amber enterAt={96} />
      </div>
      <div style={{ position: "absolute", left: 845, top: 1180, translate: "-50% 0" }}>
        <Chip text="PTK 9f c2 d4 88 …" fontSize={27} amber enterAt={104} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1300,
          translate: "-50% 0",
          color: "#fff",
          fontSize: 34,
          fontWeight: 700,
          opacity: interpolate(frame, [112, 120], [0, 1], clamp),
          textAlign: "center",
        }}
      >
        same key, built on each side
        <div style={{ color: theme.footnote, fontSize: 26, fontWeight: 400, marginTop: 8 }}>
          password + both random numbers → key
        </div>
      </div>
      <Footnote lines={["The 4-way handshake (WPA2)."]} x={64} y={1460} enterAt={40} />
    </AbsoluteFill>
  );
};

// ---------- B5 MIC ----------
const B5_MIC: React.FC = () => {
  const frame = useCurrentFrame();
  const l = interpolate(frame, [16, 34], [-420, 0], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const r = interpolate(frame, [24, 42], [420, 0], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  const check = interpolate(frame, [64, 70, 76], [0, 1.12, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE),
  });
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("plus"), w("a"), w("fingerprint", "box"), w("only"), w("the")],
          [w("right", "bold"), w("password"), w("can"), w("make.", "bold")],
        ]}
        spreadFrames={114}
      />
      <div
        style={{
          position: "absolute",
          top: 820,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div style={{ translate: `${l}px 0px`, textAlign: "center" }}>
          <div style={{ color: theme.footnote, fontSize: 26, marginBottom: 10 }}>your phone sends</div>
          <Chip text="MIC a7 31 90 55" fontSize={30} enterAt={16} />
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: 54,
            fontWeight: 700,
            opacity: interpolate(frame, [48, 56], [0, 1], clamp),
          }}
        >
          =
        </div>
        <div style={{ translate: `${r}px 0px`, textAlign: "center" }}>
          <div style={{ color: theme.footnote, fontSize: 26, marginBottom: 10 }}>router expects</div>
          <Chip text="MIC a7 31 90 55" fontSize={30} enterAt={24} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1060,
          translate: "-50% 0",
          scale: String(check),
          opacity: check > 0.01 ? 1 : 0,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(52,199,89,0.15)",
          border: "4px solid #34C759",
          color: "#34C759",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 80,
          fontWeight: 800,
          boxShadow: "0 0 50px rgba(52,199,89,0.35)",
        }}
      >
        ✓
      </div>
      <Footnote
        lines={["MIC — Message Integrity Code.", "Wrong password → wrong MIC → rejected."]}
        x={64}
        y={1400}
        enterAt={80}
      />
      <MascotSlot pose="thumbs-up" offsetX={300} width={470} />
    </AbsoluteFill>
  );
};

// ---------- B6 OFFLINE CRACKING ----------
const B6_CRACK: React.FC = () => {
  const frame = useCurrentFrame();
  const guesses = [
    "password1",
    "qwerty123",
    "iloveyou",
    "dragon12",
    "sunshine1",
  ];
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("Hackers"), w("can"), w("still"), w("record", "box"), w("it,")],
          [w("and"), w("guess", "bold"), w("offline.", "box")],
        ]}
        spreadFrames={116}
      />
      <div style={{ position: "absolute", left: "50%", top: 640, translate: "-50% 0" }}>
        <DataPanel width={840} title="captured-handshake.cap — guessing" enterAt={6}>
          {guesses.map((g, i) => (
            <div
              key={g}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 32,
                color: "#C8C8CC",
                padding: "8px 4px",
                opacity: interpolate(frame, [26 + i * 9, 32 + i * 9], [0, 1], clamp),
              }}
            >
              <span>{g}</span>
              <span style={{ color: "#FF6B6B" }}>✗</span>
            </div>
          ))}
          <div
            style={{
              marginTop: 18,
              paddingTop: 18,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: 30,
              color: theme.zoneAmberHi,
              opacity: interpolate(frame, [80, 88], [0, 1], clamp),
            }}
          >
            ≈ 100,000 guesses / sec
            <div style={{ color: theme.footnote, fontSize: 25, marginTop: 6 }}>
              no router needed — your password strength is the only wall
            </div>
          </div>
        </DataPanel>
      </div>
      <Footnote
        lines={["This is why length beats cleverness.", "4 random words > 1 clever word."]}
        x={64}
        y={1440}
        enterAt={94}
      />
      <MascotSlot pose="shock" offsetX={300} width={460} />
    </AbsoluteFill>
  );
};

// ---------- B7 WPA3 ----------
const B7_WPA3: React.FC = () => {
  const frame = useCurrentFrame();
  const eras = [
    { name: "WEP", year: "1997" },
    { name: "WPA", year: "2003" },
    { name: "WPA2", year: "2004" },
    { name: "WPA3", year: "2018", hot: true },
  ];
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("That's"), w("why"), w("WPA3", "box"), w("makes")],
          [w("every"), w("guess"), w("ask", "bold"), w("the"), w("router.", "bold")],
        ]}
        spreadFrames={127}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 880,
          height: 3,
          background: "rgba(255,255,255,0.18)",
          scale: `${interpolate(frame, [8, 20], [0, 1], { ...clamp, easing: Easing.bezier(...EASE) })} 1`,
        }}
      />
      {eras.map((e, i) => {
        const at = 18 + i * 12;
        const x = 180 + i * 240;
        const s = interpolate(frame, [at, at + 4, at + 8], [0, 1.08, 1], {
          ...clamp,
          easing: Easing.bezier(...EASE),
        });
        return (
          <div
            key={e.name}
            style={{
              position: "absolute",
              left: x,
              top: 880,
              translate: "-50% -50%",
              scale: String(s),
              opacity: s > 0.01 ? 1 : 0,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: e.hot ? 40 : 32,
                fontWeight: 700,
                color: e.hot ? theme.zoneAmberHi : "#C8C8CC",
                background: e.hot ? "rgba(232,163,61,0.16)" : theme.panel,
                border: `2.5px solid ${e.hot ? theme.zoneAmberHi : "rgba(255,255,255,0.18)"}`,
                borderRadius: 18,
                padding: e.hot ? "18px 26px" : "12px 20px",
                boxShadow: e.hot ? `0 0 40px ${theme.zoneGlow}` : undefined,
              }}
            >
              {e.name}
            </div>
            <div style={{ color: theme.footnote, fontSize: 26, marginTop: 12 }}>{e.year}</div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1080,
          translate: "-50% 0",
          textAlign: "center",
          color: "#fff",
          fontSize: 34,
          fontWeight: 700,
          opacity: interpolate(frame, [70, 80], [0, 1], clamp),
          width: 900,
        }}
      >
        offline guessing blocked
        <div style={{ color: theme.footnote, fontSize: 26, fontWeight: 400, marginTop: 8 }}>
          each guess needs a live exchange — one at a time
        </div>
      </div>
      <Footnote lines={["WPA3-SAE, a.k.a. Dragonfly handshake."]} x={64} y={1420} enterAt={86} />
      <MascotSlot pose="celebrate" offsetX={0} width={500} />
    </AbsoluteFill>
  );
};

// ---------- B8 CTA ----------
const B8_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, Math.min(Math.floor((frame - 76) / 4), "we need to talk".length));
  return (
    <AbsoluteFill>
      <Captions
        lines={[
          [w("send", "box"), w("this"), w("to"), w("the"), w("friend")],
          [w("whose"), w("password"), w("is"), w("12345678.", "bold")],
        ]}
        spreadFrames={145}
      />
      <div
        style={{
          position: "absolute",
          top: 660,
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
              background: "linear-gradient(135deg,#E8A33D,#3B82F6)",
            }}
          />
          <div style={{ color: "#fff", fontSize: 30, fontWeight: 700 }}>
            Alex
            <div style={{ color: theme.footnote, fontSize: 22, fontWeight: 400 }}>Active now</div>
          </div>
        </div>
        {frame > 26 ? <Bubble text="what's the wifi password?" /> : null}
        {frame > 48 ? <Bubble text="12345678 lol" /> : null}
        <InputBar text="we need to talk" chars={typed} fontSize={28} />
      </div>
      <MascotSlot pose="wave" offsetX={0} width={510} />
    </AbsoluteFill>
  );
};

// ---------- timeline ----------

type Beat = { id: string; dur: number; Comp: React.FC; vo?: string };

// durations = voiceover clip length + breathing room
// VO: Microsoft en-IN-PrabhatNeural (Indian English) via edge-tts, rate +12%
export const BEATS: Beat[] = [
  { id: "hook", dur: 186, Comp: B1_HOOK, vo: "b1" },
  { id: "question", dur: 100, Comp: B2_QUESTION, vo: "b2" },
  { id: "derive", dur: 166, Comp: B3_DERIVE, vo: "b3" },
  { id: "handshake", dur: 152, Comp: B4_HANDSHAKE, vo: "b4" },
  { id: "mic", dur: 145, Comp: B5_MIC, vo: "b5" },
  { id: "crack", dur: 152, Comp: B6_CRACK, vo: "b6" },
  { id: "wpa3", dur: 165, Comp: B7_WPA3, vo: "b7" },
  { id: "cta", dur: 200, Comp: B8_CTA, vo: "b8" },
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
            {b.vo ? <Audio src={staticFile(`vo/${b.vo}.mp3`)} /> : null}
            <b.Comp />
          </Sequence>
        );
      })}
    </DottedGrid>
  );
};
