import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/js-fuel-station.glb";

export function StationModel() {
  const { scene } = useGLTF(MODEL_PATH);

  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = false;
      object.receiveShadow = false;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (
          !material ||
          !("roughness" in material) ||
          !("metalness" in material)
        ) {
          return;
        }

        const standard = material as THREE.MeshStandardMaterial;

        standard.roughness = THREE.MathUtils.clamp(
          standard.roughness ?? 0.65,
          0.3,
          0.9,
        );

        standard.metalness = THREE.MathUtils.clamp(
          standard.metalness ?? 0.08,
          0.02,
          0.5,
        );

        standard.needsUpdate = true;
      });
    });
  }, [cloned]);

  return (
    <group position={[0, -3.34, 0]}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
