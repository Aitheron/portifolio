export const locales = ["pt", "en"] as const;
export type AppLocale = (typeof locales)[number];

export const clusterIds = [
  "key-projects", "experience-impact", "education-research", "talks-community",
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

export const relationTypes = ["built-at", "uses", "related-to", "produced", "thesis-of", "impact", "presented-at", "research"] as const;
export const participationRoles = ["speaker", "workshop-host", "mentor", "panelist", "attendee"] as const;
export type SemanticRelation = {targetId: string; type: (typeof relationTypes)[number]};
export type SemanticSatellite = {
  id: string;
  type: "technology" | "concept" | "metric" | "domain";
  label: LocalizedText;
  importance?: number;
  relationTargetId?: string;
};
export type PortfolioImage = {
  src: string;
  alt: LocalizedText;
  category?: "project" | "conceptual" | "event";
};

export type PortfolioNode = {
  id: string;
  slug: string;
  kind: NodeKind;
  cluster: ClusterId;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  image?: PortfolioImage;
  gallery?: PortfolioImage[];
  importance?: "flagship" | "primary" | "secondary";
  participationRole?: (typeof participationRoles)[number];
  provisional?: boolean;
  confidential?: boolean;
  year?: string;
  status?: LocalizedText;
  projectType?: LocalizedText;
  company?: string;
  problem?: LocalizedText;
  solution?: LocalizedText;
  myRole?: LocalizedText;
  impact?: LocalizedText;
  relations?: SemanticRelation[];
  satellites?: SemanticSatellite[];
  technologies: string[];
  tags: string[];
  links?: {
    label: LocalizedText;
    href: string;
    type: "website" | "github" | "article" | "video" | "document";
  }[];
  visual: {
    variant: VisualVariant;
    size?: number;
    intensity?: number;
  };
  position:
    | {mode: "auto"}
    | {mode: "manual"; value: Vector3Tuple};
};

export type IdentityAction = {
  id: string;
  type: "linkedin" | "github" | "email" | "resume";
  label: LocalizedText;
  href?: string | LocalizedText;
  external?: boolean;
  email?: string;
  subject?: string;
  /** Suggested filename for a same-origin resume PDF download. */
  download?: string;
};

export type CoreIdentity = {
  id: string;
  title: LocalizedText;
  primaryRole: LocalizedText;
  secondaryRole: LocalizedText;
  summary: LocalizedText;
  image?: PortfolioImage;
  position: Vector3Tuple;
  satellites: SemanticSatellite[];
  actions: IdentityAction[];
  visual: PortfolioNode["visual"];
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
  | "identity-focus"
  | "cluster-focus"
  | "node-focus"
  | "node-details";

export type NodeRevealState = "signal" | "identity" | "preview" | "selected";
export type PerformanceQuality = "high" | "medium" | "low";

export function isUniverseStage(stage: ExperienceStage): boolean {
  return ["overview", "identity-focus", "cluster-focus", "node-focus", "node-details"].includes(stage);
}

export function resolveLocalizedText(
  text: LocalizedText,
  locale: AppLocale,
): string {
  return text[locale];
}
