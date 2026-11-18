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
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = false;
      object.receiveShadow = false;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (!material || !("roughness" in material)) return;
        const standard = material as THREE.MeshStandardMaterial;
        standard.roughness = Math.min(0.84, Math.max(0.24, standard.roughness ?? 0.56));
        standard.metalness = Math.min(0.62, Math.max(0.03, standard.metalness ?? 0.12));
        standard.needsUpdate = true;
      });
    });
  }, [cloned]);

  useFrame(() => {
    if (!group.current) return;
    const p = progressRef.current;
    const move = THREE.MathUtils.smoothstep(p, 0.24, 0.72);

    // Starts as a large center hero, then slides right, lowers, shrinks and turns once.
    const scale = THREE.MathUtils.lerp(4.05, 2.72, move);
    group.current.scale.setScalar(scale);
    group.current.position.x = THREE.MathUtils.lerp(0.18, 2.72, move);
    group.current.position.y = THREE.MathUtils.lerp(-3.37, -3.58, move);
    group.current.position.z = THREE.MathUtils.lerp(0, 0.12, move);
    group.current.rotation.y = THREE.MathUtils.lerp(0, -0.43, move);
    group.current.rotation.x = 0;
  });

  return (
    <group ref={group} position={[0.18, -3.37, 0]} scale={4.05}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
