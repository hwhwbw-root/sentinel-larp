import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type HardwareModel3DProps = {
  geometry?: "box" | "sphere";
  color?: string;
  framesPerRotation?: number;
  width?: number;
  height?: number;
};

// Placeholder mesh until a .glb/.gltf is swapped in via useLoader from @remotion/three.
// Rotation is driven by interpolate() against useCurrentFrame() (not a Three.js clock
// or requestAnimationFrame), so the pose is a pure function of the frame number and
// reproduces identically on every render pass, including headless Lambda encoding.
export const HardwareModel3D: React.FC<HardwareModel3DProps> = ({
  geometry = "box",
  color = "#4f7cff",
  framesPerRotation = 90,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const canvasWidth = width ?? videoConfig.width;
  const canvasHeight = height ?? videoConfig.height;

  const rotationY = interpolate(
    frame,
    [0, framesPerRotation],
    [0, Math.PI * 2],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    },
  );

  return (
    <ThreeCanvas
      width={canvasWidth}
      height={canvasHeight}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -4]} intensity={0.3} />
      <mesh rotation={[0, rotationY, 0]}>
        {geometry === "sphere" ? (
          <sphereGeometry args={[1.2, 32, 32]} />
        ) : (
          <boxGeometry args={[2, 2, 2]} />
        )}
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
    </ThreeCanvas>
  );
};
