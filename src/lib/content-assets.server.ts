/** Filesystem checks run only in server/build code, never in the WebGL bundle. */
import {existsSync, realpathSync} from "node:fs";
import path from "node:path";
import {contentEntries} from "../content/registry";
import profile from "../content/profile.json";

export function validateLocalAssets(value: unknown, file: string, publicRoot = path.join(process.cwd(), "public"), field = "root"): void {
  if (typeof value === "string" && value.startsWith("/assets/")) {
    let decoded: string;
    try { decoded = decodeURIComponent(value); } catch { throw new Error(`${file}: ${field} — malformed asset path ${value}`); }
    const asset = path.resolve(publicRoot, `.${decoded}`);
    const root = realpathSync(publicRoot);
    if (!asset.startsWith(path.resolve(publicRoot) + path.sep) || !existsSync(asset) || !realpathSync(asset).startsWith(root + path.sep)) {
      throw new Error(`[portfolio-content] ${file}: ${field} — local asset missing or outside public/: ${value}`);
    }
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) validateLocalAssets(child, file, publicRoot, `${field}.${key}`);
  }
}
export function validateContentAssets() {
  validateLocalAssets(profile, "src/content/profile.json");
  for (const entry of contentEntries) validateLocalAssets(entry.data, entry.file);
}
