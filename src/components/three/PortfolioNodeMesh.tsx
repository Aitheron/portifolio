import {useEffect, useRef, useState} from "react";
import {Billboard, Html, Line} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {
  Group,
  MathUtils,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";

import {clusterById} from "@/content/clusters";
import {nodeRevealDistance, getRevealState} from "@/lib/performance-quality";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {NodeRevealState, PortfolioNode, Vector3Tuple} from "@/lib/portfolio-types";
import {useExperienceStore} from "@/store/experience-store";

type PortfolioNodeMeshProps = {node: PortfolioNode; position: Vector3Tuple};

function NodeCore({node, color}: {node: PortfolioNode; color: string}) {
  const geometry = node.visual.variant;
  return (
    <mesh scale={node.visual.size ?? 1}>
      {geometry === "data-node" && <octahedronGeometry args={[0.38, 0]} />}
      {geometry === "genomic-nebula" && <sphereGeometry args={[0.35, 8, 6]} />}
      {geometry === "agent-network" && <icosahedronGeometry args={[0.38, 0]} />}
      {geometry === "system-module" && <boxGeometry args={[0.58, 0.42, 0.34]} />}
      {geometry === "human-signal" && <torusGeometry args={[0.32, 0.1, 6, 18]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.78} />
    </mesh>
  );
}

function FallbackGlyph({node, color}: {node: PortfolioNode; color: string}) {
  if (node.visual.variant === "system-module") {
    return <>{[-1.2, 0, 1.2].map((x) => <mesh key={x} position={[x, 0.2, 0.03]}><boxGeometry args={[0.7, 0.5, 0.04]} /><meshBasicMaterial color={color} wireframe transparent opacity={0.55} /></mesh>)}</>;
  }
  if (node.visual.variant === "human-signal") {
    return <>{[0.45, 0.85, 1.25].map((radius) => <mesh key={radius} position={[0, 0.2, 0.03]}><ringGeometry args={[radius - 0.015, radius, 40]} /><meshBasicMaterial color={color} transparent opacity={0.28} /></mesh>)}</>;
  }
  if (node.visual.variant === "genomic-nebula") {
    const wave = Array.from({length: 12}, (_, index) => [index * 0.3 - 1.65, Math.sin(index * 0.9) * 0.45 + 0.2, 0.03] as [number, number, number]);
    return <><Line points={wave} color={color} transparent opacity={0.56} lineWidth={0.7} /><Line points={wave.map(([x, y, z]) => [x, -y + 0.4, z] as [number, number, number])} color={color} transparent opacity={0.32} lineWidth={0.7} /></>;
  }
  const nodes: [number, number, number][] = [[-1.4, -0.45, 0.03], [-0.6, 0.7, 0.03], [0.3, 0.1, 0.03], [1.35, 0.65, 0.03]];
  return <>{nodes.slice(0, -1).map((point, index) => <Line key={point.join(":")} points={[point, nodes[index + 1]]} color={color} transparent opacity={0.5} lineWidth={0.7} />)}{nodes.map((point) => <mesh key={point.join(":")} position={point}><circleGeometry args={[0.08, 12]} /><meshBasicMaterial color={color} /></mesh>)}</>;
}

function NodePreview({node, color}: {node: PortfolioNode; color: string}) {
  const groupRef = useRef<Group>(null);
  const [texture, setTexture] = useState<Texture | null>(null);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);

  useEffect(() => {
    groupRef.current?.scale.setScalar(reducedMotion ? 1 : 0.82);
  }, [reducedMotion]);

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.scale.setScalar(
      MathUtils.damp(groupRef.current.scale.x, 1, 7, delta),
    );
  });

  useEffect(() => {
    if (!node.image?.src) return;
    let active = true;
    let loadedTexture: Texture | null = null;
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(node.image.src, (nextTexture) => {
      if (!active) { nextTexture.dispose(); return; }
      const image = nextTexture.image as {width: number; height: number};
      const imageAspect = image.width / image.height;
      const targetAspect = 16 / 9;
      if (imageAspect > targetAspect) {
        nextTexture.repeat.x = targetAspect / imageAspect;
        nextTexture.offset.x = (1 - nextTexture.repeat.x) / 2;
      } else {
        nextTexture.repeat.y = imageAspect / targetAspect;
        nextTexture.offset.y = (1 - nextTexture.repeat.y) / 2;
      }
      nextTexture.colorSpace = SRGBColorSpace;
      loadedTexture = nextTexture;
      setTexture(nextTexture);
    }, undefined, () => { if (active) setTexture(null); });
    return () => { active = false; loadedTexture?.dispose(); };
  }, [node.image?.src]);

  return (
    <group ref={groupRef}>
      <Billboard follow position={[0, 0.25, 0]}>
        <mesh>
          <planeGeometry args={[5.6, 3.15]} />
          <meshBasicMaterial color="#06131d" transparent opacity={0.94} />
        </mesh>
        {texture ? (
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[5.42, 3]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        ) : <FallbackGlyph node={node} color={color} />}
        <Line points={[[-2.8, -1.575, 0.04], [2.8, -1.575, 0.04], [2.8, 1.575, 0.04], [-2.8, 1.575, 0.04], [-2.8, -1.575, 0.04]]} color={color} transparent opacity={0.64} lineWidth={0.7} />
      </Billboard>
    </group>
  );
}

