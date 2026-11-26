/**
 * The site, wired by hand.
 *
 * Route definitions live in `client/routes.ts` and this file maps them to the pages that answer
 * them. `router.map(routes, controller)` is the whole of the mapping, and a controller has to name
 * an action for every route in the map it owns: leave one out and the router throws while it is
 * being built, rather than answering a route with nothing.
 *
 * Each 図解 is a route map of its own (`routes.ai`), so each gets a controller of its own below.
 *
 * What is exported is a plain `@remix-run/fetch-router` router. The GitHub Pages build
 * (`@remix-kbn/ssg`) crawls it with `fetch()` from `entryPoints`, following links, and writes each
 * response to disk. There is no server API: everything on the site is static.
 */

import {
  createController,
  createRouter,
  type RouterContext,
} from "@remix-run/fetch-router";
import { render } from "@remix-run/render-middleware";
import { createFileTree, githubPages } from "@remix-kbn/ssg/site";
import type { FileServerBehavior } from "@remix-kbn/ssg/site";

import { assets, assetsPath } from "./assets.ts";
import { clientRuntime } from "./runtime.ts";
import { ogImage, ogPaths, serveOgImage } from "./og/mod.ts";
import { base } from "../client/base.ts";
import { Layout, type PageModule } from "../client/layout.tsx";
import { routes } from "../client/routes.ts";
import { type SeriesKey, seriesOf } from "../client/series.ts";

import * as Home from "../client/pages/index.tsx";
import * as AiIndex from "../client/pages/ai/index.tsx";
import * as AiParts from "../client/pages/ai/parts.tsx";
import * as AiCopies from "../client/pages/ai/copies.tsx";
import * as AiTogether from "../client/pages/ai/together.tsx";
import * as AiMemory from "../client/pages/ai/memory.tsx";
import * as AiReadonly from "../client/pages/ai/readonly.tsx";
import * as AiLocal from "../client/pages/ai/local.tsx";
import * as MynaIndex from "../client/pages/myna/index.tsx";
import * as MynaInside from "../client/pages/myna/inside.tsx";
import * as MynaTamper from "../client/pages/myna/tamper.tsx";
import * as MynaPhone from "../client/pages/myna/phone.tsx";
import * as MynaAuth from "../client/pages/myna/auth.tsx";
import * as MynaAnonymous from "../client/pages/myna/anonymous.tsx";
import * as MynaDigitalAuthApp from "../client/pages/myna/digital_auth_app.tsx";
import * as MynaSignature from "../client/pages/myna/signature.tsx";
import * as MynaLicense from "../client/pages/myna/license.tsx";
import * as PasskeyIndex from "../client/pages/passkey/index.tsx";
import * as PasskeyPassword from "../client/pages/passkey/password.tsx";
import * as PasskeyKeys from "../client/pages/passkey/keys.tsx";
import * as PasskeyDevice from "../client/pages/passkey/device.tsx";
import * as PasskeyPhishing from "../client/pages/passkey/phishing.tsx";
import * as PasskeyFlow from "../client/pages/passkey/flow.tsx";
import * as PasskeySync from "../client/pages/passkey/sync.tsx";
import * as PasskeyMyths from "../client/pages/passkey/myths.tsx";

/** Deploy path prefix. The build strips it back off when writing, so output lands at the root. */
export { base };

/** Where the static build deploys. The build writes the file this rule would serve. */
export const fileServer: FileServerBehavior = githubPages();

/**
 * Renders a page module into the shell.
 *
 * The route comes in alongside the module because the page's own path is what its social card is
 * registered under — the card is drawn from the same `title` and `description` the `<head>` gets.
 *
 * @param route The page's route
 * @param page The page module
 * @param series The 図解 the page belongs to, for the header's もくじ and the card's eyebrow
 */
