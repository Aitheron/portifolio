import aitheron from "./projects/aitheron.json";
import multiAgent from "./projects/multi-agent-tariff-intelligence.json";
import pnExtractor from "./projects/pn-extractor.json";
import llmInfrastructure from "./projects/enterprise-llm-infrastructure.json";
import docguard from "./projects/docguard.json";
import professionalExperience from "./experience/professional-experience.json";
import softwareEngineering from "./education/software-engineering.json";
import internalGenaiWorkshops from "./talks/internal-genai-workshops.json";
import aiAutomationTalks from "./talks/ai-automation-talks.json";

// Add each content file once. This order controls automatic scene placement.
export const contentEntries = [
  {file: "src/content/projects/aitheron.json", data: aitheron},
  {file: "src/content/projects/multi-agent-tariff-intelligence.json", data: multiAgent},
  {file: "src/content/projects/pn-extractor.json", data: pnExtractor},
  {file: "src/content/projects/enterprise-llm-infrastructure.json", data: llmInfrastructure},
  {file: "src/content/projects/docguard.json", data: docguard},
  {file: "src/content/experience/professional-experience.json", data: professionalExperience},
  {file: "src/content/education/software-engineering.json", data: softwareEngineering},
  {file: "src/content/talks/ai-automation-talks.json", data: aiAutomationTalks},
  {file: "src/content/talks/internal-genai-workshops.json", data: internalGenaiWorkshops},
];
