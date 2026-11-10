// Every CSS variable used without a fallback must be defined somewhere.
// Guards against a cleanup that deletes a definition and keeps its uses: the browser then drops the whole
// declaration without any error (this happened to --sections-h, which broke anchor jumps and sticky cards).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SOURCE_FOLDER = new URL("../../src/", import.meta.url);

function listFiles(folder, extensions) {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) return listFiles(path, extensions);
    return extensions.some((extension) => name.endsWith(extension)) ? [path] : [];
  });
}

const sourcePath = SOURCE_FOLDER.pathname.replace(/^\/([A-Za-z]:)/, "$1");
const decodedSourcePath = decodeURIComponent(sourcePath);
const cssText = listFiles(decodedSourcePath, [".css"])
  .map((path) => readFileSync(path, "utf8"))
  .join("\n")
  .replace(/\/\*[\s\S]*?\*\//g, "");
const scriptText = listFiles(decodedSourcePath, [".js", ".jsx", ".ts", ".tsx"])
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

// "--name:" in CSS, or "--name" as a quoted key / setProperty argument in scripts (inline style variables).
const definedInCss = new Set([...cssText.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]));
const definedInScripts = new Set([...scriptText.matchAll(/["'`](--[a-z0-9-]+)["'`]/gi)].map((match) => match[1]));

// var(--name) with no fallback: the declaration is invalid when the variable is missing.
const usedWithoutFallback = new Set([...cssText.matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/gi)].map((match) => match[1]));

describe("CSS variables", () => {
  it("finds the theme variables (sanity check of the scan)", () => {
    expect(definedInCss.has("--header-h")).toBe(true);
    expect(usedWithoutFallback.has("--header-h")).toBe(true);
  });

  it("defines every variable that is used without a fallback", () => {
    const missing = [...usedWithoutFallback].filter((name) => !definedInCss.has(name) && !definedInScripts.has(name)).sort();
    expect(missing).toEqual([]);
  });

  it("keeps the height of the section pill band, used by anchor jumps and sticky cards", () => {
    expect(definedInCss.has("--sections-h")).toBe(true);
  });
});
