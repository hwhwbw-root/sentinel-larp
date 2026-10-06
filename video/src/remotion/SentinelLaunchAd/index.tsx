import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import "./load-fonts";
import { AccessScene } from "./scenes/AccessScene";
import { AlertsScene, ALERT_TRIGGER_FRAME } from "./scenes/AlertsScene";
import { ColdOpenScene } from "./scenes/ColdOpenScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { HistoryScene } from "./scenes/HistoryScene";
import { OutroScene } from "./scenes/OutroScene";
import { RecapMontageScene } from "./scenes/RecapMontageScene";
import { RevealScene } from "./scenes/RevealScene";
import { SecurityScene } from "./scenes/SecurityScene";
import { TitleCardScene } from "./scenes/TitleCardScene";
import { COLORS, SCENE_DURATIONS, SCENES, TRANSITION_DURATION } from "./theme";

const T = linearTiming({ durationInFrames: TRANSITION_DURATION });

const Whoosh: React.FC<{ at: number }> = ({ at }) => (
  <Sequence from={at} durationInFrames={30} layout="none">
    <Audio src={staticFile("audio/whoosh.wav")} volume={0.4} />
  </Sequence>
);

const Blip: React.FC<{ at: number }> = ({ at }) => (
  <Sequence from={at} durationInFrames={10} layout="none">
    <Audio src={staticFile("audio/blip.wav")} volume={0.3} />
  </Sequence>
);

export const SentinelLaunchAd: React.FC = () => {
  const recapFlashes = [0, 55, 110, 165, 220, 275].map((f) => SCENES.recapMontage.start + f);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <Audio src={staticFile("audio/apple_beat.mp3")} loop volume={0.22} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.coldOpen}>
          <ColdOpenScene durationInFrames={SCENE_DURATIONS.coldOpen} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.titleCard}>
          <TitleCardScene durationInFrames={SCENE_DURATIONS.titleCard} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hardwareReveal}>
          <RevealScene durationInFrames={SCENE_DURATIONS.hardwareReveal} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.dashboardReveal}>
          <DashboardScene durationInFrames={SCENE_DURATIONS.dashboardReveal} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.alerts}>
          <AlertsScene durationInFrames={SCENE_DURATIONS.alerts} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.history}>
          <HistoryScene durationInFrames={SCENE_DURATIONS.history} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.security}>
          <SecurityScene durationInFrames={SCENE_DURATIONS.security} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.access}>
          <AccessScene durationInFrames={SCENE_DURATIONS.access} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={wipe()} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.recapMontage}>
          <RecapMontageScene durationInFrames={SCENE_DURATIONS.recapMontage} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={T} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <OutroScene durationInFrames={SCENE_DURATIONS.outro} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Audio cues, positioned at each scene's actual absolute start frame */}
      <Whoosh at={SCENES.titleCard.start} />
      <Whoosh at={SCENES.dashboardReveal.start} />
      <Whoosh at={SCENES.security.start} />
      <Whoosh at={SCENES.recapMontage.start} />
      <Whoosh at={SCENES.outro.start} />

      <Blip at={SCENES.hardwareReveal.start + 330} />
      {recapFlashes.map((f) => (
        <Blip key={f} at={f} />
      ))}

      <Sequence from={SCENES.alerts.start + ALERT_TRIGGER_FRAME} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/alarm.wav")} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};
