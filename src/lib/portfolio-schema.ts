import {z} from "zod";

import {clusterIds, nodeKinds, participationRoles, relationTypes, visualVariants} from "./portfolio-types";
import type {PortfolioNode} from "./portfolio-types";

const localizedTextSchema = z
  .object({
    pt: z.string().trim().min(1),
    en: z.string().trim().min(1),
  })
  .strict();

const imageSourceSchema = z.string().trim().refine(
  (value) => value.startsWith("/") || z.url().safeParse(value).success,
  "Expected an absolute URL or a local path beginning with /",
);

const secureUrlSchema = z
  .url()
  .refine((value) => new URL(value).protocol === "https:", "Expected an HTTPS URL");

const portfolioImageSchema = z.object({
  src: imageSourceSchema, alt: localizedTextSchema,
  category: z.enum(["project", "conceptual", "event"]).optional(),
}).strict();

export const portfolioNodeSchema = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    kind: z.enum(nodeKinds),
    cluster: z.enum(clusterIds),
    title: localizedTextSchema,
    summary: localizedTextSchema,
    description: localizedTextSchema,
    image: portfolioImageSchema.optional(),
    gallery: z.array(portfolioImageSchema).max(8).optional(),
    importance: z.enum(["flagship", "primary", "secondary"]).default("primary"),
    participationRole: z.enum(participationRoles).optional(),
    provisional: z.boolean().optional(),
    confidential: z.boolean().optional(),
    year: z.string().trim().min(1).optional(),
    status: localizedTextSchema.optional(),
    projectType: localizedTextSchema.optional(),
    company: z.string().trim().min(1).optional(),
    problem: localizedTextSchema.optional(),
    solution: localizedTextSchema.optional(),
    myRole: localizedTextSchema.optional(),
    impact: localizedTextSchema.optional(),
    relations: z.array(z.object({targetId: z.string().min(1), type: z.enum(relationTypes)}).strict()).default([]),
    satellites: z.array(z.object({
      id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      type: z.enum(["technology", "concept", "metric", "domain"]),
      label: localizedTextSchema,
      importance: z.number().min(0).max(1).optional(),
      relationTargetId: z.string().min(1).optional(),
    }).strict()).max(7).default([]),
    technologies: z.array(z.string().trim().min(1)).default([]),
    tags: z.array(z.string().trim().min(1)).default([]),
    links: z
      .array(
        z
          .object({
            label: localizedTextSchema,
            href: secureUrlSchema,
            type: z.enum(["website", "github", "article", "video", "document"]),
          })
          .strict(),
      )
      .optional(),
    visual: z
      .object({
        variant: z.enum(visualVariants),
        size: z.number().positive().max(3).optional(),
        intensity: z.number().min(0).max(2).optional(),
      })
      .strict(),
    position: z.discriminatedUnion("mode", [
      z.object({mode: z.literal("auto")}).strict(),
      z
        .object({
          mode: z.literal("manual"),
          value: z.tuple([z.number(), z.number(), z.number()]),
        })
        .strict(),
    ]),
  })
  .strict();

function describeIssues(id: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const field = issue.path.length > 0 ? issue.path.join(".") : "node";
    return `${id}: ${field} — ${issue.message}`;
  });
}

export function validatePortfolioNodes(input: readonly unknown[]): PortfolioNode[] {
  const validNodes: PortfolioNode[] = [];
  const errors: string[] = [];

  input.forEach((candidate, index) => {
    const candidateId =
      typeof candidate === "object" && candidate !== null && "id" in candidate
        ? String(candidate.id)
        : `registry[${index}]`;
    const result = portfolioNodeSchema.safeParse(candidate);

    if (result.success) {
      validNodes.push(result.data);
    } else {
      errors.push(...describeIssues(candidateId, result.error));
    }
  });

  const ids = new Set<string>(["marlon", ...clusterIds]);
  const slugs = new Set<string>();

  for (const node of validNodes) {
    if (ids.has(node.id)) errors.push(`${node.id}: duplicate node ID`);
    if (slugs.has(node.slug)) errors.push(`${node.id}: duplicate slug ${node.slug}`);
    ids.add(node.id);
    slugs.add(node.slug);
  }

  for (const node of validNodes) {
    const relationKeys = new Set<string>();
    for (const {targetId, type} of node.relations ?? []) {
      const key = `${type}:${targetId}`;
      if (relationKeys.has(key)) errors.push(`${node.id}: duplicate relation ${key}`);
      relationKeys.add(key);
    }
    const satelliteIds = new Set<string>();
    for (const satellite of node.satellites ?? []) {
      if (satelliteIds.has(satellite.id)) errors.push(`${node.id}: duplicate satellite ${satellite.id}`);
      satelliteIds.add(satellite.id);
    }
    const targets = [
      ...(node.relations ?? []).map(({targetId}) => targetId),
      ...(node.satellites ?? []).flatMap(({relationTargetId}) => relationTargetId ? [relationTargetId] : []),
    ];
    for (const target of targets) {
      if (!ids.has(target)) errors.push(`${node.id}: relationship target ${target} does not exist`);
    }
  }

  if (errors.length > 0) {
    const message = `[portfolio-content] Invalid registry:\n${errors.join("\n")}`;
    const isStrictBuild =
      process.env.NODE_ENV !== "production" ||
      process.env.npm_lifecycle_event === "build";

    if (isStrictBuild) throw new Error(message);
    console.error(message);
  }

  return errors.length === 0 ? validNodes : validNodes.filter((node) => {
    const nodePrefix = `${node.id}:`;
    return !errors.some((error) => error.startsWith(nodePrefix));
  });
}
