import React from "react";
import { useCurrentFrame } from "remotion";
import { SentiAtmosphere } from "../components/SentiAtmosphere";
import { CinematicOutro } from "../components/CinematicOutro";

export const BrandOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const isCtaPhase = frame > 130;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {!isCtaPhase && <SentiAtmosphere variant="luminous" intensity={1.0} />}
      <CinematicOutro />
    </div>
  );
};
