import {portfolioConfig} from "../../portfolio.config";

export const locales = portfolioConfig.locales;
export type AppLocale = string;

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

export type ClusterId = string;
export type NodeKind = (typeof nodeKinds)[number];
export type VisualVariant = (typeof visualVariants)[number];
export type Vector3Tuple = [number, number, number];

export type LocalizedText = Record<string, string>;

export const relationTypes = ["built-at", "uses", "related-to", "produced", "thesis-of", "impact", "presented-at", "research"] as const;
export const participationRoles = ["speaker", "workshop-host", "mentor", "panelist", "attendee"] as const;
export type SemanticRelation = {targetId: string; type: (typeof relationTypes)[number]; label?: LocalizedText};
export type SemanticSatellite = {
  id: string;
  type: "technology" | "concept" | "metric" | "domain";
  label: LocalizedText;
  showInOrbit?: boolean;
  showInCase?: boolean;
  visualWeight?: number;
  importance?: number;
  relationTargetId?: string;
};
export type PortfolioImage = {
  src: string;
  srcByLocale?: Record<string, string>;
  alt?: LocalizedText;
  caption?: LocalizedText;
  role?: "cover" | "interface" | "architecture" | "result" | "research" | "concept" | "event" | "gallery";
  category?: "project" | "conceptual" | "event";
};

export type ProjectDocument = {type: "document"; label: LocalizedText; href: string | LocalizedText};
export type ProjectLink = ProjectDocument | {
  type: "website" | "github" | "article" | "video";
  label: LocalizedText;
  href: string;
};

export type ContentBlock =
  | {type: "text"; title?: LocalizedText; body: LocalizedText}
  | ({type: "image"; presentation?: {size?: "inline" | "wide" | "full"; align?: "left" | "center" | "right"}} & PortfolioImage)
  | {type: "gallery"; images: PortfolioImage[]}
  | {type: "metric"; value: string; label: LocalizedText; description?: LocalizedText}
  | {type: "link"; label: LocalizedText; href: string}
  | ProjectDocument;

export type PortfolioNode = {
  schemaVersion?: number;
  content?: ContentBlock[];
  id: string;
  slug: string;
  kind: NodeKind;
  cluster: ClusterId;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  coverImage?: PortfolioImage;
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
  signals?: SemanticSatellite[];
  technologies: string[];
  links?: ProjectLink[];
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
  schemaVersion?: number;
  shortName?: string;
  intro?: Record<string, LocalizedText>;
  metadata?: Record<string, LocalizedText>;
  signals: SemanticSatellite[];
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
  text: LocalizedText | undefined,
  locale: AppLocale,
): string {
  return text?.[locale] ?? text?.[portfolioConfig.defaultLocale] ?? "";
}

export function resolveImageSource(image: PortfolioImage, locale: AppLocale): string {
  return image.srcByLocale?.[locale] ?? image.src;
}

/** Keep the media collection without repeating images already placed in the case. */
export function remainingGalleryImages(node: PortfolioNode): PortfolioImage[] {
  const placed = new Set(node.content?.flatMap(block =>
    block.type === "image" ? [block.src] : block.type === "gallery" ? block.images.map(image => image.src) : [],
  ));
  return node.gallery?.filter(image => !placed.has(image.src)) ?? [];
}
