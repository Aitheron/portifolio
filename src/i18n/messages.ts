import {z} from "zod";
import {parseContent} from "../lib/portfolio-schema";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {portfolioConfig} from "../../portfolio.config";

type Messages = {[key: string]: string | Messages};
const messagesSchema: z.ZodType<Messages> = z.record(z.string(), z.union([z.string().min(1), z.lazy(() => messagesSchema)]));
function merge(base: Messages, translation: Messages): Messages {
  return Object.fromEntries(Object.entries(base).map(([key, value]) => {
    const translated = translation[key];
    if (translated === undefined) return [key, value];
    if (typeof value !== typeof translated) throw new Error(`Interface translation ${key}: incompatible value`);
    return [key, typeof value === "string" ? translated : merge(value, translated as Messages)];
  }));
}
export async function loadMessages(locale: string, directory = path.join(process.cwd(), "src/content/messages")): Promise<Messages> {
  if (!portfolioConfig.locales.includes(locale)) throw new Error(`Unsupported locale: ${locale}`);
  async function read(language: string) {
    const file = path.join(directory, `${language}.json`);
    const value: unknown = JSON.parse(await readFile(file, "utf8"));
    return parseContent(messagesSchema, value, file);
  }
  const base = await read(portfolioConfig.defaultLocale);
  if (locale === portfolioConfig.defaultLocale) return base;
  try { return merge(base, await read(locale)); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return base;
    throw error;
  }
}
