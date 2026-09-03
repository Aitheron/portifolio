import type {PortfolioNode} from "@/lib/portfolio-types";

const multiAgentRetrieval = {
  id: "multi-agent-retrieval-system",
  slug: "multi-agent-retrieval-system",
  kind: "project",
  cluster: "rag-agents",
  title: {
    pt: "Sistema de Recuperação Multiagente",
    en: "Multi-Agent Retrieval System",
  },
  summary: {
    pt: "Agentes especializados cooperam para recuperar, avaliar e sintetizar evidências.",
    en: "Specialized agents cooperate to retrieve, evaluate and synthesize evidence.",
  },
  description: {
    pt: "Uma arquitetura multiagente aumentada por recuperação, com planejamento, busca, validação e geração de respostas.",
    en: "A retrieval-augmented multi-agent architecture with planning, retrieval, validation and answer generation.",
  },
  technologies: ["Python", "LangGraph", "FastAPI", "Vector Retrieval"],
  tags: ["RAG", "agents", "evaluation"],
  visual: {variant: "agent-network", size: 1.04, intensity: 1.12},
  position: {mode: "auto"},
  relationships: ["scalable-ai-api-platform"],
} satisfies PortfolioNode;

export default multiAgentRetrieval;
