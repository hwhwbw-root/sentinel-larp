import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, Img } from "remotion";
import { AnimatedText, Particles, Spawner, Behavior } from "remotion-bits";
import { SentinelAtmosphere } from "../components/SentinelAtmosphere";
import { APPLE_FONT_FAMILY, APPLE_SPRINGS } from "../apple-theme";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cinematic Iris / Shutter Aperture Opening (Frames 0 - 32)
  const irisSpring = spring({
    frame: frame - 4,
    fps,
    config: {
      damping: 16,
      mass: 1.1,
      stiffness: 50,
    },
  });

  // Aperture radius in pixels (reaches 1350px to clear entire 1920x1080 screen)
  const apertureRadius = interpolate(irisSpring, [0, 1], [0, 1380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Mechanical shutter blade rotation (smooth 30deg counter-twist as aperture unlocks)
  const shutterRotate = interpolate(irisSpring, [0, 1], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Electric blue aperture ring glow (stays prominent until iris clears screen perimeter)
  const shutterRingOpacity = interpolate(irisSpring, [0, 0.08, 0.85, 1], [0, 1, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dark obsidian overlay opacity (fades cleanly once canvas is unveiled)
  const shutterOverlayOpacity = interpolate(irisSpring, [0, 0.9, 1], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brand Logo spring entrance coordinated with iris opening
  const logoSpring = spring({
    frame: frame - 8,
    fps,
    config: APPLE_SPRINGS.snappy,
  });

  // Smooth exit fade for all scene elements before transitioning to Introducing Sentinel
  const hookExitFade = interpolate(frame, [270, 285], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="relative w-full h-full bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        fontFamily: APPLE_FONT_FAMILY,
      }}
    >
      {/* Subtle Ambient Tone */}
      <div
        className="absolute w-[1200px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(47, 111, 237, 0.04) 0%, rgba(250, 250, 250, 0) 70%)",
        }}
      />

      {/* Subtle Studio Grid Floor matching App */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Remotion Bits Aperture Radial Particle Shockwave (Frames 4 - 35) */}
      {frame < 36 && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          <Particles startFrame={4}>
            <Spawner
              rate={8}
              max={40}
              area={{ width: 140, height: 140 }}
              position={{ x: 960, y: 540 }}
              lifespan={30}
              velocity={{ x: 0, y: 0, varianceX: 5.2, varianceY: 5.2 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#2f6fed] shadow-[0_0_12px_rgba(47,111,237,1)]" />
              <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
            </Spawner>
            <Behavior
              wiggle={{ magnitude: 2.0, frequency: 0.14 }}
              opacity={[0, 1, 0]}
              scale={[0.4, 2.2, 0.1]}
            />
          </Particles>
        </div>
      )}

      {/* Cinematic Obsidian Shutter Aperture Overlay (Frames 0 - 35) */}
      {frame < 36 && (
        <div
          className="absolute inset-0 pointer-events-none z-50 w-full h-full"
          style={{ opacity: shutterOverlayOpacity }}
        >
          <svg
            viewBox="0 0 1920 1080"
            className="w-full h-full absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <mask id="iris-aperture-mask">
                <rect width="1920" height="1080" fill="white" />
                <circle cx="960" cy="540" r={apertureRadius} fill="black" />
              </mask>
            </defs>

            {/* Obsidian Dark Background with circular cutout */}
            <rect
              width="1920"
              height="1080"
              fill="#09090b"
              mask="url(#iris-aperture-mask)"
            />

            {/* Glowing Electric Blue Aperture Rim */}
            {apertureRadius > 2 && shutterRingOpacity > 0.01 && (
              <>
                <circle
                  cx="960"
                  cy="540"
                  r={apertureRadius}
                  fill="none"
                  stroke="#2f6fed"
                  strokeWidth="3.5"
                  opacity={shutterRingOpacity}
                />
                <circle
                  cx="960"
                  cy="540"
                  r={apertureRadius}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="10"
                  opacity={shutterRingOpacity * 0.4}
                />

                {/* Inner Concentric Optic Ring */}
                <circle
                  cx="960"
                  cy="540"
                  r={apertureRadius * 0.72}
                  fill="none"
                  stroke="#2f6fed"
                  strokeWidth="1.5"
                  strokeDasharray="8 10"
                  opacity={shutterRingOpacity * 0.6}
                />

                {/* Rotating Shutter Blade Tick Markings */}
                <g
                  transform={`rotate(${shutterRotate} 960 540)`}
                  opacity={shutterRingOpacity}
                >
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const x1 = 960 + (apertureRadius - 10) * Math.cos(rad);
                    const y1 = 540 + (apertureRadius - 10) * Math.sin(rad);
                    const x2 = 960 + (apertureRadius + 18) * Math.cos(rad);
                    const y2 = 540 + (apertureRadius + 18) * Math.sin(rad);
                    return (
                      <line
                        key={deg}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#2f6fed"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity={0.85}
                      />
                    );
                  })}
                </g>
              </>
            )}

            {/* Optic Sensor Center Reticle / Crosshair in early frames */}
            {frame < 12 && (
              <g
                opacity={interpolate(
                  frame,
                  [0, 3, 7, 12],
                  [0, 0.9, 0.7, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )}
              >
                <circle
                  cx="960"
                  cy="540"
                  r="14"
                  fill="none"
                  stroke="#2f6fed"
                  strokeWidth="1.5"
                />
                <line
                  x1="935"
                  y1="540"
                  x2="985"
                  y2="540"
                  stroke="#2f6fed"
                  strokeWidth="1.5"
                />
                <line
                  x1="960"
                  y1="515"
                  x2="960"
                  y2="565"
                  stroke="#2f6fed"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Atmospheric Micro-Particles using Remotion Bits */}
      <SentinelAtmosphere intensity={0.7} />

      {/* Fixed-Position Hero Logo (Locked vertically at exact position, never moving up or down) */}
      <div className="absolute top-[340px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div
          className="flex items-center justify-center"
          style={{
            opacity: interpolate(logoSpring, [0, 1], [0, 1]) * hookExitFade,
            transform: `scale(${interpolate(logoSpring, [0, 1], [0.85, 1])})`,
          }}
        >
          <Img
            src={staticFile("branding/sentinel-logo.svg")}
            alt="Sentinel Logo"
            className="w-20 h-20 object-contain drop-shadow-[0_12px_24px_rgba(47,111,237,0.18)]"
          />
        </div>
      </div>

      {/* Kinetic Narrative Text Container (Anchored at fixed vertical position below logo) */}
      <div className="absolute top-[440px] left-0 right-0 z-10 flex justify-center px-8">
        <div className="max-w-5xl text-center flex flex-col items-center">
          {/* Phase 1: The Invisible Hazard (Frames 15 - 135) */}
          {frame < 135 && (
            <div
              style={{
                opacity: interpolate(frame, [120, 135], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <AnimatedText
                className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight leading-[1.1] max-w-4xl"
                transition={{
                  y: [25, 0],
                  blur: [8, 0],
                  opacity: [0, 1],
                  split: "word",
                  splitStagger: 2,
                  delay: 15,
                  duration: 25,
                  easing: "easeOutCubic",
                }}
              >
                The most dangerous gas hazards are completely invisible.
              </AnimatedText>
            </div>
          )}

          {/* Phase 2: Without Real-Time Monitoring (Frames 135 - 285) */}
          {frame >= 135 && (
            <div
              style={{
                opacity: interpolate(frame, [270, 285], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <AnimatedText
                className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight leading-[1.1] max-w-4xl"
                transition={{
                  y: [25, 0],
                  blur: [8, 0],
                  opacity: [0, 1],
                  split: "word",
                  splitStagger: 2,
                  delay: 138,
                  duration: 25,
                  easing: "easeOutCubic",
                }}
              >
                Without 24/7 real-time monitoring, you don&apos;t know until it&apos;s too late.
              </AnimatedText>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Subtle Caption */}
      <div
        className="absolute bottom-10 flex items-center gap-2.5 text-xs font-mono text-zinc-400 tracking-widest uppercase"
        style={{
          opacity: hookExitFade,
        }}
      >
        <span
          className="w-2 h-2 rounded-full bg-[#2f6fed]"
          style={{
            opacity: 0.4 + (Math.sin(frame * 0.15) * 0.5 + 0.5) * 0.6,
          }}
        />
        <span>SENTINEL // CO₂ &amp; H₂ GAS SAFETY</span>
      </div>
    </div>
  );
};