function pageAction(
  route: { href(): string },
  page: PageModule,
  series?: SeriesKey,
) {
  const eyebrow = series ? seriesOf(series).title : undefined;
  const image = ogImage(route.href(), { ...page, eyebrow });
  const Page = page.default;

  return (context: AppContext): Response =>
    context.render(
      <Layout
        title={page.title}
        description={page.description}
        image={image}
        script={page.hydrate ? clientRuntime : null}
        series={series}
        current={route.href()}
        wide={page.wide ?? series === undefined}
      >
        <Page />
      </Layout>,
    );
}

/** The files under `client/static/`, served verbatim at their own names. */
const staticFiles = await createFileTree({
  rootDir: `${import.meta.dirname}/../client/static`,
  basePath: `${base}/static`,
  cacheControl: "public, max-age=3600",
});

/** `render({ assets })` puts `context.render(node)` on every request. */
const router = createRouter({ middleware: [render({ assets })] });

/** The request context those middlewares produce — `context.render`, in practice. */
export type AppContext = RouterContext<typeof router>;

declare module "@remix-run/fetch-router" {
  interface RouterTypes {
    context: AppContext;
  }
}

const top = createController(routes, {
  actions: { home: pageAction(routes.home, Home) },
});

/** 図解AI. */
const ai = createController(routes.ai, {
  actions: {
    index: pageAction(routes.ai.index, AiIndex, "ai"),
    parts: pageAction(routes.ai.parts, AiParts, "ai"),
    copies: pageAction(routes.ai.copies, AiCopies, "ai"),
    together: pageAction(routes.ai.together, AiTogether, "ai"),
    memory: pageAction(routes.ai.memory, AiMemory, "ai"),
    readonly: pageAction(routes.ai.readonly, AiReadonly, "ai"),
    local: pageAction(routes.ai.local, AiLocal, "ai"),
  },
});

/** マイナンバーカードのひみつ. */
const myna = createController(routes.myna, {
  actions: {
    index: pageAction(routes.myna.index, MynaIndex, "myna"),
    inside: pageAction(routes.myna.inside, MynaInside, "myna"),
    tamper: pageAction(routes.myna.tamper, MynaTamper, "myna"),
    phone: pageAction(routes.myna.phone, MynaPhone, "myna"),
    auth: pageAction(routes.myna.auth, MynaAuth, "myna"),
    anonymous: pageAction(routes.myna.anonymous, MynaAnonymous, "myna"),
    digitalAuthApp: pageAction(
      routes.myna.digitalAuthApp,
      MynaDigitalAuthApp,
      "myna",
    ),
    signature: pageAction(routes.myna.signature, MynaSignature, "myna"),
    license: pageAction(routes.myna.license, MynaLicense, "myna"),
  },
});

/** 図解パスキー. */
const passkey = createController(routes.passkey, {
  actions: {
    index: pageAction(routes.passkey.index, PasskeyIndex, "passkey"),
    password: pageAction(routes.passkey.password, PasskeyPassword, "passkey"),
    keys: pageAction(routes.passkey.keys, PasskeyKeys, "passkey"),
    device: pageAction(routes.passkey.device, PasskeyDevice, "passkey"),
    phishing: pageAction(routes.passkey.phishing, PasskeyPhishing, "passkey"),
    flow: pageAction(routes.passkey.flow, PasskeyFlow, "passkey"),
    sync: pageAction(routes.passkey.sync, PasskeySync, "passkey"),
    myths: pageAction(routes.passkey.myths, PasskeyMyths, "passkey"),
  },
});

router.map(routes, top);
router.map(routes.ai, ai);
router.map(routes.myna, myna);
router.map(routes.passkey, passkey);

router.get(`${base}/static/*path`, ({ request }) => staticFiles.fetch(request));
router.get(`${assetsPath}/*path`, ({ request }) => assets.fetch(request));
router.get(`${base}/og/*path`, ({ request }) => serveOgImage(request));

/**
 * Where the static crawl starts.
 *
 * Pages are reached by following links from `/`. The social cards are the exception: an
 * `og:image` is an absolute URL meant for someone else's server, and nothing links to it.
 */
export const entryPoints: readonly string[] = ["/", ...ogPaths()];

export default router;
