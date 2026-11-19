import { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import { DispenserModel } from "./DispenserModel";

type PumpCanvasProps = {
  progressRef: MutableRefObject<number>;
};

function PumpEnvironment() {
  const { scene } = useThree();

  useMemo(() => {
    scene.fog = new THREE.Fog("#ebe6df", 19, 38);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={1.7} />

      <hemisphereLight args={["#ffffff", "#cabfb5", 1.9]} />

      <directionalLight position={[6, 10, 8]} intensity={3.4} color="#ffffff" />

      <directionalLight position={[-7, 5, 5]} intensity={1.3} color="#f7dedc" />

      <directionalLight
        position={[0, 2, -5]}
        intensity={0.85}
        color="#ffffff"
      />

      <pointLight
        position={[5, 2, 6]}
        intensity={2}
        color="#ffffff"
        distance={20}
      />
    </>
  );
}

function GroundShadow({ progressRef }: PumpCanvasProps) {
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#211711",
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
      }),
    [],
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3.02, 0.1]}
      scale={[1.7, 0.6, 1]}
    >
      <circleGeometry args={[1.45, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function PumpCanvas({ progressRef }: PumpCanvasProps) {
  return (
    <Canvas
      className="pump-canvas"
      dpr={[1, 1.75]}
      camera={{
        position: [0, 0.05, 10.8],
        fov: 38,
        near: 0.1,
        far: 60,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <PumpEnvironment />

      <Suspense fallback={null}>
        <DispenserModel progressRef={progressRef} />
        <GroundShadow progressRef={progressRef} />
      </Suspense>

      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  );
}
