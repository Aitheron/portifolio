import type {LocalizedText, SemanticSatellite, Vector3Tuple} from "@/lib/portfolio-types";

export const identity = {
  id: "marlon",
  title: {pt: "Marlon de Souza", en: "Marlon de Souza"},
  primaryRole: {pt: "Engenheiro de IA Aplicada", en: "Applied AI Engineer"},
  secondaryRole: {pt: "Engenheiro de Software", en: "Software Engineer"},
  position: [0, 0, 0] as Vector3Tuple,
  satellites: [
    {id: "applied-ai", type: "domain", label: {pt: "IA Aplicada", en: "Applied AI"}, importance: 1},
    {id: "production-ai", type: "concept", label: {pt: "IA em Produção", en: "AI in Production"}, importance: 0.95},
    {id: "software", type: "domain", label: {pt: "Engenharia de Software", en: "Software Engineering"}, importance: 0.9},
    {id: "machine-learning", type: "concept", label: {pt: "Machine Learning", en: "Machine Learning"}, importance: 0.8},
    {id: "llm-systems", type: "concept", label: {pt: "Sistemas LLM", en: "LLM Systems"}, importance: 0.7},
    {id: "rag-agents", type: "concept", label: {pt: "RAG & Agentes", en: "RAG & Agents"}, importance: 0.6},
  ] as SemanticSatellite[],
} satisfies {id: string; title: LocalizedText; primaryRole: LocalizedText; secondaryRole: LocalizedText; position: Vector3Tuple; satellites: SemanticSatellite[]};
