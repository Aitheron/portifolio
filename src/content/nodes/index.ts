import aitheron from "./key-projects/aitheron";
import multiAgent from "./key-projects/multi-agent-tariff-intelligence";
import pnExtractor from "./key-projects/pn-extractor";
import llmInfrastructure from "./key-projects/enterprise-llm-infrastructure";
import docguard from "./key-projects/docguard";
import professionalExperience from "./experience-impact/professional-experience";
import softwareEngineering from "./education-research/software-engineering";
import workshop from "./talks-community/workshop-placeholder";
import attendee from "./talks-community/attendee-placeholder";

import {identity} from "@/content/identity";
import {createPortfolioGraph} from "@/lib/portfolio-graph";
import {clusters, getNodePosition} from "@/content/clusters";
import {validatePortfolioNodes} from "@/lib/portfolio-schema";
import type {Vector3Tuple} from "@/lib/portfolio-types";

const registeredNodes = [
  aitheron, multiAgent, pnExtractor, llmInfrastructure, docguard,
  professionalExperience, softwareEngineering, workshop, attendee,
] as const;

export const portfolioNodes = validatePortfolioNodes(registeredNodes);

export const portfolioNodePositions = Object.fromEntries(
  portfolioNodes.map((node) => {
    const clusterNodes = portfolioNodes.filter((candidate) => candidate.cluster === node.cluster);
    const index = clusterNodes.findIndex((candidate) => candidate.id === node.id);
    return [node.id, getNodePosition(node, index, clusterNodes.length)];
  }),
) as Record<string, Vector3Tuple>;

export const portfolioGraph = createPortfolioGraph(portfolioNodes, clusters, identity);
