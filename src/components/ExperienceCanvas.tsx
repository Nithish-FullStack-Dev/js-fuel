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

const INTRO_DURATION = 4.2;

const desktopIntroShot: Shot = {
  p: 0,
  position: [0, 15.5, 24.5],
  target: [0, -2.2, 0.4],
  fov: 48,
};

const mobileIntroShot: Shot = {
  p: 0,
  position: [0, 13.5, 31],
  target: [0, -1.7, 0.5],
  fov: 58,
};

const desktopShots: Shot[] = [
  {
    p: 0,
    position: [0, 1.18, 20.5],
    target: [0, -0.78, 0.62],
    fov: 43,
  },
  {
    p: 0.06,
    position: [0, 1.18, 20.5],
    target: [0, -0.78, 0.62],
    fov: 43,
  },
  {
    p: 0.12,
    position: [-3.25, -0.9, 7.7],
    target: [-2.4, -1.68, 2.05],
    fov: 37,
  },
  {
    p: 0.3,
    position: [-3.25, -0.9, 7.7],
    target: [-2.4, -1.68, 2.05],
    fov: 37,
  },
  {
    p: 0.36,
    position: [-1.05, -0.92, 7.7],
    target: [-0.48, -1.68, 2.05],
    fov: 37,
  },
  {
    p: 0.54,
    position: [-1.05, -0.92, 7.7],
    target: [-0.48, -1.68, 2.05],
    fov: 37,
  },
  {
    p: 0.6,
    position: [1.05, -0.92, 7.7],
    target: [0.48, -1.68, 2.05],
    fov: 37,
  },
  {
    p: 0.78,
    position: [1.05, -0.92, 7.7],
    target: [0.48, -1.68, 2.05],
    fov: 37,
  },
  {
    p: 0.84,
    position: [3.25, -0.9, 7.7],
    target: [2.4, -1.68, 2.05],
    fov: 37,
  },
  {
    p: 1,
    position: [3.25, -0.9, 7.7],
    target: [2.4, -1.68, 2.05],
    fov: 37,
  },
];

const mobileShots: Shot[] = [
  {
    p: 0,
    position: [0, 1.6, 27],
    target: [0, -0.65, 0.5],
    fov: 54,
  },
  {
    p: 0.06,
    position: [0, 1.6, 27],
    target: [0, -0.65, 0.5],
    fov: 54,
  },
  {
    p: 0.12,
    position: [-2.4, 0.25, 10.7],
    target: [-2.3, -0.9, 2.1],
    fov: 48,
  },
  {
    p: 0.3,
    position: [-2.4, 0.25, 10.7],
    target: [-2.3, -0.9, 2.1],
    fov: 48,
  },
  {
    p: 0.36,
    position: [-0.85, 0.25, 10.7],
    target: [-0.55, -0.9, 2.1],
    fov: 48,
  },
  {
    p: 0.54,
    position: [-0.85, 0.25, 10.7],
    target: [-0.55, -0.9, 2.1],
    fov: 48,
  },
  {
    p: 0.6,
    position: [0.85, 0.25, 10.7],
    target: [0.55, -0.9, 2.1],
    fov: 48,
  },
  {
    p: 0.78,
    position: [0.85, 0.25, 10.7],
    target: [0.55, -0.9, 2.1],
    fov: 48,
  },
  {
    p: 0.84,
    position: [2.4, 0.25, 10.7],
    target: [2.3, -0.9, 2.1],
    fov: 48,
  },
  {
    p: 1,
    position: [2.4, 0.25, 10.7],
    target: [2.3, -0.9, 2.1],
    fov: 48,
  },
];

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function smootherstep(value: number) {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function interpolateShot(
  progress: number,
  shots: Shot[],
  position: THREE.Vector3,
  target: THREE.Vector3,
) {
  const p = clamp01(progress);

  let index = shots.length - 2;

  for (let i = 0; i < shots.length - 1; i++) {
    if (p <= shots[i + 1].p) {
      index = i;
      break;
    }
  }

  const from = shots[index];
  const to = shots[index + 1];

  const duration = Math.max(0.00001, to.p - from.p);

  const t = smoothstep((p - from.p) / duration);

  position.set(...from.position).lerp(new THREE.Vector3(...to.position), t);

  target.set(...from.target).lerp(new THREE.Vector3(...to.target), t);

  return THREE.MathUtils.lerp(from.fov, to.fov, t);
}

function CameraRig({ progressRef }: ExperienceCanvasProps) {
  const { camera, size } = useThree();

  const position = useRef(new THREE.Vector3());

  const target = useRef(new THREE.Vector3());

  const introElapsed = useRef(0);

  const introPosition = useRef(new THREE.Vector3());

  const introTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const progress = clamp01(progressRef.current);

    const aspect = size.width / Math.max(size.height, 1);

    const isMobile = size.width <= 767;

    const selectedShots = isMobile ? mobileShots : desktopShots;

    const selectedIntro = isMobile ? mobileIntroShot : desktopIntroShot;

    const baseFov = interpolateShot(
      progress,
      selectedShots,
      position.current,
      target.current,
    );

    introPosition.current.set(...selectedIntro.position);

    introTarget.current.set(...selectedIntro.target);

    introElapsed.current = Math.min(
      introElapsed.current + Math.min(delta, 0.1),
      INTRO_DURATION,
    );

    const introProgress = smootherstep(introElapsed.current / INTRO_DURATION);

    const scrollRelease = smoothstep(progress / 0.06);

    const introWeight = (1 - introProgress) * (1 - scrollRelease);

    position.current.lerp(introPosition.current, introWeight);

    target.current.lerp(introTarget.current, introWeight);

    let finalFov = THREE.MathUtils.lerp(
      baseFov,
      selectedIntro.fov,
      introWeight,
    );

    if (!isMobile) {
      if (aspect < 0.8) {
        finalFov = Math.min(finalFov + 17, 72);
      } else if (aspect < 1.2) {
        finalFov = Math.min(finalFov + 8, 64);
      }
    }

    camera.position.copy(position.current);

    if (
      camera instanceof THREE.PerspectiveCamera &&
      Math.abs(camera.fov - finalFov) > 0.001
    ) {
      camera.fov = finalFov;
      camera.updateProjectionMatrix();
    }

    camera.lookAt(target.current);
  });

  return null;
}

function StationEnvironment() {
  const fog = useMemo(() => new THREE.Fog("#07090c", 26, 60), []);

  const { scene } = useThree();

  useFrame(() => {
    if (scene.fog !== fog) {
      scene.fog = fog;
    }
  });

  return (
    <>
      <color attach="background" args={["#07090c"]} />

      <ambientLight intensity={1} />

      <hemisphereLight args={["#eef4ff", "#19070b", 1.3]} />

      <directionalLight
        position={[7, 12, 10]}
        intensity={2.35}
        color="#ffffff"
      />

      <spotLight
        position={[-9, 7, 8]}
        angle={0.58}
        penumbra={0.86}
        intensity={2.6}
        color="#d51935"
      />

      <pointLight
        position={[8, 1, 4]}
        intensity={1.3}
        color="#ffffff"
        distance={26}
      />
    </>
  );
}

function Scene({ progressRef }: ExperienceCanvasProps) {
  return (
    <>
      <StationEnvironment />

      <Suspense fallback={null}>
        <StationModel />
        <CameraRig progressRef={progressRef} />
      </Suspense>

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
      camera={{
        position: desktopIntroShot.position,
        fov: desktopIntroShot.fov,
        near: 0.1,
        far: 120,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
