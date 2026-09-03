import type {
  ClusterDefinition,
  ClusterId,
  PortfolioNode,
  Vector3Tuple,
} from "@/lib/portfolio-types";

export const clusters: readonly ClusterDefinition[] = [
  {
    id: "applied-ai",
    title: {pt: "IA Aplicada", en: "Applied AI"},
    description: {
      pt: "Fluxos inteligentes construídos para operar no mundo real.",
      en: "Intelligent workflows built to operate in the real world.",
    },
    position: [-12, 5, -3],
    radius: 5.4,
    color: "#5ad7ff",
    secondaryColor: "#d9f7ff",
    pattern: "streams",
  },
  {
    id: "genomic-intelligence",
    title: {pt: "Inteligência Genômica", en: "Genomic Intelligence"},
    description: {
      pt: "Aprendizado de máquina aplicado à complexidade dos sinais genômicos.",
      en: "Machine learning applied to the complexity of genomic signals.",
    },
    position: [12, 6, -7],
    radius: 5.2,
    color: "#8f8cff",
    secondaryColor: "#dbd9ff",
    pattern: "helix",
  },
  {
    id: "rag-agents",
    title: {pt: "RAG e Agentes", en: "RAG & Agents"},
    description: {
      pt: "Redes de recuperação, planejamento e validação de conhecimento.",
      en: "Networks for knowledge retrieval, planning and validation.",
    },
    position: [0, -1, 0],
    radius: 5.6,
    color: "#5f86ff",
    secondaryColor: "#d4deff",
    pattern: "network",
  },
  {
    id: "systems-engineering",
    title: {pt: "Engenharia de Sistemas", en: "Systems Engineering"},
    description: {
      pt: "Arquiteturas modulares que conectam modelos, APIs e serviços.",
      en: "Modular architectures connecting models, APIs and services.",
    },
    position: [-11, -7, 8],
    radius: 5.1,
    color: "#75b7c9",
    secondaryColor: "#d9f1f5",
    pattern: "topology",
  },
  {
    id: "human-signal",
    title: {pt: "Sinal Humano", en: "Human Signal"},
    description: {
      pt: "Conhecimento compartilhado em conversas, mentoria e comunidade.",
      en: "Knowledge shared through talks, mentoring and community.",
    },
    position: [12, -6, 8],
    radius: 5,
    color: "#ffad66",
    secondaryColor: "#ffe2bd",
    pattern: "pulse",
  },
] as const;

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
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const angle = index * goldenAngle + ((hash % 360) * Math.PI) / 180;
  const verticalBand = ((hash % 1000) / 999 - 0.5) * cluster.radius * 0.9;
  const radialVariation = 0.52 + ((hash >>> 10) % 100) / 250;
  const radialDistance = cluster.radius * radialVariation;
  const distributionOffset = (index / safeTotal - 0.5) * 0.5;

  return [
    cluster.position[0] + Math.cos(angle) * radialDistance,
    cluster.position[1] + verticalBand + distributionOffset,
    cluster.position[2] + Math.sin(angle) * radialDistance,
  ];
}
