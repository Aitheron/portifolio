import type {AppLocale} from "@/i18n/routing";

export const clusterIds = [
  "applied-ai",
  "genomic-intelligence",
  "rag-agents",
  "systems-engineering",
  "human-signal",
] as const;

export const nodeKinds = [
  "project",
  "experience",
  "talk",
  "mentoring",
  "education",
] as const;

export const visualVariants = [
  "data-node",
  "genomic-nebula",
  "agent-network",
  "system-module",
  "human-signal",
] as const;

export type ClusterId = (typeof clusterIds)[number];
export type NodeKind = (typeof nodeKinds)[number];
export type VisualVariant = (typeof visualVariants)[number];
export type Vector3Tuple = [number, number, number];

export type LocalizedText = {
  pt: string;
  en: string;
};

export type PortfolioNode = {
  id: string;
  slug: string;
  kind: NodeKind;
  cluster: ClusterId;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  image?: {
    src: string;
    alt: LocalizedText;
  };
  technologies: string[];
  tags: string[];
  links?: {
    label: LocalizedText;
    href: string;
    type: "website" | "github" | "article" | "video";
  }[];
  visual: {
    variant: VisualVariant;
    size?: number;
    intensity?: number;
  };
  position:
    | {mode: "auto"}
    | {mode: "manual"; value: Vector3Tuple};
  relationships?: string[];
};

export type ClusterPattern =
  | "streams"
  | "helix"
  | "network"
  | "topology"
  | "pulse";

export type ClusterDefinition = {
  id: ClusterId;
  title: LocalizedText;
  description: LocalizedText;
  position: Vector3Tuple;
  radius: number;
  color: string;
  secondaryColor: string;
  pattern: ClusterPattern;
};

export type ExperienceStage =
  | "intro"
  | "language-selection"
  | "entering"
  | "overview"
  | "cluster-focus"
  | "node-details";

export type NodeRevealState = "signal" | "identity" | "preview" | "selected";
export type PerformanceQuality = "high" | "medium" | "low";

export function resolveLocalizedText(
  text: LocalizedText,
  locale: AppLocale,
): string {
  return text[locale];
}
