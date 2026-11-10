// Response headers set in vercel.json: the content security policy (report-only for now) and the cache rules.
// The policy lists the hash of the only inline script (the theme script in index.html). If that script
// changes and the hash does not, browsers would block it once the policy is enforced: this test fails first.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readProjectFile = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");

const vercelConfig = JSON.parse(readProjectFile("vercel.json"));
const headersForAllPages = vercelConfig.headers.find((rule) => rule.source === "/(.*)").headers;
const headerValue = (key) => headersForAllPages.find((header) => header.key === key)?.value;

// Browsers hash the script text after turning CRLF into LF, so the test does the same.
const inlineScripts = [...readProjectFile("index.html").replace(/\r\n/g, "\n").matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
  (match) => match[1]
);
const sha256Base64 = (text) => createHash("sha256").update(text, "utf8").digest("base64");

describe("content security policy (report-only)", () => {
  const policy = headerValue("Content-Security-Policy-Report-Only");

  it("is sent on every page", () => {
    expect(policy).toBeTruthy();
  });

  it("lists the hash of the only inline script", () => {
    expect(inlineScripts).toHaveLength(1);
    expect(policy).toContain(`'sha256-${sha256Base64(inlineScripts[0])}'`);
  });

  it("allows only the outside hosts the site really uses", () => {
    expect(policy).toContain("connect-src 'self' https://*.supabase.co wss://*.supabase.co");
    expect(policy).toContain("frame-src https://www.google.com https://maps.google.com");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(policy).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  });
});

describe("cache rules", () => {
  const cacheFor = (source) =>
    vercelConfig.headers.find((rule) => rule.source === source)?.headers.find((header) => header.key === "Cache-Control")?.value;

  it("keeps hashed build files for a year", () => {
    expect(cacheFor("/assets/(.*)")).toBe("public, max-age=31536000, immutable");
  });

  it("keeps fonts, photos and images for a week, never the pages themselves", () => {
    for (const folder of ["fonts", "fotos", "exemplos", "og", "marca"]) {
      expect(cacheFor(`/${folder}/(.*)`)).toMatch(/max-age=604800/);
    }
    expect(headerValue("Cache-Control")).toBeUndefined();
  });
});
