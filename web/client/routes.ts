/**
 * Every URL the site answers, in one place.
 *
 * The site is a shelf of 図解, each under a directory of its own: `/ai/` is 図解AI, and the next one
 * gets its own `route("…", {...})` beside it. `server/router.tsx` maps these to the pages that
 * answer them, and everything that links reads `routes.ai.parts.href()` rather than rebuilding the
 * path at each call site.
 *
 * The map is built with the deploy prefix as its base, so hrefs are correct under a GitHub Pages
 * repo sub-path or a PR preview URL without anyone prepending anything.
 */

import { get, route } from "@remix-run/fetch-router/routes";

import { base } from "./base.ts";

export const routes = route(base, {
  home: get("/"),
  ai: route("ai", {
    index: get("/"),
    parts: get("/parts"),
    copies: get("/copies"),
    together: get("/together"),
    memory: get("/memory"),
    readonly: get("/readonly"),
  }),
  myna: route("myna", {
    index: get("/"),
    inside: get("/inside"),
    tamper: get("/tamper"),
    phone: get("/phone"),
    auth: get("/auth"),
    anonymous: get("/anonymous"),
    digitalAuthApp: get("/digital-auth-app"),
    signature: get("/signature"),
    license: get("/license"),
  }),
});
