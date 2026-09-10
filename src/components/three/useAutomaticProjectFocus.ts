import {useEffect, useMemo, useRef} from "react";
import type {RefObject} from "react";
import {useFrame} from "@react-three/fiber";
import {Vector3} from "three";

import {portfolioNodePositions, portfolioNodes} from "@/content/nodes";
import {automaticFocusConfig, getAutomaticFocusCandidate, trackAutomaticFocus} from "@/lib/automatic-project-focus";
import type {AutomaticFocusProgress} from "@/lib/automatic-project-focus";
import {getProjectVisualRadius} from "@/lib/satellite-layout";
import {useExperienceStore} from "@/store/experience-store";

// Static envelopes include the preview and orbit even while satellites are faint.
const projects = portfolioNodes.filter((node) => node.kind === "project").map((node) => ({
  id: node.id, cluster: node.cluster, position: portfolioNodePositions[node.id], radius: getProjectVisualRadius(node),
}));

export function useAutomaticProjectFocus(
  navigatingRef: RefObject<boolean>, inwardInputUntilRef: RefObject<number>,
) {
  const stage = useExperienceStore((state) => state.stage);
  const selectedNodeId = useExperienceStore((state) => state.selectedNodeId);
  const selectedClusterId = useExperienceStore((state) => state.selectedClusterId);
  const point = useMemo(() => new Vector3(), []);
  const progress = useRef<AutomaticFocusProgress>({candidateId: null, since: 0, sampledAt: 0, ready: false});
  const lastSample = useRef(0);
  const blockedUntil = useRef(0);

  useEffect(() => {
    // Changing context, including Escape/back, requires a fresh inward gesture.
    inwardInputUntilRef.current = 0;
    progress.current = trackAutomaticFocus(progress.current, null, performance.now());
    blockedUntil.current = performance.now() + automaticFocusConfig.releaseCooldown;
  }, [stage, selectedNodeId, selectedClusterId, inwardInputUntilRef]);

  useFrame(({camera}) => {
    const now = performance.now();
    if (now - lastSample.current < automaticFocusConfig.sampleInterval) return;
    lastSample.current = now;
    if ((stage !== "overview" && stage !== "cluster-focus") || selectedNodeId
      || navigatingRef.current || now < blockedUntil.current || now > inwardInputUntilRef.current
      || document.hidden || document.querySelector("dialog[open]")) {
      progress.current = trackAutomaticFocus(progress.current, null, now);
      return;
    }

    const candidates = projects.map((project) => {
      point.fromArray(project.position);
      const distance = point.distanceTo(camera.position);
      point.applyMatrix4(camera.matrixWorldInverse);
      const depth = -point.z;
      // Clip projected rectangles to the viewport so an offscreen neighbor cannot
      // steal dominance. Camera projection also accounts for portrait screens.
      const scaleX = camera.projectionMatrix.elements[0] / Math.max(depth, 0.001);
      const scaleY = camera.projectionMatrix.elements[5] / Math.max(depth, 0.001);
      const screenX = point.x * scaleX;
      const screenY = point.y * scaleY;
      const radiusX = project.radius * scaleX;
      const radiusY = project.radius * 0.65 * scaleY;
      const width = Math.max(0, Math.min(1, screenX + radiusX) - Math.max(-1, screenX - radiusX));
      const height = Math.max(0, Math.min(1, screenY + radiusY) - Math.max(-1, screenY - radiusY));
      return {id: project.id, cluster: project.cluster, distance, screenX, screenY, visibleArea: depth > camera.near ? width * height / 4 : 0};
    });
    const candidate = getAutomaticFocusCandidate(candidates, selectedClusterId);
    progress.current = trackAutomaticFocus(progress.current, candidate?.id ?? null, now);
    if (candidate && progress.current.ready) {
      inwardInputUntilRef.current = 0;
      progress.current = trackAutomaticFocus(progress.current, null, now);
      useExperienceStore.getState().focusNode(candidate.id, candidate.cluster);
    }
  });
}
