import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, Img } from "remotion";
import { AnimatedText, StaggeredMotion, Scene3D, Element3D } from "remotion-bits";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";
import { SentinelAtmosphere } from "../components/SentinelAtmosphere";

export const OutroPitchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame: frame - 10, fps, config: APPLE_SPRINGS.snappy });
  const cardSpring = spring({ frame: frame - 45, fps, config: APPLE_SPRINGS.smooth });

  // Outro fade to black at the end of pitch slide
  const fadeOut = interpolate(frame, [190, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="relative w-full h-full bg-[#fafafa] flex items-center justify-center px-16 py-12 overflow-hidden select-none"
      style={{
        fontFamily: APPLE_FONT_FAMILY,
        opacity: fadeOut,
      }}
    >
      {/* Dynamic Remotion-Bits Particle Atmosphere */}
      <SentinelAtmosphere intensity={0.7} />

      {/* Subtle Tone */}
      <div
        className="absolute w-[1200px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 50%, rgba(47, 111, 237, 0.04) 0%, rgba(250, 250, 250, 0) 70%)",
        }}
      />

      {/* Asymmetrical 12-Column Layout: Brand & Pitch on LEFT, Deploy CTA on RIGHT */}
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN (Col 7): Brand, Hero Kinetic Headline, Pitch Statement */}
        <div className="col-span-7 flex flex-col items-start pr-4">
          {/* Real Sentinel Logo */}
          <div
            className="p-4 rounded-2xl bg-white border border-zinc-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] mb-6 flex items-center gap-4"
            style={{
              opacity: interpolate(logoSpring, [0, 1], [0, 1]),
              transform: `scale(${interpolate(logoSpring, [0, 1], [0.85, 1])})`,
            }}
          >
            <Img
              src={staticFile("branding/sentinel-logo.svg")}
              alt="Sentinel Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="text-sm font-mono font-bold text-zinc-900 tracking-tight">
                SENTINEL LIFE-SAFETY
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                CO₂ &amp; H₂ GAS MONITORING
              </div>
            </div>
          </div>

          {/* Hero Pitch Headline using Remotion Bits AnimatedText */}
          <AnimatedText
            className="text-6xl font-black text-zinc-900 tracking-tight leading-[1.1] max-w-2xl text-left"
            transition={{
              y: [30, 0],
              blur: [8, 0],
              opacity: [0, 1],
              split: "word",
              splitStagger: 2,
              delay: 15,
              duration: 25,
              easing: "easeOutCubic",
            }}
          >
            Never miss a dangerous gas leak.
          </AnimatedText>

          <AnimatedText
            className="text-xl text-zinc-500 font-normal mt-5 leading-relaxed max-w-xl text-left"
            style={{ whiteSpace: "normal" }}
            transition={{
              y: [20, 0],
              opacity: [0, 1],
              split: "word",
              splitStagger: 1,
              delay: 35,
              duration: 30,
              easing: "easeOutCubic",
            }}
          >
            Protect your team. Track CO₂ and H₂ gas in real time. Get instant alarms before invisible leaks become emergencies.
          </AnimatedText>

          {/* Key Value Stats using Remotion Bits StaggeredMotion */}
          <StaggeredMotion
            className="flex items-center gap-4 mt-8"
            transition={{
              opacity: [0, 1],
              y: [15, 0],
              delay: 50,
              duration: 25,
              stagger: 6,
              easing: "easeOutCubic",
            }}
          >
            <div className="px-4 py-2 rounded-xl bg-white border border-zinc-200/60 shadow-sm text-center">
              <div className="text-lg font-black text-red-600 font-mono">CO₂ &amp; H₂</div>
              <div className="text-[11px] text-zinc-500 font-medium">Gas Detection</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-zinc-200/60 shadow-sm text-center">
              <div className="text-lg font-black text-[#2f6fed] font-mono">Instant</div>
              <div className="text-[11px] text-zinc-500 font-medium">Loud Device Siren</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-zinc-200/60 shadow-sm text-center">
              <div className="text-lg font-black text-emerald-600 font-mono">1-Click</div>
              <div className="text-[11px] text-zinc-500 font-medium">CSV Safety Reports</div>
            </div>
          </StaggeredMotion>
        </div>

        {/* RIGHT COLUMN (Col 5): Deploy CTA Card using Remotion Bits Scene3D */}
        <div className="col-span-5 h-[480px] relative flex items-center justify-center">
          <Scene3D perspective={1200} className="w-full h-full">
            <Element3D
              centered={true}
              rotateY={-6}
              rotateX={3}
              z={interpolate(cardSpring, [0, 1], [-40, 20])}
              y={interpolate(cardSpring, [0, 1], [30, 0])}
              className="w-[420px]"
              style={{
                opacity: interpolate(cardSpring, [0, 1], [0, 1]),
              }}
            >
              <div className="p-9 rounded-[2.5rem] bg-white border border-zinc-200/60 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.08)] w-full flex flex-col items-center">
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#2f6fed] mb-2">
                  FACILITY AIR SAFETY
                </div>
                <div className="text-3xl font-black text-zinc-900 tracking-tight mb-6 text-center">
                  Get Sentinel
                </div>

                <div className="flex items-center justify-between w-full py-4 px-6 rounded-2xl bg-[#2f6fed] text-white text-base font-bold shadow-[0_10px_25px_-5px_rgba(47,111,237,0.3)]">
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </div>

                <StaggeredMotion
                  className="space-y-3 mt-6 w-full pt-4 border-t border-zinc-100 text-xs text-zinc-600 font-medium"
                  transition={{
                    opacity: [0, 1],
                    y: [10, 0],
                    delay: 60,
                    duration: 20,
                    stagger: 8,
                    easing: "easeOutCubic",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Continuous CO₂ &amp; H₂ Gas Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                    <span>Loud Device Siren (Works Without WiFi)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-[#2f6fed] shrink-0" />
                    <span>Automatic Logs &amp; 1-Click CSV Export</span>
                  </div>
                </StaggeredMotion>
              </div>
            </Element3D>
          </Scene3D>
        </div>
      </div>
    </div>
  );
};
