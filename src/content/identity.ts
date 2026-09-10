import type {CoreIdentity} from "@/lib/portfolio-types";

export const identity: CoreIdentity = {
  id: "marlon",
  title: {pt: "Marlon de Souza", en: "Marlon de Souza"},
  primaryRole: {pt: "Engenheiro de IA Aplicada", en: "Applied AI Engineer"},
  secondaryRole: {pt: "Engenheiro de Software", en: "Software Engineer"},
  summary: {
    pt: "Desenvolvo sistemas de IA aplicada que transformam processos e dados complexos em soluções práticas e prontas para produção.",
    en: "I build applied AI systems that turn complex processes and data into practical, production-ready solutions.",
  },
  position: [0, 0, 0],
  visual: {variant: "human-signal"},
  // Add image: {src, alt: {pt, en}} when the portrait is available.
  // Missing destinations stay disabled; never substitute invented contact links.
  actions: [
    {id: "linkedin", type: "linkedin", label: {pt: "LinkedIn", en: "LinkedIn"}, external: true, href: "https://www.linkedin.com/in/marlon-de-souza-software-engineer/"},
    {id: "github", type: "github", label: {pt: "GitHub", en: "GitHub"}, external: true, href: "https://github.com/Marlon-Souza16/"},
    {id: "email", type: "email", label: {pt: "Email", en: "Email"}, href: "marlondesouzajlle@hotmail.com"},
    {id: "resume", type: "resume", label: {pt: "Currículo", en: "Resume"}},
  ],
  satellites: [
    {id: "applied-ai", type: "domain", label: {pt: "IA Aplicada", en: "Applied AI"}, importance: 1},
    {id: "production-ai", type: "concept", label: {pt: "IA em Produção", en: "AI in Production"}, importance: 0.95},
    {id: "software", type: "domain", label: {pt: "Engenharia de Software", en: "Software Engineering"}, importance: 0.9},
    {id: "machine-learning", type: "concept", label: {pt: "Machine Learning", en: "Machine Learning"}, importance: 0.8},
    {id: "llm-systems", type: "concept", label: {pt: "Sistemas LLM", en: "LLM Systems"}, importance: 0.7},
    {id: "rag-agents", type: "concept", label: {pt: "RAG & Agentes", en: "RAG & Agents"}, importance: 0.6},
  ],
};
