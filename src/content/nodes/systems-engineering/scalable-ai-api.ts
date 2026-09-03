import type {PortfolioNode} from "@/lib/portfolio-types";

const scalableAiApi = {
  id: "scalable-ai-api-platform",
  slug: "scalable-ai-api-platform",
  kind: "project",
  cluster: "systems-engineering",
  title: {
    pt: "Plataforma Escalável de APIs de IA",
    en: "Scalable AI API Platform",
  },
  summary: {
    pt: "Uma base modular para operar modelos e serviços com limites claros.",
    en: "A modular foundation for operating models and services with clear boundaries.",
  },
  description: {
    pt: "Uma arquitetura modular de APIs para integrar modelos de IA, workers em segundo plano, bancos de dados e serviços externos.",
    en: "A modular API architecture for integrating AI models, background workers, databases and external services.",
  },
  image: {
    src: "https://picsum.photos/seed/system-topology/960/540",
    alt: {
      pt: "Visual abstrato usado como capa temporária da plataforma de APIs",
      en: "Abstract visual used as a temporary cover for the API platform",
    },
  },
  technologies: ["TypeScript", "FastAPI", "Redis", "PostgreSQL"],
  tags: ["APIs", "distributed-systems", "observability"],
  visual: {variant: "system-module", size: 1.08, intensity: 0.95},
  position: {mode: "auto"},
  relationships: ["intelligent-document-automation", "multi-agent-retrieval-system"],
} satisfies PortfolioNode;

export default scalableAiApi;
