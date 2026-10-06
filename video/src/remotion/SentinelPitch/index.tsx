import React from "react";
import { Sequence } from "remotion";
import { SCENES } from "./types";
import { AudioLayer } from "./components/AudioLayer";
import { APPLE_FONT_FAMILY } from "./apple-theme";

import { HookScene } from "./scenes/01-HookScene";
import { DangerSpikeScene } from "./scenes/02-DangerSpikeScene";
import { TurnBrandScene } from "./scenes/03-TurnBrandScene";
import { RealtimeTelemetryScene } from "./scenes/04-RealtimeTelemetryScene";
import { AlertEngineScene } from "./scenes/05-AlertEngineScene";
import { FleetScaleScene } from "./scenes/06-FleetScaleScene";
import { ComplianceAuditScene } from "./scenes/07-ComplianceAuditScene";
import { ArchitectureBentoScene } from "./scenes/08-ArchitectureBentoScene";
import { OutroPitchScene } from "./scenes/09-OutroPitchScene";
import { RealOutroScene } from "./scenes/10-RealOutroScene";

export const SentinelPitch: React.FC = () => {
  return (
    <div
      className="w-full h-full bg-[#fafafa] text-[#18181b] overflow-hidden select-none"
      style={{ fontFamily: APPLE_FONT_FAMILY }}
    >
      {/* 90-second rich electronic soundscape */}
      <AudioLayer />

      {/* 01: The Silent Hazard Hook (0.0s - 9.5s) */}
      <Sequence
        from={SCENES.HOOK.start}
        durationInFrames={SCENES.HOOK.duration}
        name={SCENES.HOOK.name}
      >
        <HookScene />
      </Sequence>

      {/* 02: Brand Reveal — Introducing Sentinel (9.5s - 18.0s) */}
      <Sequence
        from={SCENES.TURN_BRAND.start}
        durationInFrames={SCENES.TURN_BRAND.duration}
        name={SCENES.TURN_BRAND.name}
      >
        <TurnBrandScene />
      </Sequence>

      {/* 03: 1,686 ppm Danger Breach & Instant Interlock (18.0s - 27.0s) */}
      <Sequence
        from={SCENES.DANGER_SPIKE.start}
        durationInFrames={SCENES.DANGER_SPIKE.duration}
        name={SCENES.DANGER_SPIKE.name}
      >
        <DangerSpikeScene />
      </Sequence>

      {/* 04: Real-Time Telemetry Engine 50Hz (27s - 37s) */}
      <Sequence
        from={SCENES.REALTIME_TELEMETRY.start}
        durationInFrames={SCENES.REALTIME_TELEMETRY.duration}
        name={SCENES.REALTIME_TELEMETRY.name}
      >
        <RealtimeTelemetryScene />
      </Sequence>

      {/* 05: Two-Tier Intelligent Safety Alerting (37s - 47s) */}
      <Sequence
        from={SCENES.ALERT_ENGINE.start}
        durationInFrames={SCENES.ALERT_ENGINE.duration}
        name={SCENES.ALERT_ENGINE.name}
      >
        <AlertEngineScene />
      </Sequence>

      {/* 06: Fleet Scale & Provisioning (47s - 57s) */}
      <Sequence
        from={SCENES.FLEET_SCALE.start}
        durationInFrames={SCENES.FLEET_SCALE.duration}
        name={SCENES.FLEET_SCALE.name}
      >
        <FleetScaleScene />
      </Sequence>

      {/* 07: Cryptographic Regulatory Compliance Ledger (57s - 67s) */}
      <Sequence
        from={SCENES.COMPLIANCE_AUDIT.start}
        durationInFrames={SCENES.COMPLIANCE_AUDIT.duration}
        name={SCENES.COMPLIANCE_AUDIT.name}
      >
        <ComplianceAuditScene />
      </Sequence>

      {/* 08: Ground-Up Full Stack Architecture (67s - 79s) */}
      <Sequence
        from={SCENES.ARCHITECTURE_BENTO.start}
        durationInFrames={SCENES.ARCHITECTURE_BENTO.duration}
        name={SCENES.ARCHITECTURE_BENTO.name}
      >
        <ArchitectureBentoScene />
      </Sequence>

      {/* 09: Climax & Call to Action (79s - 86s) */}
      <Sequence
        from={SCENES.OUTRO_PITCH.start}
        durationInFrames={SCENES.OUTRO_PITCH.duration}
        name={SCENES.OUTRO_PITCH.name}
      >
        <OutroPitchScene />
      </Sequence>

      {/* 10: Real Outro — Brandmark & Text Finale (86s - 90s) */}
      <Sequence
        from={SCENES.REAL_OUTRO.start}
        durationInFrames={SCENES.REAL_OUTRO.duration}
        name={SCENES.REAL_OUTRO.name}
      >
        <RealOutroScene />
      </Sequence>
    </div>
  );
};
