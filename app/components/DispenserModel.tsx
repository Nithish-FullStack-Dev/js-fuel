"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const MODEL_PATH = "/models/js-fuel-dispenser.glb";

type DispenserModelProps = {
  progressRef: MutableRefObject<number>;
  mode?: "desktop" | "mobile";
};

export function DispenserModel({
  progressRef,
  mode = "desktop",
}: DispenserModelProps) {
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

    const targetHeight = mode === "mobile" ? 5.1 : 5.7;

    const scale = targetHeight / Math.max(size.y, 0.001);

    return {
      center,
      scale,
    };
  }, [cloned, mode]);

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

    const transition = THREE.MathUtils.smoothstep(
      progress,
      mode === "mobile" ? 0.33 : 0.42,
      mode === "mobile" ? 0.64 : 0.72,
    );

    const time = clock.getElapsedTime();

    const firstRotationY = -0.08;

    const secondRotationY = mode === "mobile" ? -0.46 : -0.52;

    const targetRotationY = THREE.MathUtils.lerp(
      firstRotationY,
      secondRotationY,
      transition,
    );

    const targetRotationX = THREE.MathUtils.lerp(
      0,
      mode === "mobile" ? -0.015 : -0.025,
      transition,
    );

    const targetRotationZ = THREE.MathUtils.lerp(
      0,
      mode === "mobile" ? 0 : 0.012,
      transition,
    );

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

    const movementTilt =
      mode === "mobile"
        ? Math.sin(Math.min(1, Math.max(0, transition)) * Math.PI) * 0.035
        : 0;

    const idleStrength = THREE.MathUtils.lerp(1, 0.55, transition);

    group.current.rotation.y =
      currentRotationY.current + Math.sin(time * 0.45) * 0.016 * idleStrength;

    group.current.rotation.x =
      currentRotationX.current + Math.sin(time * 0.6) * 0.0035 * idleStrength;

    group.current.rotation.z =
      currentRotationZ.current +
      movementTilt +
      Math.sin(time * 0.38) * 0.0018 * idleStrength;

    group.current.position.y = Math.sin(time * 0.7) * 0.018 * idleStrength;

    group.current.position.x = Math.sin(time * 0.42) * 0.007 * idleStrength;
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
