import {useMemo, useRef} from "react";
import {Html, Line} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {BufferAttribute, Group, MathUtils} from "three";

import type {AppLocale} from "@/i18n/routing";
import {qualitySettings} from "@/lib/performance-quality";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {ClusterDefinition} from "@/lib/portfolio-types";
import {useExperienceStore} from "@/store/experience-store";

type SemanticClusterProps = {
  cluster: ClusterDefinition;
  locale: AppLocale;
};

function ClusterPattern({cluster}: {cluster: ClusterDefinition}) {
  const color = cluster.color;

  if (cluster.pattern === "helix") {
    const strandA = Array.from({length: 18}, (_, index) => {
      const y = (index - 8.5) * 0.24;
      return [Math.sin(index * 0.72) * 0.85, y, Math.cos(index * 0.72) * 0.32] as [number, number, number];
    });
    const strandB = strandA.map(([x, y, z]) => [-x, y, -z] as [number, number, number]);
    return <><Line points={strandA} color={color} transparent opacity={0.45} lineWidth={0.7} /><Line points={strandB} color={color} transparent opacity={0.3} lineWidth={0.7} /></>;
  }

  if (cluster.pattern === "topology") {
    return <>{[-1, 0, 1].map((x, index) => <mesh key={x} position={[x * 0.9, (index - 1) * 0.45, index % 2 ? -0.3 : 0.3]}><boxGeometry args={[0.8, 0.48, 0.38]} /><meshBasicMaterial color={color} wireframe transparent opacity={0.44} /></mesh>)}</>;
  }

  if (cluster.pattern === "pulse") {
    return <>{[1, 1.55, 2.1].map((radius) => <mesh key={radius} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, 0.012, 4, 48]} /><meshBasicMaterial color={color} transparent opacity={0.28} /></mesh>)}</>;
  }

  if (cluster.pattern === "streams") {
    return <>{[-1.2, -0.4, 0.4, 1.2].map((y, index) => <Line key={y} points={[[-2.2, y, index * 0.12], [0, y * 0.35, 0], [2.2, y * 0.15, -index * 0.1]]} color={color} transparent opacity={0.3 + index * 0.04} lineWidth={0.6} />)}</>;
  }

  const networkPoints: [number, number, number][] = [[0, 0, 0], [-1.8, 0.7, 0.3], [1.5, 1.1, -0.4], [-1.1, -1.4, -0.2], [1.7, -1.1, 0.35]];
  return <>{networkPoints.slice(1).map((point) => <Line key={point.join(":")} points={[networkPoints[0], point]} color={color} transparent opacity={0.38} lineWidth={0.7} />)}</>;
}

export function SemanticCluster({cluster, locale}: SemanticClusterProps) {
  const groupRef = useRef<Group>(null);
  const quality = useExperienceStore((state) => state.quality);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const selectedClusterId = useExperienceStore((state) => state.selectedClusterId);
  const focusCluster = useExperienceStore((state) => state.focusCluster);
  const isSelected = selectedClusterId === cluster.id;
  const title = resolveLocalizedText(cluster.title, locale);
  const positions = useMemo(() => {
    const count = qualitySettings[quality].clusterParticles;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const phase = index * 2.399 + cluster.id.length;
      const radius = 1.2 + ((index * 37) % 100) / 42;
      values[index * 3] = Math.cos(phase) * radius;
      values[index * 3 + 1] = Math.sin(index * 1.71) * 1.8;
      values[index * 3 + 2] = Math.sin(phase) * radius;
    }
    return new BufferAttribute(values, 3);
  }, [cluster.id, quality]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const targetScale = isSelected ? 1.14 : 1;
    group.scale.setScalar(MathUtils.damp(group.scale.x, targetScale, 5, delta));
    if (!reducedMotion) group.rotation.y += delta * 0.035;
  });

  return (
    <group
      ref={groupRef}
      position={cluster.position}
      onClick={(event) => {event.stopPropagation(); focusCluster(cluster.id);}}
    >
      <points>
        <bufferGeometry><primitive attach="attributes-position" object={positions} /></bufferGeometry>
        <pointsMaterial color={cluster.color} size={0.055} transparent opacity={isSelected ? 0.86 : 0.52} depthWrite={false} />
      </points>
      <mesh>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshBasicMaterial color={cluster.secondaryColor} wireframe transparent opacity={isSelected ? 0.62 : 0.3} />
      </mesh>
      <ClusterPattern cluster={cluster} />
      <Html center position={[0, 2.65, 0]} distanceFactor={13} zIndexRange={[10, 0]}>
        <button className={`cluster-world-label${isSelected ? " is-selected" : ""}`} type="button" onClick={() => focusCluster(cluster.id)}>
          <span>{title}</span>
        </button>
      </Html>
    </group>
  );
}
