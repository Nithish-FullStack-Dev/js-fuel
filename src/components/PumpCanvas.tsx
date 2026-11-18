import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import { DispenserModel } from "./DispenserModel";

type PumpCanvasProps = {
  progressRef: MutableRefObject<number>;
};

function PumpEnvironment() {
  const { scene } = useThree();
  const fog = useMemo(() => new THREE.Fog("#ebe6df", 18, 35), []);

  useFrame(() => {
    if (scene.fog !== fog) scene.fog = fog;
  });

  return (
    <>
      <ambientLight intensity={1.6} />
      <hemisphereLight args={["#ffffff", "#cabfb5", 1.8]} />
      <directionalLight position={[6, 10, 8]} intensity={3.2} color="#ffffff" />
      <directionalLight position={[-7, 4, 5]} intensity={1.2} color="#f6d7d9" />
      <pointLight position={[5, 1, 5]} intensity={2.2} color="#ffffff" distance={18} />
    </>
  );
}

function GroundShadow({ progressRef }: PumpCanvasProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#211711", transparent: true, opacity: 0.11, depthWrite: false }), []);

  useFrame(() => {
    const move = THREE.MathUtils.smoothstep(progressRef.current, 0.24, 0.72);
    material.opacity = THREE.MathUtils.lerp(0.14, 0.08, move);
    if (!mesh.current) return;
    mesh.current.position.x = THREE.MathUtils.lerp(0.18, 2.72, move);
    mesh.current.scale.x = THREE.MathUtils.lerp(1.8, 1.28, move);
    mesh.current.scale.y = THREE.MathUtils.lerp(0.72, 0.58, move);
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0.18, -3.31, 0.18]} scale={[1.8, 0.72, 1]}>
      <circleGeometry args={[1.6, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function PumpCanvas({ progressRef }: PumpCanvasProps) {
  return (
    <Canvas
      className="pump-canvas"
      dpr={[1, 1.7]}
      camera={{ position: [0, 0.45, 9.7], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
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
