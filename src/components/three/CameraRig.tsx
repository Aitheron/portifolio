import {useEffect, useMemo, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import type {OrbitControls as OrbitControlsImpl} from "three-stdlib";
import {MathUtils, TOUCH, Vector3} from "three";

import {clusterById} from "@/content/clusters";
import {portfolioNodePositions} from "@/content/nodes";
import {getNavigationContext, navigationConfig} from "@/lib/scene-config";
import {resolveElasticBoundaryRadius} from "@/lib/scene-navigation";
import {useExperienceStore} from "@/store/experience-store";

const overviewTarget = new Vector3(0, 0, 0);
const correctionTarget = new Vector3();
const previousTarget = new Vector3();
const targetTranslation = new Vector3();
const cameraDirection = new Vector3();

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const navigatingRef = useRef(true);
  const camera = useThree((state) => state.camera);
  const viewportWidth = useThree((state) => state.size.width);
  const stage = useExperienceStore((state) => state.stage);
  const selectedClusterId = useExperienceStore((state) => state.selectedClusterId);
  const selectedNodeId = useExperienceStore((state) => state.selectedNodeId);
  const languageSignal = useExperienceStore((state) => state.languageSignal);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const quality = useExperienceStore((state) => state.quality);
  const cameraResetRevision = useExperienceStore((state) => state.cameraResetRevision);
  const context = getNavigationContext(stage);
  const profile = navigationConfig[context];
  const canExplore = stage === "overview" || stage === "cluster-focus";

  const destinations = useMemo(() => {
    const position = new Vector3().fromArray(navigationConfig.overview.cameraOffset);
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
      position.addVectors(target, new Vector3().fromArray(navigationConfig.cluster.cameraOffset));
    } else if (stage === "node-details" && selectedNodeId) {
      const nodePosition = portfolioNodePositions[selectedNodeId];
      if (nodePosition) {
        target.fromArray(nodePosition);
        if (viewportWidth > 768) target.x += navigationConfig.nodeCompositionOffset;
        position.addVectors(target, new Vector3().fromArray(navigationConfig.node.cameraOffset));
      }
    }

    return {position, target};
  }, [cameraResetRevision, languageSignal, selectedClusterId, selectedNodeId, stage, viewportWidth]);

  useEffect(() => {
    navigatingRef.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [destinations]);

  useFrame((_, delta) => {
    const damping = reducedMotion
      ? navigationConfig.reducedMotionDamping
      : navigationConfig.transitionDamping;
    const controls = controlsRef.current;

    if (navigatingRef.current) {
      camera.position.x = MathUtils.damp(camera.position.x, destinations.position.x, damping, delta);
      camera.position.y = MathUtils.damp(camera.position.y, destinations.position.y, damping, delta);
      camera.position.z = MathUtils.damp(camera.position.z, destinations.position.z, damping, delta);
    }

    if (controls && navigatingRef.current) {
      controls.target.lerp(destinations.target, 1 - Math.exp(-damping * delta));
      camera.lookAt(controls.target);
      if (
        camera.position.distanceTo(destinations.position) < navigationConfig.arrivalDistance &&
        controls.target.distanceTo(destinations.target) < navigationConfig.targetArrivalDistance
      ) {
        navigatingRef.current = false;
        controls.target.copy(destinations.target);
        controls.enabled = canExplore;
        controls.update();
      }
      return;
    }

    if (!controls || !canExplore) return;
    controls.enabled = true;

    const targetWorldDistance = controls.target.length();
    const boundedTargetDistance = resolveElasticBoundaryRadius(
      targetWorldDistance,
      navigationConfig.worldBoundary.target,
      delta,
    );
    if (boundedTargetDistance < targetWorldDistance) {
      previousTarget.copy(controls.target);
      controls.target.setLength(boundedTargetDistance);
      targetTranslation.copy(controls.target).sub(previousTarget);
      camera.position.add(targetTranslation);
    }

    const targetDistance = camera.position.distanceTo(controls.target);
    if (targetDistance > profile.softDistance) {
      cameraDirection.copy(camera.position).sub(controls.target).normalize();
      correctionTarget
        .copy(controls.target)
        .addScaledVector(cameraDirection, profile.softDistance);
      const excessRatio = Math.min(
        1,
        (targetDistance - profile.softDistance) /
          (profile.maxDistance - profile.softDistance),
      );
      camera.position.lerp(
        correctionTarget,
        1 - Math.exp(
          -navigationConfig.worldBoundary.camera.correctionStrength * excessRatio * delta,
        ),
      );
    }

    const worldDistance = camera.position.length();
    const boundedCameraDistance = resolveElasticBoundaryRadius(
      worldDistance,
      navigationConfig.worldBoundary.camera,
      delta,
    );
    if (boundedCameraDistance < worldDistance) {
      camera.position.setLength(boundedCameraDistance);
      camera.lookAt(controls.target);
    }
  });

  return (
    <OrbitControls
      key={`${stage}:${selectedClusterId ?? "none"}:${selectedNodeId ?? "none"}:${cameraResetRevision}`}
      ref={controlsRef}
      enabled={false}
      enablePan
      enableDamping
      dampingFactor={0.085}
      minDistance={profile.minDistance}
      maxDistance={Math.min(
        profile.maxDistance,
        navigationConfig.worldBoundary.camera.hardRadius,
      )}
      minPolarAngle={navigationConfig.polarRange[0]}
      maxPolarAngle={navigationConfig.polarRange[1]}
      panSpeed={profile.panSpeed}
      rotateSpeed={profile.rotateSpeed * (quality === "low" ? 0.82 : 1)}
      screenSpacePanning
      zoomSpeed={profile.zoomSpeed}
      zoomToCursor
      touches={{ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN}}
      regress
    />
  );
}
