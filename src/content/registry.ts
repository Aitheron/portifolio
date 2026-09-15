import aitheron from "./projects/aitheron.json";
import multiAgent from "./projects/multi-agent-tariff-intelligence.json";
import pnExtractor from "./projects/pn-extractor.json";
import docguard from "./projects/docguard.json";
import universePortfolio from "./projects/universe-portfolio.json";
import becomex from "./experience/becomex.json";
import bmwGroup from "./experience/bmw-group.json";
import softwareEngineering from "./education/software-engineering.json";
import parkify from "./education/parkify.json"; 

import gdgJoinvillePnTalk from "./talks/gdg-joinville-pn-talk.json";
import catolicaPnTalk from "./talks/catolica-pn-talk.json";
import tdcSummitIaSaoPaulo from "./talks/tdc-summit-ia-sao-paulo.json";

// Add each content file once. This order controls automatic scene placement.
export const contentEntries = [
  {file: "src/content/projects/docguard.json", data: docguard},
  {file: "src/content/projects/multi-agent-tariff-intelligence.json", data: multiAgent},
  {file: "src/content/projects/pn-extractor.json", data: pnExtractor},
  {file: "src/content/projects/aitheron.json", data: aitheron},
  {file: "src/content/experience/becomex.json", data: becomex},
  {file: "src/content/education/software-engineering.json", data: softwareEngineering},
  { file: "src/content/education/parkify.json", data: parkify },
  {file: "src/content/talks/gdg-joinville-pn-talk.json", data: gdgJoinvillePnTalk},
  {file: "src/content/talks/catolica-pn-talk.json", data: catolicaPnTalk},
  {file: "src/content/experience/bmw-group.json", data: bmwGroup},
  {file: "src/content/talks/tdc-summit-ia-sao-paulo.json", data: tdcSummitIaSaoPaulo},
  {file: "src/content/projects/universe-portfolio.json", data: universePortfolio},
];
