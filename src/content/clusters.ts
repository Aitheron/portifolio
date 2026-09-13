import type {
  ClusterDefinition,
  ClusterId,
  PortfolioNode,
  Vector3Tuple,
} from "@/lib/portfolio-types";
import {getProjectVisualRadius, projectVisualSafetyMargin} from "../lib/satellite-layout";

import rawClusters from "./clusters.json";
import {clusterCollectionSchema, parseContent} from "../lib/portfolio-schema";

export const clusters: readonly ClusterDefinition[] = parseContent(clusterCollectionSchema, rawClusters, "src/content/clusters.json").clusters;

export const clusterById = Object.fromEntries(
  clusters.map((cluster) => [cluster.id, cluster]),
) as Record<ClusterId, ClusterDefinition>;

function hashId(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getNodePosition(
  node: PortfolioNode,
  index: number,
  total: number,
): Vector3Tuple {
  if (node.position.mode === "manual") return node.position.value;

  const cluster = clusterById[node.cluster];
  const hash = hashId(node.id);
  const safeTotal = Math.max(total, 1);
  // Share the angular phase so different ID hashes cannot crowd adjacent nodes.
  const angle = index * Math.PI * 2 / safeTotal + ((hashId(cluster.id) % 360) * Math.PI) / 180;
  const depth = ((hash % 1000) / 999 - 0.5) * cluster.radius * 0.65;
  const radialVariation = 0.84 + ((hash >>> 10) % 100) / 625;
  const importanceRadius = node.importance === "flagship" ? 0.8 : node.importance === "secondary" ? 1.1 : 1;
  // Reserve the whole micro-universe along the shared elliptical ring. Positions
  // are computed once by the registry; this adds no per-frame collision work.
  const visualSpacingRadius = node.kind === "project" && safeTotal > 1
    ? (2 * getProjectVisualRadius(node) + projectVisualSafetyMargin) / (2 * Math.sin(Math.PI / safeTotal))
    : 0;
  const radialDistance = Math.max(cluster.radius * radialVariation * importanceRadius, visualSpacingRadius);

  return [
    cluster.position[0] + Math.cos(angle) * radialDistance,
    cluster.position[1] + Math.sin(angle) * radialDistance * 0.65,
    cluster.position[2] + depth,
  ];
}
