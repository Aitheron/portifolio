import type {
  ClusterDefinition,
  ClusterId,
  PortfolioNode,
  Vector3Tuple,
} from "@/lib/portfolio-types";

export const clusters: readonly ClusterDefinition[] = [
  {id: "key-projects", title: {pt: "Projetos-chave", en: "Key Projects"},
    description: {pt: "Projetos que conectam pesquisa, engenharia e IA aplicada.", en: "Projects connecting research, engineering and applied AI."},
    position: [20, 1, -4], radius: 8.5, color: "#5ad7ff", secondaryColor: "#d9f7ff", pattern: "network"},
  {id: "experience-impact", title: {pt: "Experiência & Impacto", en: "Experience & Impact"},
    description: {pt: "Contexto profissional e impacto de sistemas no mundo real.", en: "Professional context and the impact of real-world systems."},
    position: [0, -14, 2], radius: 6, color: "#75b7c9", secondaryColor: "#d9f1f5", pattern: "topology"},
  {id: "education-research", title: {pt: "Formação & Pesquisa", en: "Education & Research"},
    description: {pt: "Engenharia de Software, pesquisa e suas conexões com projetos.", en: "Software Engineering, research and their connections to projects."},
    position: [-18, 1, -6], radius: 6, color: "#8f8cff", secondaryColor: "#dbd9ff", pattern: "helix"},
  {id: "talks-community", title: {pt: "Palestras & Comunidade", en: "Talks & Community"},
    description: {pt: "Conhecimento compartilhado em palestras, encontros e mentoria.", en: "Knowledge shared through talks, gatherings and mentoring."},
    position: [-1, 14, -6], radius: 6, color: "#ffad66", secondaryColor: "#ffe2bd", pattern: "pulse"},
];

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
  const radialDistance = cluster.radius * radialVariation * importanceRadius;

  return [
    cluster.position[0] + Math.cos(angle) * radialDistance,
    cluster.position[1] + Math.sin(angle) * radialDistance * 0.65,
    cluster.position[2] + depth,
  ];
}
