import { Senti } from "./Senti";
import { Composition } from "remotion";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { Main } from "./MyComp/Main";
import { NextLogo } from "./MyComp/NextLogo";
import { SentinelPitch } from "./SentinelPitch";
import {
  FPS,
  HEIGHT,
  TOTAL_DURATION_IN_FRAMES,
  WIDTH,
} from "./SentinelPitch/types";
import { SentinelLaunchAd } from "./SentinelLaunchAd";
import {
  FPS as LAUNCH_AD_FPS,
  HEIGHT as LAUNCH_AD_HEIGHT,
  TOTAL_DURATION_IN_FRAMES as LAUNCH_AD_DURATION_IN_FRAMES,
  WIDTH as LAUNCH_AD_WIDTH,
} from "./SentinelLaunchAd/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SentinelPitch"
        component={SentinelPitch}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SentinelLaunchAd"
        component={SentinelLaunchAd}
        durationInFrames={LAUNCH_AD_DURATION_IN_FRAMES}
        fps={LAUNCH_AD_FPS}
        width={LAUNCH_AD_WIDTH}
        height={LAUNCH_AD_HEIGHT}
      />
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
      <Composition
        id="senti"
        component={Senti}
        durationInFrames={2850}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
