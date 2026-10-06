import React from "react";
import { Series } from "remotion";
import { SCENE_DURATIONS } from "./types";
import { AudioLayer } from "./components/AudioLayer";
import { ChaosScene } from "./scenes/01-ChaosScene";
import { MeetSentinelScene } from "./scenes/02-MeetSentinelScene";
import { InfrastructureScene } from "./scenes/03-InfrastructureScene";
import { DetectionEngineScene } from "./scenes/04-DetectionEngineScene";
import { WorkflowScene } from "./scenes/05-WorkflowScene";
import { FleetScaleScene } from "./scenes/06-FleetScaleScene";
import { BrandOutroScene } from "./scenes/07-BrandOutroScene";

export const SentiComposition: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-white select-none overflow-hidden">
      {/* Synchronized 95s Soundtrack Layer */}
      <AudioLayer />

      {/* Structured Scene Sequence */}
      <Series>
        {/* Act 1: The Chaos / Problem (0s - 12s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.CHAOS} name="01-Chaos">
          <ChaosScene />
        </Series.Sequence>

        {/* Act 2: Meet Sentinel Hero Reveal at 13s (12s - 18s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.MEET_SENTINEL} name="02-MeetSentinel">
          <MeetSentinelScene />
        </Series.Sequence>

        {/* Act 3: 3D Console & Edge Infrastructure Connection (18s - 32s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.INFRASTRUCTURE} name="03-Infrastructure">
          <InfrastructureScene />
        </Series.Sequence>

        {/* Act 4: Hazard Verification { critical } & Auto-Dispatch (32s - 50s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.DETECTION} name="04-DetectionEngine">
          <DetectionEngineScene />
        </Series.Sequence>

        {/* Act 5: "You can define the response" & Glassmorphism Workflow (50s - 75s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.WORKFLOW} name="05-Workflow">
          <WorkflowScene />
        </Series.Sequence>

        {/* Act 6: Multi-Bay Synchronized Fleet Scale (75s - 85s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.FLEET} name="06-FleetScale">
          <FleetScaleScene />
        </Series.Sequence>

        {/* Act 7: Hero Brandmark & Deploy CTA Outro (85s - 95s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.OUTRO} name="07-BrandOutro">
          <BrandOutroScene />
        </Series.Sequence>
      </Series>
    </div>
  );
};
