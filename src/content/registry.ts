import project from "./projects/example-project.json";
import experience from "./experience/example-experience.json";

// Add each content file once. This order controls automatic scene placement.
export const contentEntries = [
  {file: "src/content/projects/example-project.json", data: project},
  {file: "src/content/experience/example-experience.json", data: experience},
];
