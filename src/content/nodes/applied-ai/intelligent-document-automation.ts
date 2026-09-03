import type {PortfolioNode} from "@/lib/portfolio-types";

const intelligentDocumentAutomation = {
  id: "intelligent-document-automation",
  slug: "intelligent-document-automation",
  kind: "project",
  cluster: "applied-ai",
  title: {
    pt: "Automação Inteligente de Documentos",
    en: "Intelligent Document Automation",
  },
  summary: {
    pt: "Documentos não estruturados transformados em decisões operacionais verificáveis.",
    en: "Unstructured documents transformed into verifiable operational decisions.",
  },
  description: {
    pt: "Um fluxo de IA orientado à produção para classificação, validação e processamento automatizado de documentos.",
    en: "A production-oriented AI workflow for document classification, validation and automated processing.",
  },
  image: {
    src: "https://picsum.photos/seed/vector-documents/960/540",
    alt: {
      pt: "Visual abstrato usado como capa temporária da automação de documentos",
      en: "Abstract visual used as a temporary cover for document automation",
    },
  },
  technologies: ["Python", "FastAPI", "OCR", "PostgreSQL"],
  tags: ["NLP", "MLOps", "validation"],
  visual: {variant: "data-node", size: 1.05, intensity: 1},
  position: {mode: "auto"},
  relationships: ["multi-agent-retrieval-system", "scalable-ai-api-platform"],
} satisfies PortfolioNode;

export default intelligentDocumentAutomation;
