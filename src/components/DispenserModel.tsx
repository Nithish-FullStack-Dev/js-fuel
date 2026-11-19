import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const MODEL_PATH = "/models/js-fuel-dispenser.glb";

type DispenserModelProps = {
  progressRef: MutableRefObject<number>;
};

export function DispenserModel({ progressRef }: DispenserModelProps) {
  const { scene } = useGLTF(MODEL_PATH);

  const group = useRef<THREE.Group>(null);

  const currentRotationY = useRef(-0.08);
  const currentRotationX = useRef(0);
  const currentRotationZ = useRef(0);

  const cloned = useMemo(() => scene.clone(true), [scene]);

  const modelData = useMemo(() => {
    cloned.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(cloned);

    const size = box.getSize(new THREE.Vector3());

    const center = box.getCenter(new THREE.Vector3());

    const targetHeight = 5.7;

    const scale = targetHeight / Math.max(size.y, 0.001);

    return {
      center,
      scale,
    };
  }, [cloned]);

  useEffect(() => {
    cloned.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      object.castShadow = false;
      object.receiveShadow = false;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) {
          return;
        }

        material.roughness = Math.min(
          0.82,
          Math.max(0.25, material.roughness ?? 0.55),
        );

        material.metalness = Math.min(
          0.58,
          Math.max(0.03, material.metalness ?? 0.12),
        );

        material.needsUpdate = true;
      });
    });
  }, [cloned]);

  useFrame(({ clock }, delta) => {
    if (!group.current) {
      return;
    }

    const progress = progressRef.current;

    const transition = THREE.MathUtils.smoothstep(progress, 0.42, 0.72);

    const time = clock.getElapsedTime();

    const firstRotationY = -0.08;
    const secondRotationY = -0.52;

    const targetRotationY = THREE.MathUtils.lerp(
      firstRotationY,
      secondRotationY,
      transition,
    );

    const targetRotationX = THREE.MathUtils.lerp(0, -0.025, transition);

    const targetRotationZ = THREE.MathUtils.lerp(0, 0.012, transition);

    currentRotationY.current = THREE.MathUtils.damp(
      currentRotationY.current,
      targetRotationY,
      6,
      delta,
    );

    currentRotationX.current = THREE.MathUtils.damp(
      currentRotationX.current,
      targetRotationX,
      6,
      delta,
    );

    currentRotationZ.current = THREE.MathUtils.damp(
      currentRotationZ.current,
      targetRotationZ,
      6,
      delta,
    );

    const idleStrength = THREE.MathUtils.lerp(1, 0.55, transition);

    group.current.rotation.y =
      currentRotationY.current + Math.sin(time * 0.45) * 0.018 * idleStrength;

    group.current.rotation.x =
      currentRotationX.current + Math.sin(time * 0.6) * 0.004 * idleStrength;

    group.current.rotation.z =
      currentRotationZ.current + Math.sin(time * 0.38) * 0.002 * idleStrength;

    group.current.position.y = Math.sin(time * 0.7) * 0.022 * idleStrength;

    group.current.position.x = Math.sin(time * 0.42) * 0.009 * idleStrength;
  });

  return (
    <group ref={group} scale={modelData.scale}>
      <primitive
        object={cloned}
        position={[
          -modelData.center.x,
          -modelData.center.y,
          -modelData.center.z,
        ]}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
