import {locales} from "@/lib/portfolio-types";
import {useEffect, useMemo, useRef} from "react";
import {OrbitControls} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import type {OrbitControls as OrbitControlsImpl} from "three-stdlib";
import {MathUtils, TOUCH, Vector3} from "three";

import {clusterById} from "@/content/clusters";
import {identity} from "@/content/identity";
import {portfolioNodePositions} from "@/content/nodes";
import {getNavigationContext, navigationConfig} from "@/lib/scene-config";
import {resolveElasticBoundaryRadius, shouldReleaseFocus} from "@/lib/scene-navigation";
import {automaticFocusConfig} from "@/lib/automatic-project-focus";
import {useExperienceStore} from "@/store/experience-store";
import {useAutomaticProjectFocus} from "./useAutomaticProjectFocus";

const overviewTarget = new Vector3(0, 0, 0);
const previousTarget = new Vector3();
const targetTranslation = new Vector3();

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const navigatingRef = useRef(true);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const outwardInputRef = useRef(0);
  const inwardInputUntilRef = useRef(0);
  const pinchDistanceRef = useRef(0);
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
  const canExplore = stage === "overview" || stage === "cluster-focus" || stage === "node-focus" || stage === "identity-focus";
  useAutomaticProjectFocus(navigatingRef, inwardInputUntilRef);

  const destinations = useMemo(() => {
    const position = new Vector3().fromArray(navigationConfig.overview.cameraOffset);
    const target = overviewTarget.clone();

    if (stage === "language-selection") {
      position.set(0, 1.5, 23);
    } else if (stage === "entering") {
      const direction = locales.length === 1 ? 0 : -1 + Math.max(0, locales.indexOf(languageSignal ?? locales[0])) * 2 / (locales.length - 1);
      position.set(direction * 5.5, 1.5, 15);
      target.set(direction * 8, 0, 0);
    } else if (stage === "identity-focus") {
      target.fromArray(identity.position);
      position.addVectors(target, new Vector3().fromArray(navigationConfig.nodeFocusOffset));
    } else if (stage === "cluster-focus" && selectedClusterId) {
      const cluster = clusterById[selectedClusterId];
      target.fromArray(cluster.position);
      position.addVectors(target, new Vector3().fromArray(navigationConfig.cluster.cameraOffset));
    } else if ((stage === "node-details" || stage === "node-focus") && selectedNodeId) {
      const nodePosition = portfolioNodePositions[selectedNodeId];
      if (nodePosition) {
        target.fromArray(nodePosition);
        if (stage === "node-details" && viewportWidth > 768) target.x += navigationConfig.nodeCompositionOffset;
        position.addVectors(target, new Vector3().fromArray(stage === "node-focus" ? navigationConfig.nodeFocusOffset : navigationConfig.node.cameraOffset));
      }
    }

    return {position, target};
  }, [cameraResetRevision, languageSignal, selectedClusterId, selectedNodeId, stage, viewportWidth]);

  useEffect(() => {
    navigatingRef.current = true;
    outwardInputRef.current = 0;
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [destinations]);

  useEffect(() => {
    const canvas = gl.domElement;
    const wheel = (event: WheelEvent) => {
      outwardInputRef.current = event.deltaY > 0 ? performance.now() + 180 : 0;
      inwardInputUntilRef.current = event.deltaY < 0 && controlsRef.current?.enabled
        ? performance.now() + automaticFocusConfig.zoomIntentDuration : 0;
    };
    const touch = (event: TouchEvent) => {
      if (event.touches.length !== 2) {pinchDistanceRef.current = 0; return;}
      const [a, b] = event.touches;
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (pinchDistanceRef.current && distance < pinchDistanceRef.current - 1) {
        outwardInputRef.current = performance.now() + 180;
        inwardInputUntilRef.current = 0;
      } else if (pinchDistanceRef.current && distance > pinchDistanceRef.current + 1 && controlsRef.current?.enabled) {
        outwardInputRef.current = 0;
        inwardInputUntilRef.current = performance.now() + automaticFocusConfig.zoomIntentDuration;
      }
      pinchDistanceRef.current = distance;
    };
    canvas.addEventListener("wheel", wheel, {passive: true});
    canvas.addEventListener("touchstart", touch, {passive: true});
    canvas.addEventListener("touchmove", touch, {passive: true});
    canvas.addEventListener("touchend", touch, {passive: true});
    return () => {
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("touchstart", touch);
      canvas.removeEventListener("touchmove", touch);
      canvas.removeEventListener("touchend", touch);
    };
  }, [gl]);

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
        if (stage === "node-focus" && selectedNodeId) {
          useExperienceStore.getState().completeNodeFocus(selectedNodeId);
        }
      }
      return;
    }

    if (!controls || !canExplore) return;
    controls.enabled = true;

    if (shouldReleaseFocus(stage, camera.position.distanceTo(controls.target),
      performance.now() < outwardInputRef.current, navigatingRef.current)) {
      outwardInputRef.current = 0;
      useExperienceStore.getState().navigateBack();
      return;
    }

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
