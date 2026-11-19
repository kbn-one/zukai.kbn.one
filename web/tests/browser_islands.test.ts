import puppeteer from "puppeteer-core";
import { lightpanda } from "@lightpanda/browser";

import router from "../server/router.tsx";

function findFreePort(): number {
  const listener = Deno.listen({ port: 0, hostname: "127.0.0.1" });
  const { port } = listener.addr as Deno.NetAddr;
  listener.close();
  return port;
}

async function waitForCdp(cdpPort: number, timeoutMs = 5000): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
      if (res.ok) {
        const json = await res.json();
        return json.webSocketDebuggerUrl as string;
      }
      await res.body?.cancel();
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(
    `lightpanda CDP :${cdpPort} didn't become ready: ${lastError}`,
  );
}

/**
 * `@lightpanda/browser` downloads its binary on first use and leaves it without the executable bit
 * on some hosts (GitHub's runners among them), so the first spawn fails with `EACCES`. Mark it
 * executable and spawn again.
 */
async function serveLightpanda(port: number) {
  try {
    return await lightpanda.serve({ host: "127.0.0.1", port });
  } catch (error) {
    if (!String(error).includes("EACCES")) throw error;
    const home = Deno.env.get("HOME") ?? "";
    await Deno.chmod(`${home}/.cache/lightpanda-node/lightpanda`, 0o755);
    return await lightpanda.serve({ host: "127.0.0.1", port });
  }
}

/** Starts lightpanda and the app, runs `body` against a fresh page, and tears both down. */
async function withPage(
  body: (page: import("puppeteer-core").Page, origin: string) => Promise<void>,
) {
  const cdpPort = findFreePort();
  const appPort = findFreePort();
  const lpProc = await serveLightpanda(cdpPort);
  const app = Deno.serve(
    { port: appPort, hostname: "127.0.0.1", onListen: () => {} },
    (req) => router.fetch(req),
  );
  try {
    const wsUrl = await waitForCdp(cdpPort);
    const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
    try {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await body(page, `http://127.0.0.1:${appPort}`);
      await page.close();
      await context.close();
    } finally {
      await browser.disconnect();
    }
  } finally {
    try {
      lpProc.kill("SIGTERM");
    } catch { /* already gone */ }
    await app.shutdown();
  }
}

/** A page-side expression: whether some element matching `selector` has text including every needle. */
function shows(needles: string[], selector = "body"): string {
  return `[...document.querySelectorAll(${
    JSON.stringify(selector)
  })].some((el) => ${
    JSON.stringify(needles)
  }.every((n) => (el.textContent ?? "").includes(n)))`;
}

/** Clicks the first button whose text includes `text`. */
function clickButton(page: import("puppeteer-core").Page, text: string) {
  return page.$$eval(
    "button",
    (els, t) => {
      const el = els.find((e) => (e.textContent ?? "").includes(t as string));
      if (!el) throw new Error(`no button with ${t}`);
      (el as HTMLButtonElement).click();
    },
    text,
  );
}

async function open(page: import("puppeteer-core").Page, url: string) {
  await page.goto(url);
  await page.waitForFunction("globalThis.__rmxReady === true", {
    timeout: 10_000,
  });
}

const options = { sanitizeResources: false, sanitizeOps: false };

Deno.test({
  ...options,
  name: "lightpanda: /ai/parts をすすめると、モデルが言葉を選ぶ",
  async fn() {
    await withPage(async (page, origin) => {
      await open(page, `${origin}/ai/parts`);
      for (let i = 0; i < 3; i++) await clickButton(page, "すすむ");
      await page.waitForFunction(shows(["つぎに来そうな言葉"]), {
        timeout: 5_000,
      });
    });
  },
});

Deno.test({
  ...options,
  name: "lightpanda: /ai/memory で覚えてもらうと答えが変わり、指紋は変わらない",
  async fn() {
    await withPage(async (page, origin) => {
      await open(page, `${origin}/ai/memory`);
      await clickButton(page, "と覚えてもらう");
      await page.waitForFunction(
        shows(["お肉なしのマーボーどうふ", "7f3a…c91e"]),
        {
          timeout: 5_000,
        },
      );
    });
  },
});

Deno.test({
  ...options,
  name: "lightpanda: /ai/readonly で Bさんに Aさんの話はもれない",
  async fn() {
    await withPage(async (page, origin) => {
      await open(page, `${origin}/ai/readonly`);
      await clickButton(page, "Aさんが話す");
      await clickButton(page, "Bさんが聞く");
      await page.waitForFunction(
        shows([
          "ほかの人との会話は、わたしには見えません",
          "変わった数字：0こ",
        ]),
        { timeout: 5_000 },
      );
    });
  },
});
