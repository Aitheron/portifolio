import type {PortfolioNode} from "@/lib/portfolio-types";

export default {
  id: "software-engineering", slug: "software-engineering",
  kind: "education", cluster: "education-research", importance: "primary", provisional: true,
  title: {pt: "Engenharia de Software", en: "Software Engineering"},
  summary: {pt: "Formação acadêmica conectada à pesquisa e à construção de sistemas.", en: "Academic background connected to research and building systems."},
  description: {pt: "Espaço reservado para a formação em Engenharia de Software e sua relação com o Aitheron. Informações acadêmicas detalhadas serão adicionadas posteriormente.", en: "A place for the Software Engineering background and its relationship to Aitheron. Detailed academic information will be added later."},
  technologies: [], tags: [],
  visual: {variant: "genomic-nebula", size: 1, intensity: 0.9}, position: {mode: "auto"},
  relations: [{targetId: "aitheron", type: "produced"}], satellites: [],
} satisfies PortfolioNode;
