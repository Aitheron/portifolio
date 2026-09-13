import profile from "./profile.json";
import {parseContent, profileSchema} from "../lib/portfolio-schema";

export const identity = parseContent(profileSchema, profile, "src/content/profile.json");
