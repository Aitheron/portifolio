import {useMemo, useRef} from "react";
import {Html} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {Group, MathUtils, Vector3} from "three";

import {getSatelliteBudget, getSatellitePosition, selectSatellites} from "@/lib/satellite-layout";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {SemanticSatellite} from "@/lib/portfolio-types";
import {useExperienceStore} from "@/store/experience-store";

type MicroUniverseProps = {
  satellites: readonly SemanticSatellite[];
  color: string;
  radius?: number;
  emphasis?: number;
  ambient?: boolean;
};

export function MicroUniverse({satellites, color, radius = 5.2, emphasis = 1, ambient = false}: MicroUniverseProps) {
  const group = useRef<Group>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const opacity = useRef(0);
  const position = useMemo(() => new Vector3(), []);
  const width = useThree((state) => state.size.width);
  const locale = useExperienceStore((state) => state.locale);
  const quality = useExperienceStore((state) => state.quality);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const visible = useMemo(() => selectSatellites(satellites, getSatelliteBudget(width, quality)), [satellites, width, quality]);
  const orbitRadius = radius * (width < 720 ? 0.82 : 1);

  useFrame(({camera, clock}, delta) => {
    if (!group.current) return;
    opacity.current = MathUtils.damp(opacity.current, emphasis, 3, delta);
    group.current.quaternion.copy(camera.quaternion);
    group.current.getWorldPosition(position);
    const distance = camera.position.distanceTo(position);
    const proximity = ambient ? 1 : MathUtils.clamp((26 - distance) / 12, 0.15, 1);
    group.current.children.forEach((child, index) => {
      if (!visible[index]) return;
      const point = getSatellitePosition(visible[index].id, index, visible.length, orbitRadius, clock.elapsedTime, reducedMotion, width < 720, ambient ? 0.85 : 0.5);
      child.position.fromArray(point);
      const label = labels.current[index];
      if (label) {
        const angleFade = MathUtils.clamp(0.8 + point[2] * 0.25, 0.45, 1);
        // The compact orbit passes behind the cover and its summary/name block.
        let coverFade = 1;
        if (width < 720 && !reducedMotion) {
          coverFade = point[1] < 0
            ? MathUtils.smoothstep(-point[1], 3.4, 4.2)
            : ambient ? 1 : MathUtils.smoothstep(point[1], 1.8, 2.8);
        }
        label.style.opacity = String(opacity.current * proximity * angleFade * coverFade);
      }
    });
  });

  return (
    <group ref={group}>
      {visible.map((satellite, index) => (
        <group key={satellite.id}>
          <mesh raycast={() => null}>
            <sphereGeometry args={[0.04, 6, 4]} />
            <meshBasicMaterial color={color} transparent opacity={0.5 * emphasis} depthWrite={false} />
          </mesh>
          <Html center position={[0, 0.18, 0]} zIndexRange={[6, 0]} style={{pointerEvents: "none"}}>
            <span ref={(element) => {labels.current[index] = element;}} className={`semantic-satellite semantic-satellite--${satellite.type}`} aria-hidden="true">
              {resolveLocalizedText(satellite.label, locale)}
            </span>
          </Html>
        </group>
      ))}
    </group>
  );
}
