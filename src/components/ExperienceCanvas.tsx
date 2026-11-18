import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import { StationModel } from "./StationModel";

type ExperienceCanvasProps = {
  progressRef: MutableRefObject<number>;
};

type Shot = {
  p: number;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};

// Every repeated pair is an intentional camera pause.
// Movement only happens in the gaps between pump hold ranges.
const shots: Shot[] = [
  // Opening: full station, absolutely no content.
  { p: 0.0, position: [0, 0.72, 16.1], target: [0, -0.72, 0.62], fov: 41 },
  { p: 0.08, position: [0, 0.72, 16.1], target: [0, -0.72, 0.62], fov: 41 },

  // One direct motion to Petrol.
  { p: 0.16, position: [-5.52, -1.22, 6.72], target: [-4.12, -1.78, 2.12], fov: 30.5 },
  { p: 0.285, position: [-5.52, -1.22, 6.72], target: [-4.12, -1.78, 2.12], fov: 30.5 },

  // One direct motion to Diesel.
  { p: 0.36, position: [-3.03, -1.24, 6.66], target: [-1.72, -1.8, 2.12], fov: 30.5 },
  { p: 0.485, position: [-3.03, -1.24, 6.66], target: [-1.72, -1.8, 2.12], fov: 30.5 },

  // Cross once to CNG on the right side.
  { p: 0.56, position: [3.03, -1.24, 6.66], target: [1.72, -1.8, 2.12], fov: 30.5 },
  { p: 0.685, position: [3.03, -1.24, 6.66], target: [1.72, -1.8, 2.12], fov: 30.5 },

  // One direct motion to LPG.
  { p: 0.76, position: [5.52, -1.22, 6.72], target: [4.12, -1.78, 2.12], fov: 30.5 },
  { p: 1.0, position: [5.52, -1.22, 6.72], target: [4.12, -1.78, 2.12], fov: 30.5 },
];

function smoothstep01(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function interpolateShot(progress: number) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  let a = shots[0];
  let b = shots[shots.length - 1];

  for (let i = 0; i < shots.length - 1; i++) {
    if (p >= shots[i].p && p <= shots[i + 1].p) {
      a = shots[i];
      b = shots[i + 1];
      break;
    }
  }

  const span = Math.max(0.00001, b.p - a.p);
  const t = smoothstep01((p - a.p) / span);

  return {
    position: new THREE.Vector3(...a.position).lerp(new THREE.Vector3(...b.position), t),
    target: new THREE.Vector3(...a.target).lerp(new THREE.Vector3(...b.target), t),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, t),
  };
}

function CameraRig({ progressRef }: ExperienceCanvasProps) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    const shot = interpolateShot(progressRef.current);

    // Direct assignment is intentional: no delayed camera catch-up during text holds.
    camera.position.copy(shot.position);
    target.current.copy(shot.target);

    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - shot.fov) > 0.001) {
      camera.fov = shot.fov;
      camera.updateProjectionMatrix();
    }

    camera.lookAt(target.current);
  });

  return null;
}

function StationEnvironment() {
  const fog = useMemo(() => new THREE.Fog("#07090c", 23, 52), []);
  const { scene } = useThree();

  useFrame(() => {
    if (scene.fog !== fog) scene.fog = fog;
  });

  return (
    <>
      <color attach="background" args={["#07090c"]} />
      <ambientLight intensity={1.0} />
      <hemisphereLight args={["#eef4ff", "#19070b", 1.3]} />
      <directionalLight position={[7, 12, 10]} intensity={2.35} color="#ffffff" />
      <spotLight position={[-9, 7, 8]} angle={0.58} penumbra={0.86} intensity={2.6} color="#d51935" />
      <pointLight position={[8, 1, 4]} intensity={1.3} color="#ffffff" distance={26} />
    </>
  );
}

function Scene({ progressRef }: ExperienceCanvasProps) {
  return (
    <>
      <StationEnvironment />
      <Suspense fallback={null}>
        <StationModel />
      </Suspense>
      <CameraRig progressRef={progressRef} />
      <AdaptiveDpr pixelated />
      <Preload all />
    </>
  );
}

export function ExperienceCanvas({ progressRef }: ExperienceCanvasProps) {
  return (
    <Canvas
      className="experience-canvas"
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.72, 16.1], fov: 41, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
