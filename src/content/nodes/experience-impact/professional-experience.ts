import type {PortfolioNode} from "@/lib/portfolio-types";

export default {
  id: "professional-experience", slug: "professional-experience",
  kind: "experience", cluster: "experience-impact", importance: "primary", provisional: true,
  title: {pt: "Experiência Profissional", en: "Professional Experience"},
  summary: {pt: "Da engenharia de software à IA aplicada e aos sistemas em produção.", en: "From software engineering to applied AI and production systems."},
  description: {pt: "Contexto profissional provisório. Trajetória, responsabilidades e evidências de impacto serão documentadas posteriormente.", en: "Provisional professional context. Career progression, responsibilities and impact evidence will be documented later."},
  technologies: [], tags: [],
  visual: {variant: "system-module", size: 1.05, intensity: 1}, position: {mode: "auto"},
  relations: [
    {targetId: "multi-agent-tariff-intelligence", type: "produced"},
    {targetId: "pn-extractor", type: "produced"},
    {targetId: "enterprise-llm-infrastructure", type: "produced"},
  ], satellites: [],
} satisfies PortfolioNode;
