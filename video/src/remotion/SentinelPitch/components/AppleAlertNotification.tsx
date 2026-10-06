import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AlertOctagon, ArrowRight } from "lucide-react";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";

interface AppleAlertNotificationProps {
  delay?: number;
  title?: string;
  subtitle?: string;
  latency?: string;
  action?: string;
}

export const AppleAlertNotification: React.FC<AppleAlertNotificationProps> = ({
  delay = 10,
  title = "CRITICAL THRESHOLD BREACH",
  subtitle = "CO₂ climbed to 1,686 ppm in Bay 1. Exposure limit exceeded.",
  latency = "Bay 1 Active",
  action = "Onboard Buzzer Active & Critical Alert Dispatched",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic island drop spring
  const dropSpring = spring({
    frame: frame - delay,
    fps,
    config: APPLE_SPRINGS.pop,
  });

  const translateY = interpolate(dropSpring, [0, 1], [-120, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(dropSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(dropSpring, [0, 1], [0.92, 1], {
    extrapolateRight: "clamp",
  });

  // Soft red pulsating border and icon
  const glow = Math.sin(frame * 0.2) * 0.4 + 0.6;
  const pingPhase = (frame % 30) / 30;

  return (
    <div
      className="relative z-30 w-full max-w-2xl mx-auto rounded-2xl bg-white border border-red-200 p-5 select-none"
      style={{
        fontFamily: APPLE_FONT_FAMILY,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        boxShadow: `0 0 0 ${glow * 3}px rgba(239, 68, 68, 0.12), 0 20px 40px -15px rgba(0,0,0,0.06)`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Red Hazard Icon */}
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 shrink-0">
          <AlertOctagon size={24} />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-red-700 uppercase flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-red-400"
                  style={{
                    transform: `scale(${1 + pingPhase * 1.5})`,
                    opacity: 1 - pingPhase,
                  }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              {title}
            </span>
            <span className="text-xs font-mono font-semibold text-zinc-500 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200">
              {latency}
            </span>
          </div>

          <h4 className="text-base font-bold text-zinc-900 tracking-tight leading-snug">
            {subtitle}
          </h4>

          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-zinc-100 text-xs font-mono text-emerald-700 font-semibold">
            <ArrowRight size={14} />
            <span>{action}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
