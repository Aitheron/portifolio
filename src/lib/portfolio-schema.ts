import {z} from "zod";

import {clusterIds, nodeKinds, visualVariants} from "./portfolio-types";
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

export const portfolioNodeSchema = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    kind: z.enum(nodeKinds),
    cluster: z.enum(clusterIds),
    title: localizedTextSchema,
    summary: localizedTextSchema,
    description: localizedTextSchema,
    image: z
      .object({src: imageSourceSchema, alt: localizedTextSchema})
      .strict()
      .optional(),
    technologies: z.array(z.string().trim().min(1)).min(1),
    tags: z.array(z.string().trim().min(1)),
    links: z
      .array(
        z
          .object({
            label: localizedTextSchema,
            href: secureUrlSchema,
            type: z.enum(["website", "github", "article", "video"]),
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
    relationships: z.array(z.string().trim().min(1)).optional(),
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

  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const node of validNodes) {
    if (ids.has(node.id)) errors.push(`${node.id}: duplicate node ID`);
    if (slugs.has(node.slug)) errors.push(`${node.id}: duplicate slug ${node.slug}`);
    ids.add(node.id);
    slugs.add(node.slug);
  }

  for (const node of validNodes) {
    for (const relationship of node.relationships ?? []) {
      if (!ids.has(relationship)) {
        errors.push(`${node.id}: relationship target ${relationship} does not exist`);
      }
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
