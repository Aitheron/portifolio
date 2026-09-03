import {useEffect, useMemo, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import type {OrbitControls as OrbitControlsImpl} from "three-stdlib";
import {MathUtils, Vector3} from "three";

import {clusterById} from "@/content/clusters";
import {portfolioNodePositions} from "@/content/nodes";
import {useExperienceStore} from "@/store/experience-store";

const overviewPosition = new Vector3(0, 4, 34);
const overviewTarget = new Vector3(0, 0, 0);

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const navigatingRef = useRef(true);
  const camera = useThree((state) => state.camera);
  const stage = useExperienceStore((state) => state.stage);
  const selectedClusterId = useExperienceStore((state) => state.selectedClusterId);
  const selectedNodeId = useExperienceStore((state) => state.selectedNodeId);
  const languageSignal = useExperienceStore((state) => state.languageSignal);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);

  const destinations = useMemo(() => {
    const position = overviewPosition.clone();
    const target = overviewTarget.clone();

    if (stage === "language-selection") {
      position.set(0, 1.5, 23);
    } else if (stage === "entering") {
      const direction = languageSignal === "pt" ? -1 : 1;
      position.set(direction * 5.5, 1.5, 15);
      target.set(direction * 8, 0, 0);
    } else if (stage === "cluster-focus" && selectedClusterId) {
      const cluster = clusterById[selectedClusterId];
      target.fromArray(cluster.position);
      position.copy(target).add(new Vector3(0, 2.5, 10.5));
    } else if (stage === "node-details" && selectedNodeId) {
      const nodePosition = portfolioNodePositions[selectedNodeId];
      if (nodePosition) {
        target.fromArray(nodePosition);
        position.copy(target).add(new Vector3(0.5, 1.25, 7.25));
      }
    }

    return {position, target};
  }, [languageSignal, selectedClusterId, selectedNodeId, stage]);

  useEffect(() => {
    navigatingRef.current = true;
  }, [destinations]);

  useFrame((_, delta) => {
    const damping = reducedMotion ? 18 : 4.2;
    const controls = controlsRef.current;

    if (navigatingRef.current) {
      camera.position.x = MathUtils.damp(camera.position.x, destinations.position.x, damping, delta);
      camera.position.y = MathUtils.damp(camera.position.y, destinations.position.y, damping, delta);
      camera.position.z = MathUtils.damp(camera.position.z, destinations.position.z, damping, delta);
    }

    if (controls && navigatingRef.current) {
      controls.target.lerp(destinations.target, 1 - Math.exp(-damping * delta));
      controls.update();
      if (
        camera.position.distanceTo(destinations.position) < 0.04 &&
        controls.target.distanceTo(destinations.target) < 0.04
      ) {
        navigatingRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={stage === "overview" || stage === "cluster-focus"}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={7}
      maxDistance={44}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.82}
      regress
    />
  );
}
