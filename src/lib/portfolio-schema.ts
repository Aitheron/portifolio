import {z} from "zod";
import {portfolioConfig} from "../../portfolio.config";
import clusterContent from "../content/clusters.json";
import profileContent from "../content/profile.json";
import {nodeKinds, participationRoles, relationTypes, visualVariants} from "./portfolio-types";
import type {PortfolioNode} from "./portfolio-types";

const idSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const vectorSchema = z.tuple([z.number(), z.number(), z.number()]);
const visualSchema = z.object({
  variant: z.enum(visualVariants), size: z.number().positive().max(3).optional(),
  intensity: z.number().min(0).max(2).optional(),
}).strict();
export const secureUrlSchema = z.url().refine(value => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}, "Expected an HTTPS URL without credentials");
export const localPathSchema = z.string().regex(/^\/(?!\/)[^\\\s?#]*$/).refine(
  value => { try { return !decodeURIComponent(value).split("/").includes(".."); } catch { return false; } }, "Local paths cannot traverse directories",
);

export function createContentSchemas(config: {locales: readonly string[]; defaultLocale: string; contentSchemaVersion: number}) {
  if (!config.locales.length || new Set(config.locales).size !== config.locales.length || !config.locales.includes(config.defaultLocale)) {
    throw new Error("portfolio.config.ts: locales must be unique, nonempty and contain defaultLocale");
  }
  for (const locale of config.locales) {
    try { new Intl.Locale(locale); } catch { throw new Error(`portfolio.config.ts: invalid locale ${locale}`); }
  }
  if (config.contentSchemaVersion !== 1) throw new Error("portfolio.config.ts: supported contentSchemaVersion is 1");
  const localizedText = z.record(z.string().min(1), z.string().trim().min(1)).superRefine((value, ctx) => {
    if (!value[config.defaultLocale]) ctx.addIssue({code: "custom", path: [config.defaultLocale], message: "Required default-locale translation"});
  });
  const image = z.object({
    src: z.union([localPathSchema, secureUrlSchema]),
    srcByLocale: z.record(z.string().min(1), z.union([localPathSchema, secureUrlSchema])).optional(),
    alt: localizedText.optional(), caption: localizedText.optional(),
    role: z.enum(["cover", "interface", "architecture", "result", "research", "concept", "event", "gallery"]).optional(),
    category: z.enum(["project", "conceptual", "event"]).optional(),
  }).strict();
  const signal = z.object({
    id: idSchema, type: z.enum(["technology", "concept", "metric", "domain"]), label: localizedText,
    showInOrbit: z.boolean().optional(), showInCase: z.boolean().optional(),
    importance: z.number().min(0).max(1).optional(), visualWeight: z.number().min(0).max(2).optional(),
    relationTargetId: idSchema.optional(),
  }).strict();
  const signals = z.array(signal).superRefine((values, ctx) => {
    const ids = new Set<string>();
    values.forEach((value, i) => {
      if (ids.has(value.id)) ctx.addIssue({code: "custom", path: [i, "id"], message: `duplicate signal ${value.id}`});
      ids.add(value.id);
    });
  });
  const block = z.discriminatedUnion("type", [
    z.object({type: z.literal("text"), title: localizedText.optional(), body: localizedText}).strict(),
    image.extend({type: z.literal("image"), presentation: z.object({
      size: z.enum(["inline", "wide", "full"]).optional(), align: z.enum(["left", "center", "right"]).optional(),
    }).strict().optional()}).strict(),
    z.object({type: z.literal("gallery"), images: z.array(image).min(1)}).strict(),
    z.object({type: z.literal("metric"), value: z.string().min(1), label: localizedText, description: localizedText.optional()}).strict(),
    z.object({type: z.literal("link"), label: localizedText, href: secureUrlSchema}).strict(),
  ]);
  const node = z.object({
    schemaVersion: z.literal(1), id: idSchema, slug: idSchema, kind: z.enum(nodeKinds), cluster: idSchema,
    title: localizedText, summary: localizedText, description: localizedText,
    coverImage: image.optional(), gallery: z.array(image).optional(), content: z.array(block).optional(),
    importance: z.enum(["flagship", "primary", "secondary"]).default("primary"),
    participationRole: z.enum(participationRoles).optional(), provisional: z.boolean().optional(), confidential: z.boolean().optional(),
    year: z.string().trim().min(1).optional(), status: localizedText.optional(), projectType: localizedText.optional(),
    company: z.string().trim().min(1).optional(), problem: localizedText.optional(), solution: localizedText.optional(),
    myRole: localizedText.optional(), impact: localizedText.optional(),
    relations: z.array(z.object({targetId: idSchema, type: z.enum(relationTypes), label: localizedText.optional()}).strict()).default([]),
    signals: signals.default([]), technologies: z.array(z.string().trim().min(1)).default([]),
    links: z.array(z.object({label: localizedText, href: secureUrlSchema, type: z.enum(["website", "github", "article", "video", "document"])}).strict()).optional(),
    visual: visualSchema,
    position: z.discriminatedUnion("mode", [z.object({mode: z.literal("auto")}).strict(), z.object({mode: z.literal("manual"), value: vectorSchema}).strict()]),
  }).strict();
  const cluster = z.object({
    id: idSchema, title: localizedText, description: localizedText, position: vectorSchema, radius: z.number().positive(),
    color: z.string().regex(/^#[0-9a-f]{6}$/i), secondaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
    pattern: z.enum(["streams", "helix", "network", "topology", "pulse"]),
  }).strict();
  const destination = z.union([z.literal(""), localPathSchema, secureUrlSchema]);
  const profile = z.object({
    schemaVersion: z.literal(1), id: idSchema, title: localizedText, shortName: z.string().min(1),
    primaryRole: localizedText, secondaryRole: localizedText, summary: localizedText, image: image.optional(),
    intro: z.object({role: localizedText, statement: localizedText, eyebrow: localizedText, status: localizedText}).strict(),
    metadata: z.object({title: localizedText, description: localizedText}).strict(),
    position: vectorSchema, visual: visualSchema, signals,
    actions: z.array(z.object({
      id: idSchema, type: z.enum(["linkedin", "github", "email", "resume"]), label: localizedText,
      href: z.union([destination, z.record(z.string(), destination)]).optional(), external: z.boolean().optional(),
      email: z.email().optional(), subject: z.string().optional(), download: z.string().optional(),
    }).strict()),
  }).strict();
  return {localizedText, image, block, node, profile, clusters: z.object({schemaVersion: z.literal(1), clusters: z.array(cluster).min(1)}).strict()};
}

const schemas = createContentSchemas(portfolioConfig);
export const portfolioNodeSchema = schemas.node;
export const profileSchema = schemas.profile;
export const clusterCollectionSchema = schemas.clusters;

export function parseContent<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) throw new Error(`[portfolio-content] Invalid content\n${result.error.issues.map(issue => `${file}: ${issue.path.join(".") || "root"} — ${issue.message}`).join("\n")}`);
  return result.data;
}

