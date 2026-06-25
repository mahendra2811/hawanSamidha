"use client";

import { Canvas } from "@react-three/fiber";
import { Particles } from "./Particles";

/** Default export so it can be dynamically imported with ssr:false. */
export default function HeroScene() {
  // Light hero = darker, normal-blended sparks (gold additive vanishes on light).
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0 }}
      frameloop="always"
    >
      <ambientLight intensity={0.5} />
      <Particles color={isDark ? "#F5C84C" : "#D9701A"} additive={isDark} />
    </Canvas>
  );
}
