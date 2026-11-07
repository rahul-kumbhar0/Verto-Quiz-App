import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Reel, TOTAL_FRAMES } from "./Reel";
import { MascotBoard } from "./MascotBoard";
import { Studio3D } from "./components/Studio3D";
import { DottedGrid } from "./components/DottedGrid";
import { FPS, H, W } from "./theme";

const Demo3D: React.FC = () => (
  <DottedGrid>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Studio3D width={980} height={980} dist={8}>
        <mesh>
          <torusGeometry args={[1.5, 0.62, 32, 96]} />
          <meshStandardMaterial color="#141414" roughness={0.5} metalness={0.15} />
        </mesh>
      </Studio3D>
    </AbsoluteFill>
  </DottedGrid>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TapToPay"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="Studio3DDemo"
        component={Demo3D}
        durationInFrames={90}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MascotBoard"
        component={MascotBoard}
        durationInFrames={60}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
