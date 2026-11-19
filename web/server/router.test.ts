import { assert, assertEquals, assertStringIncludes } from "@std/assert";

import router from "./router.tsx";
import { series } from "../client/series.ts";

async function get(path: string): Promise<string> {
  const res = await router.fetch(new Request(`http://x${path}`));
  assertEquals(res.status, 200, path);
  assertStringIncludes(res.headers.get("content-type") ?? "", "text/html");
  return await res.text();
}

Deno.test("GET / lists every 図解 and ships no JavaScript", async () => {
  const html = await get("/");
  assertStringIncludes(html, "<!DOCTYPE html>");
  for (const s of series) {
    assertStringIncludes(html, s.title);
    assertStringIncludes(html, `href="${s.index.href()}"`);
  }
  assert(!html.includes('<script type="module"'));
});

Deno.test("GET /ai shows the overview and links every chapter", async () => {
  const html = await get("/ai");
  assertStringIncludes(html, "全体図");
  const ai = series.find((s) => s.key === "ai")!;
  for (const c of ai.chapters) {
    assertStringIncludes(html, `href="${c.route.href()}"`);
  }
});

Deno.test("GET /myna shows the card and links every chapter", async () => {
  const html = await get("/myna");
  assertStringIncludes(html, "<ruby>");
  const myna = series.find((s) => s.key === "myna")!;
  for (const c of myna.chapters) {
    assertStringIncludes(html, `href="${c.route.href()}"`);
  }
});

for (const s of series) {
  for (const c of s.chapters) {
    Deno.test(`GET ${c.route.href()} hydrates its picture and marks itself in the もくじ`, async () => {
      const html = await get(c.route.href());
      assertStringIncludes(html, c.title);
      assertStringIncludes(
        html,
        '<script type="module" src="/assets/hydration',
      );
      assertStringIncludes(html, `/assets/islands/${s.key}/`);
      assertStringIncludes(
        html,
        `href="${c.route.href()}" aria-current="page"`,
      );
    });
  }
}

Deno.test("every page has a social card", async () => {
  const res = await router.fetch(new Request("http://x/og/ai/parts.png"));
  assertEquals(res.status, 200);
  assertEquals(res.headers.get("content-type"), "image/png");
  await res.body?.cancel();
});
