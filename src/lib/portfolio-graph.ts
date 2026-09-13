import type {ClusterDefinition, ClusterId, LocalizedText, NodeKind, PortfolioNode, SemanticSatellite} from "./portfolio-types";

export type GraphTarget = {
  id: string;
  title: LocalizedText;
  kind: NodeKind | "identity" | "cluster";
  cluster?: ClusterId;
};

export function createPortfolioGraph(
  nodes: readonly PortfolioNode[], clusters: readonly ClusterDefinition[],
  identity: {id: string; title: LocalizedText; signals?: readonly SemanticSatellite[]},
): ReadonlyMap<string, GraphTarget> {
  const targets: GraphTarget[] = [
    {...identity, kind: "identity"},
    ...clusters.map((cluster) => ({id: cluster.id, title: cluster.title, kind: "cluster" as const, cluster: cluster.id})),
    ...nodes.map(({id, title, kind, cluster}) => ({id, title, kind, cluster})),
  ];
  const graph = new Map<string, GraphTarget>();
  for (const target of targets) {
    if (graph.has(target.id)) throw new Error(`Duplicate graph target: ${target.id}`);
    graph.set(target.id, target);
  }
  for (const signal of identity.signals ?? []) {
    if (signal.relationTargetId && !graph.has(signal.relationTargetId)) {
      throw new Error(`${identity.id}: signals.${signal.id}.relationTargetId ${signal.relationTargetId} does not exist`);
    }
  }
  for (const node of nodes) {
    if (graph.get(node.cluster)?.kind !== "cluster") {
      throw new Error(`${node.id}: cluster anchor ${node.cluster} is absent from the graph`);
    }
    const references = [
      ...(node.relations ?? []).map(({targetId}) => targetId),
      ...(node.signals ?? []).flatMap(({relationTargetId}) => relationTargetId ? [relationTargetId] : []),
    ];
    for (const targetId of references) {
      if (!graph.has(targetId)) throw new Error(`${node.id}: graph target ${targetId} does not exist`);
    }
  }
  return graph;
}
