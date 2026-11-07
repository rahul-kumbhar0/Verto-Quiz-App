import React from "react";
import { AbsoluteFill } from "remotion";
import { Mascot, MascotPose } from "./components/Mascot";
import { theme } from "./theme";

const ALL: MascotPose[] = [
  "idle",
  "point-up",
  "point-side",
  "shrug",
  "facepalm",
  "thumbs-up",
  "confused",
  "celebrate",
  "ok-sign",
  "wave",
  "shock",
  "stop",
  "arms-crossed",
  "hold",
];

/** Reference board of every mascot pose (for stills / tuning). */
export const MascotBoard: React.FC = () => (
  <AbsoluteFill
    style={{
      background: theme.bg,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignContent: "flex-start",
      fontFamily: theme.font,
    }}
  >
    {ALL.map((p) => (
      <div key={p} style={{ width: 270, height: 480, position: "relative", overflow: "hidden" }}>
        <div style={{ color: "#888", fontSize: 22, textAlign: "center", paddingTop: 8 }}>{p}</div>
        <div style={{ position: "absolute", bottom: -20, left: "50%", translate: "-50% 0" }}>
          <Mascot
            pose={p}
            width={240}
            prop={
              p === "hold" ? (
                <rect x={-30} y={-40} width={60} height={60} rx={10} fill="#3B82F6" />
              ) : undefined
            }
          />
        </div>
      </div>
    ))}
  </AbsoluteFill>
);