export function PortfolioNodeMesh({node, position}: PortfolioNodeMeshProps) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Group>(null);
  const distanceRef = useRef(Infinity);
  const revealRef = useRef<NodeRevealState>("signal");
  const [reveal, setReveal] = useState<NodeRevealState>("signal");
  const [hovered, setHovered] = useState(false);
  const locale = useExperienceStore((state) => state.locale);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const selectedClusterId = useExperienceStore((state) => state.selectedClusterId);
  const selectedNodeId = useExperienceStore((state) => state.selectedNodeId);
  const selectNode = useExperienceStore((state) => state.selectNode);
  const selected = selectedNodeId === node.id;
  const cluster = clusterById[node.cluster];
  const title = resolveLocalizedText(node.title, locale);
  const summary = resolveLocalizedText(node.summary, locale);
  const showsIdentity = reveal !== "signal";
  const showsPreview = reveal === "preview" || reveal === "selected";

  useFrame(({camera}, delta) => {
    const group = groupRef.current;
    if (!group) return;
    distanceRef.current = camera.position.distanceTo(group.position);
    const nextReveal = getRevealState(distanceRef.current, revealRef.current, selected);
    if (nextReveal !== revealRef.current) { revealRef.current = nextReveal; setReveal(nextReveal); }
    const farScale = distanceRef.current > nodeRevealDistance.signal ? 0.68 : 1;
    const targetScale = (selected ? 1.12 : hovered ? 1.06 : 1) * farScale;
    group.scale.setScalar(MathUtils.damp(group.scale.x, targetScale, 7, delta));
    if (coreRef.current && !reducedMotion) coreRef.current.rotation.y += delta * 0.42;
  });

  const activate = () => {
    const canInteract = distanceRef.current <= nodeRevealDistance.interaction || selectedClusterId === node.cluster;
    if (canInteract) selectNode(node.id, node.cluster);
  };

  return (
    <group ref={groupRef} position={position} onClick={(event) => {event.stopPropagation(); activate();}} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      <group ref={coreRef}><NodeCore node={node} color={cluster.color} /></group>
      {showsIdentity && !showsPreview && <Billboard follow><Line points={[[-1.4, -0.75, 0], [1.4, -0.75, 0], [1.4, 0.75, 0], [-1.4, 0.75, 0], [-1.4, -0.75, 0]]} color={cluster.color} transparent opacity={0.42} lineWidth={0.6} /></Billboard>}
      {showsPreview && <NodePreview node={node} color={cluster.color} />}
      {showsIdentity && (
        <Html center position={[0, showsPreview ? -1.9 : 1.15, 0]} distanceFactor={showsPreview ? 9 : 12} zIndexRange={[20, 1]}>
          <button className={`node-world-label node-world-label--${reveal}`} type="button" onClick={activate}>
            <strong>{title}</strong>
            {showsPreview && <span className="node-world-label__summary">{summary}</span>}
            {showsPreview && <small>{node.technologies.slice(0, 3).join(" · ")}</small>}
          </button>
        </Html>
      )}
    </group>
  );
}
