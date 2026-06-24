"use client";

import { Canvas } from "@react-three/fiber";
import { Particles } from "./Particles";

/** Default export so it can be dynamically imported with ssr:false. */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0 }}
      frameloop="always"
    >
      <ambientLight intensity={0.5} />
      <Particles />
    </Canvas>
  );
}
