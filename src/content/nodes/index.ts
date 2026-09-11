import {identity} from "@/content/identity";
import {createPortfolioGraph} from "@/lib/portfolio-graph";
import {clusters, getNodePosition} from "@/content/clusters";
import {validatePortfolioNodes} from "@/lib/portfolio-schema";
import type {Vector3Tuple} from "@/lib/portfolio-types";

import {contentEntries} from "../registry";

export const portfolioNodes = validatePortfolioNodes(contentEntries.map(({data}) => data), {files: contentEntries.map(({file}) => file)});

export const portfolioNodePositions = Object.fromEntries(
  portfolioNodes.map((node) => {
    const clusterNodes = portfolioNodes.filter((candidate) => candidate.cluster === node.cluster);
    const index = clusterNodes.findIndex((candidate) => candidate.id === node.id);
    return [node.id, getNodePosition(node, index, clusterNodes.length)];
  }),
) as Record<string, Vector3Tuple>;

export const portfolioGraph = createPortfolioGraph(portfolioNodes, clusters, identity);
