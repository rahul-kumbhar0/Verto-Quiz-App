import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Studio3D — the "Blender look": a dark studio stage with rim + key
 * lighting and a slow turntable. Put any mesh inside (a torus reads as
 * a tire, a rounded box as a device, etc.).
 *
 * Usage inside a beat:
 *   <Studio3D width={900} height={900}>
 *     <mesh castShadow>
 *       <torusGeometry args={[1.5, 0.62, 32, 96]} />
 *       <meshStandardMaterial color="#141414" roughness={0.55} metalness={0.1} />
 *     </mesh>
 *   </Studio3D>
 *
 * Keep ONE Studio3D per beat (each is a WebGL context) and prefer
 * simple geometry — the style needs clean studio shots, not detail.
 */
export const Turntable: React.FC<{ speed?: number; children: React.ReactNode }> = ({
  speed = 0.35,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <group rotation={[0.42, (frame / fps) * speed, 0]}>{children}</group>
  );
};

export const Studio3D: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  /** camera distance */
  dist?: number;
  turntable?: boolean;
  speed?: number;
  /** warm amber accent rim (the brand gold) */
  amberRim?: boolean;
}> = ({ width, height, children, dist = 5.2, turntable = true, speed = 0.35, amberRim = true }) => {
  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{ width, height }}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.6, dist], fov: 38 }}
    >
      {/* key light */}
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FFFFFF" />
      {/* cool fill */}
      <directionalLight position={[-5, 2, 2]} intensity={0.5} color="#9FB6D4" />
      {/* amber rim from behind — the brand accent */}
      {amberRim ? <directionalLight position={[-2, 3, -6]} intensity={2.6} color="#E8A33D" /> : null}
      <ambientLight intensity={0.5} />
      {turntable ? <Turntable speed={speed}>{children}</Turntable> : <group rotation={[0.42, -0.5, 0]}>{children}</group>}
    </ThreeCanvas>
  );
};
