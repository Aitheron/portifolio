import {useRef} from "react";
import {Html} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {Group, MathUtils} from "three";

import {identity} from "@/content/identity";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import {useExperienceStore} from "@/store/experience-store";

import {MicroUniverse} from "./MicroUniverse";

export function IdentityNode() {
  const core = useRef<Group>(null);
  const label = useRef<HTMLDivElement>(null);
  const locale = useExperienceStore((state) => state.locale);
  const stage = useExperienceStore((state) => state.stage);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const prominent = stage === "overview";

  useFrame((_, delta) => {
    if (!core.current) return;
    core.current.scale.setScalar(MathUtils.damp(core.current.scale.x, prominent ? 1 : 0.72, 4, delta));
    if (!reducedMotion) core.current.rotation.y += delta * 0.045;
    if (label.current) label.current.style.opacity = prominent ? "1" : "0.35";
  });

  return (
    <group position={identity.position}>
      {(stage === "overview" || stage === "cluster-focus") && <MicroUniverse satellites={identity.satellites} color="#78d7ff" radius={6.3} emphasis={prominent ? 0.85 : 0.15} ambient />}
      <group ref={core}>
        <mesh raycast={() => null}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshBasicMaterial color="#b9eaff" wireframe transparent opacity={0.66} />
        </mesh>
        <mesh rotation={[0.7, 0.4, 0]} raycast={() => null}>
          <torusGeometry args={[1.6, 0.012, 4, 64]} />
          <meshBasicMaterial color="#78d7ff" transparent opacity={0.48} />
        </mesh>
      </group>
      <Html center position={[0, -2.1, 0]} zIndexRange={[8, 0]} style={{pointerEvents: "none"}}>
        <div ref={label} className="identity-world-label" aria-hidden="true">
          <strong>{resolveLocalizedText(identity.title, locale)}</strong>
          <span>{resolveLocalizedText(identity.primaryRole, locale)}</span>
          <small>{resolveLocalizedText(identity.secondaryRole, locale)}</small>
        </div>
      </Html>
    </group>
  );
}
