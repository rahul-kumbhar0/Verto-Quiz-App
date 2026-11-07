import React from "react";
import { Composition } from "remotion";
import { Reel, TOTAL_FRAMES } from "./Reel";
import { FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WifiReel"
      component={Reel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
