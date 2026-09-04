"use client";

import {useEffect, useMemo, useRef} from "react";
import type {RefObject} from "react";
import {AdaptiveDpr} from "@react-three/drei";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {useTranslations} from "next-intl";
import {BufferAttribute, Group, Points, Vector3} from "three";

import {clusters} from "@/content/clusters";
import {portfolioNodePositions, portfolioNodes} from "@/content/nodes";
import {qualitySettings} from "@/lib/performance-quality";
import {imageFormationConfig} from "@/lib/scene-config";
import {useExperienceStore} from "@/store/experience-store";

import {CameraRig} from "./CameraRig";
import {PortfolioNodeMesh} from "./PortfolioNodeMesh";
import {QueryProbe} from "./QueryProbe";
import {SemanticCluster} from "./SemanticCluster";

type UniverseCanvasProps = {onUnavailable: () => void};
const previewPosition = new Vector3();

function ContextLossListener({onUnavailable}: UniverseCanvasProps) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event: Event) => { event.preventDefault(); onUnavailable(); };
    canvas.addEventListener("webglcontextlost", handleContextLoss);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss);
  }, [gl, onUnavailable]);
  return null;
}

function DataField() {
  const pointsRef = useRef<Points>(null);
  const quality = useExperienceStore((state) => state.quality);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const positions = useMemo(() => {
    const count = qualitySettings[quality].backgroundParticles;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const phi = index * 2.399963;
      const radius = 12 + ((index * 47) % 100) * 0.28;
      values[index * 3] = Math.cos(phi) * radius;
      values[index * 3 + 1] = Math.sin(index * 0.77) * 16;
      values[index * 3 + 2] = Math.sin(phi) * radius - 6;
    }
    return new BufferAttribute(values, 3);
  }, [quality]);
  useFrame((_, delta) => {
    if (pointsRef.current && !reducedMotion) pointsRef.current.rotation.y += delta * 0.006;
  });
  return <points ref={pointsRef}><bufferGeometry><primitive attach="attributes-position" object={positions} /></bufferGeometry><pointsMaterial color="#8adfff" size={0.035} transparent opacity={0.42} depthWrite={false} /></points>;
}

function LanguageGalaxies() {
  const groupRef = useRef<Group>(null);
  const selectedLocale = useExperienceStore((state) => state.languageSignal);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const attribute = useMemo(() => {
    const values = new Float32Array(72 * 3);
    for (let index = 0; index < 72; index += 1) {
      const phase = index * 2.1;
      const radius = 0.4 + (index % 12) * 0.12;
      values[index * 3] = Math.cos(phase) * radius;
      values[index * 3 + 1] = Math.sin(phase * 0.7) * radius;
      values[index * 3 + 2] = Math.sin(phase) * radius * 0.55;
    }
    return new BufferAttribute(values, 3);
  }, []);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.08;
  });
  return (
    <group ref={groupRef}>
      {([-8, 8] as const).map((x, index) => {
        const locale = index === 0 ? "pt" : "en";
        const isAcquired = selectedLocale === locale;
        const isDimmed = selectedLocale !== null && !isAcquired;
        return (
          <points key={x} position={[x, 0, 0]} scale={isAcquired ? 1.65 : isDimmed ? 0.7 : 1}>
            <bufferGeometry>
              <primitive attach="attributes-position" object={attribute} />
            </bufferGeometry>
            <pointsMaterial
              color={index === 0 ? "#69ddff" : "#b9a4ff"}
              size={isAcquired ? 0.16 : 0.11}
              transparent
              opacity={isDimmed ? 0.24 : 0.78}
              depthWrite={false}
            />
          </points>
        );
      })}
    </group>
  );
}

function sameIds(current: ReadonlySet<string>, next: ReadonlySet<string>) {
  return current.size === next.size && [...current].every((id) => next.has(id));
}

function PreviewBudgetTracker({
  activeIdsRef,
}: {
  activeIdsRef: RefObject<ReadonlySet<string>>;
}) {
  const quality = useExperienceStore((state) => state.quality);
  const selectedNodeId = useExperienceStore((state) => state.selectedNodeId);
  const lastUpdateRef = useRef(-Infinity);

  useFrame(({camera, clock}) => {
    if (clock.elapsedTime - lastUpdateRef.current < imageFormationConfig.candidateInterval) {
      return;
    }
    lastUpdateRef.current = clock.elapsedTime;
    const candidates = portfolioNodes
      .map((node) => ({
        id: node.id,
        distance: camera.position.distanceTo(
          previewPosition.fromArray(portfolioNodePositions[node.id]),
        ),
      }))
      .filter(({id, distance}) => (
        id === selectedNodeId || distance <= imageFormationConfig.fragmentsDistance + 2
      ))
      .sort((left, right) => {
        if (left.id === selectedNodeId) return -1;
        if (right.id === selectedNodeId) return 1;
        return left.distance - right.distance;
      })
      .slice(0, imageFormationConfig[quality].activeNodeLimit);
    const nextIds = new Set(candidates.map(({id}) => id));
    if (!sameIds(activeIdsRef.current, nextIds)) activeIdsRef.current = nextIds;
  });

  return null;
}

function Scene({onUnavailable}: UniverseCanvasProps) {
  const activePreviewIdsRef = useRef<ReadonlySet<string>>(new Set());
  const stage = useExperienceStore((state) => state.stage);
  const locale = useExperienceStore((state) => state.locale);
  const quality = useExperienceStore((state) => state.quality);
  const showGateway = stage === "language-selection" || stage === "entering";
  const showUniverse = stage === "overview" || stage === "cluster-focus" || stage === "node-details";
  return <><fog attach="fog" args={["#02060a", 24, 68]} /><ambientLight intensity={0.4} /><DataField />{showGateway && <LanguageGalaxies />}{showUniverse && <><PreviewBudgetTracker activeIdsRef={activePreviewIdsRef} />{clusters.map((cluster) => <SemanticCluster key={cluster.id} cluster={cluster} locale={locale} />)}{portfolioNodes.map((node) => <PortfolioNodeMesh activePreviewIdsRef={activePreviewIdsRef} key={node.id} node={node} position={portfolioNodePositions[node.id]} />)}</>} {(stage === "entering" || showUniverse) && <QueryProbe />}<CameraRig /><AdaptiveDpr pixelated={quality === "low"} /><ContextLossListener onUnavailable={onUnavailable} /></>;
}

export default function UniverseCanvas({onUnavailable}: UniverseCanvasProps) {
  const t = useTranslations("Canvas");
  const quality = useExperienceStore((state) => state.quality);
  const settings = qualitySettings[quality];
  return (
    <div className="universe-canvas" role="region" aria-label={t("label")}>
      <Canvas
        camera={{position: [0, 4, 34], fov: 46, near: 0.1, far: 120}}
        dpr={settings.dpr}
        gl={{antialias: quality !== "low", alpha: false, powerPreference: "high-performance"}}
        performance={{min: 0.55}}
        fallback={null}
      >
        <color attach="background" args={["#02060a"]} />
        <Scene onUnavailable={onUnavailable} />
      </Canvas>
    </div>
  );
}
