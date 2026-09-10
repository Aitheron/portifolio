import type {ClusterDefinition, ClusterId, LocalizedText, NodeKind, PortfolioNode} from "./portfolio-types";

export type GraphTarget = {
  id: string;
  title: LocalizedText;
  kind: NodeKind | "identity" | "cluster";
  cluster?: ClusterId;
};

export function createPortfolioGraph(
  nodes: readonly PortfolioNode[], clusters: readonly ClusterDefinition[],
  identity: {id: string; title: LocalizedText},
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
  for (const node of nodes) {
    if (graph.get(node.cluster)?.kind !== "cluster") {
      throw new Error(`${node.id}: cluster anchor ${node.cluster} is absent from the graph`);
    }
    const references = [
      ...(node.relations ?? []).map(({targetId}) => targetId),
      ...(node.satellites ?? []).flatMap(({relationTargetId}) => relationTargetId ? [relationTargetId] : []),
    ];
    for (const targetId of references) {
      if (!graph.has(targetId)) throw new Error(`${node.id}: graph target ${targetId} does not exist`);
    }
  }
  return graph;
}
