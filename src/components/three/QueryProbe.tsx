import {useMemo, useRef} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {BufferAttribute, Group, MathUtils, PointsMaterial, Vector3} from "three";

import {useExperienceStore} from "@/store/experience-store";

const forward = new Vector3();
const targetPosition = new Vector3();

export function QueryProbe() {
  const groupRef = useRef<Group>(null);
  const trailMaterialRef = useRef<PointsMaterial>(null);
  const camera = useThree((state) => state.camera);
  const previousCameraPosition = useRef(camera.position.clone());
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const trail = useMemo(() => {
    const values = new Float32Array(15);
    for (let index = 0; index < 5; index += 1) {
      values[index * 3 + 2] = index * 0.24 + 0.3;
    }
    return new BufferAttribute(values, 3);
  }, []);

  useFrame(({clock}, delta) => {
    const group = groupRef.current;
    if (!group) return;

    camera.getWorldDirection(forward);
    targetPosition.copy(camera.position).add(forward.multiplyScalar(3.2));
    group.position.lerp(targetPosition, 1 - Math.exp(-9 * delta));
    group.quaternion.slerp(camera.quaternion, 1 - Math.exp(-7 * delta));

    const velocity = camera.position.distanceTo(previousCameraPosition.current) / Math.max(delta, 0.001);
    previousCameraPosition.current.copy(camera.position);
    const response = reducedMotion ? 0 : MathUtils.clamp(velocity / 18, 0, 1);
    group.scale.setScalar(0.11 * (1 + response * 0.18));
    if (trailMaterialRef.current) trailMaterialRef.current.opacity = 0.48 + response * 0.24;

    if (!reducedMotion) {
      group.rotation.z = Math.sin(clock.elapsedTime * 1.4) * 0.15;
      group.position.y += Math.sin(clock.elapsedTime * 2) * 0.0015;
    }
  });

  return (
    <group ref={groupRef} scale={0.11} renderOrder={4}>
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#dff8ff" transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]} scale={1.45}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#69d7ff" wireframe transparent opacity={0.48} />
      </mesh>
      <points position={[0, 0, 0.6]}>
        <bufferGeometry>
          <primitive attach="attributes-position" object={trail} />
        </bufferGeometry>
        <pointsMaterial ref={trailMaterialRef} color="#7edcff" size={0.1} transparent opacity={0.48} />
      </points>
    </group>
  );
}
