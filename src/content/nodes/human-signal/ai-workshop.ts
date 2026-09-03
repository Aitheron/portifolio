import type {PortfolioNode} from "@/lib/portfolio-types";

const aiWorkshop = {
  id: "ai-workshop-and-mentoring",
  slug: "ai-workshop-and-mentoring",
  kind: "mentoring",
  cluster: "human-signal",
  title: {
    pt: "Workshop e Mentoria em IA",
    en: "AI Workshop and Mentoring",
  },
  summary: {
    pt: "Conhecimento técnico transformado em conversas práticas e acessíveis.",
    en: "Technical knowledge transformed into practical, accessible conversations.",
  },
  description: {
    pt: "Palestras, workshops e atividades de mentoria com foco em IA aplicada e engenharia de software.",
    en: "Talks, workshops and mentoring activities focused on applied AI and software engineering.",
  },
  technologies: ["Applied AI", "System Design", "Technical Communication"],
  tags: ["workshops", "mentoring", "community"],
  visual: {variant: "human-signal", size: 1.12, intensity: 0.92},
  position: {mode: "auto"},
  relationships: ["intelligent-document-automation"],
} satisfies PortfolioNode;

export default aiWorkshop;
