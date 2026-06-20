import React from "react";
import { Composition } from "remotion";
import { VIDEO, FPS, DURATION } from "./lib/theme";
import { Story1 } from "./components/Story1";
import { Story2 } from "./components/Story2";
import { Story3 } from "./components/Story3";

const storyDurationInFrames = DURATION.story * FPS;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Story1"
        component={Story1}
        durationInFrames={storyDurationInFrames}
        fps={FPS}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Story2"
        component={Story2}
        durationInFrames={storyDurationInFrames}
        fps={FPS}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Story3"
        component={Story3}
        durationInFrames={storyDurationInFrames}
        fps={FPS}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
