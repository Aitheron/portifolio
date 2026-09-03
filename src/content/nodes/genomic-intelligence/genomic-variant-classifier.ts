import type {PortfolioNode} from "@/lib/portfolio-types";

const genomicVariantClassifier = {
  id: "genomic-variant-classifier",
  slug: "genomic-variant-classifier",
  kind: "project",
  cluster: "genomic-intelligence",
  title: {
    pt: "Classificador de Variantes Genômicas",
    en: "Genomic Variant Classifier",
  },
  summary: {
    pt: "Um pipeline interpretável para organizar evidências sobre variantes genômicas.",
    en: "An interpretable pipeline for organizing genomic variant evidence.",
  },
  description: {
    pt: "Um pipeline de aprendizado de máquina para apoiar a classificação e interpretação de variantes genômicas.",
    en: "A machine-learning pipeline for supporting the classification and interpretation of genomic variants.",
  },
  image: {
    src: "https://images.unsplash.com/photo-1582719299074-be127353065f?auto=format&fit=crop&w=960&q=72",
    alt: {
      pt: "Equipamentos de pesquisa genômica em um laboratório",
      en: "Genomic research equipment in a laboratory",
    },
  },
  technologies: ["Python", "scikit-learn", "Pandas", "FastAPI"],
  tags: ["ML", "DNA", "bioinformatics"],
  visual: {variant: "genomic-nebula", size: 1.08, intensity: 1.08},
  position: {mode: "auto"},
  relationships: ["intelligent-document-automation"],
} satisfies PortfolioNode;

export default genomicVariantClassifier;