export function validatePortfolioNodes(input: readonly unknown[], options: {
  files?: string[]; clusterIds?: string[]; identityId?: string; schema?: typeof portfolioNodeSchema;
} = {}): PortfolioNode[] {
  const clusterIds = options.clusterIds ?? clusterContent.clusters.map(c => c.id);
  const identityId = options.identityId ?? profileContent.id;
  const nodes = input.map((candidate, index) => parseContent(options.schema ?? portfolioNodeSchema, candidate, options.files?.[index] ?? `registry[${index}]`));
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const id of [identityId, ...clusterIds]) {
    if (ids.has(id)) errors.push(`duplicate ID ${id}`);
    ids.add(id);
  }
  const slugs = new Set<string>();
  nodes.forEach((node, index) => {
    const source = options.files?.[index] ?? node.id;
    if (ids.has(node.id)) errors.push(`${source}: duplicate node ID ${node.id}`);
    if (slugs.has(node.slug)) errors.push(`${source}: duplicate slug ${node.slug}`);
    if (!clusterIds.includes(node.cluster)) errors.push(`${source}: cluster ${node.cluster} does not exist`);
    ids.add(node.id); slugs.add(node.slug);
  });
  nodes.forEach((node, index) => {
    const source = options.files?.[index] ?? node.id;
    const keys = new Set<string>();
    for (const {targetId, type} of node.relations) {
      const key = `${type}:${targetId}`;
      if (keys.has(key)) errors.push(`${source}: duplicate relation ${key}`);
      if (targetId === node.id) errors.push(`${source}: self relation ${key}`);
      keys.add(key);
    }
    for (const target of [...node.relations.map(r => r.targetId), ...node.signals.flatMap(s => s.relationTargetId ? [s.relationTargetId] : [])]) {
      if (!ids.has(target)) errors.push(`${source}: relationship target ${target} does not exist`);
    }
  });
  if (errors.length) throw new Error(`[portfolio-content] Invalid content\n${errors.join("\n")}`);
  return nodes;
}
