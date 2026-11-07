import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";

/** iMessage-style chat bubble. */
export const Bubble: React.FC<{
  text: string;
  out?: boolean;
  fontSize?: number;
}> = ({ text, out = false, fontSize = 30 }) => (
  <div
    style={{
      alignSelf: out ? "flex-end" : "flex-start",
      background: out ? theme.sendBlue : theme.bubbleIn,
      color: "#fff",
      fontSize,
      padding: `${fontSize * 0.45}px ${fontSize * 0.75}px`,
      borderRadius: fontSize,
      maxWidth: "75%",
      lineHeight: 1.3,
    }}
  >
    {text}
  </div>
);

/** Message input bar with live-typed text + blinking caret. */
export const InputBar: React.FC<{
  text: string;
  /** chars revealed so far (typewriter); default all */
  chars?: number;
  width?: number;
  fontSize?: number;
}> = ({ text, chars, width, fontSize = 30 }) => {
  const frame = useCurrentFrame();
  const shown = text.slice(0, chars ?? text.length);
  const caretOn = frame % 30 < 16;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width,
      }}
    >
      <div
        style={{
          width: fontSize * 1.3,
          height: fontSize * 1.3,
          borderRadius: "50%",
          background: "#3A3A3C",
          color: "#A8A8AD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: fontSize * 0.9,
          flexShrink: 0,
        }}
      >
        +
      </div>
      <div
        style={{
          flex: 1,
          border: "1.5px solid #3A3A3C",
          borderRadius: fontSize,
          padding: `${fontSize * 0.35}px ${fontSize * 0.6}px`,
          color: "#fff",
          fontSize,
          display: "flex",
          alignItems: "center",
          minHeight: fontSize * 1.2,
        }}
      >
        <span>{shown}</span>
        <span
          style={{
            width: 2.5,
            height: fontSize * 1.05,
            background: theme.sendBlue,
            marginLeft: 2,
            opacity: caretOn ? 1 : 0,
          }}
        />
        <div style={{ flex: 1 }} />
        {shown.length > 0 ? (
          <div
            style={{
              width: fontSize * 1.15,
              height: fontSize * 1.15,
              borderRadius: "50%",
              background: theme.sendBlue,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: fontSize * 0.7,
              fontWeight: 700,
            }}
          >
            ↑
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Dark-titanium iPhone frame with a screen slot. */
export const PhoneFrame: React.FC<{
  width: number;
  children: React.ReactNode;
}> = ({ width, children }) => {
  const h = width * 2.05;
  const r = width * 0.16;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: r,
        background: "#1C1C1E",
        border: `${width * 0.012}px solid #3C3C40`,
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 3px rgba(255,255,255,0.06)",
        padding: width * 0.03,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: r * 0.82,
          background: "#000",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: width * 0.035,
            left: "50%",
            translate: "-50% 0",
            width: width * 0.3,
            height: width * 0.085,
            borderRadius: width * 0.05,
            background: "#111",
            zIndex: 5,
          }}
        />
        {children}
      </div>
    </div>
  );
};
