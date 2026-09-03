import intelligentDocumentAutomation from "./applied-ai/intelligent-document-automation";
import genomicVariantClassifier from "./genomic-intelligence/genomic-variant-classifier";
import aiWorkshop from "./human-signal/ai-workshop";
import multiAgentRetrieval from "./rag-agents/multi-agent-retrieval";
import scalableAiApi from "./systems-engineering/scalable-ai-api";

import {getNodePosition} from "@/content/clusters";
import {validatePortfolioNodes} from "@/lib/portfolio-schema";
import type {Vector3Tuple} from "@/lib/portfolio-types";

const registeredNodes = [
  intelligentDocumentAutomation,
  genomicVariantClassifier,
  multiAgentRetrieval,
  scalableAiApi,
  aiWorkshop,
] as const;

export const portfolioNodes = validatePortfolioNodes(registeredNodes);

export const portfolioNodePositions = Object.fromEntries(
  portfolioNodes.map((node) => {
    const clusterNodes = portfolioNodes.filter((candidate) => candidate.cluster === node.cluster);
    const index = clusterNodes.findIndex((candidate) => candidate.id === node.id);
    return [node.id, getNodePosition(node, index, clusterNodes.length)];
  }),
) as Record<string, Vector3Tuple>;
