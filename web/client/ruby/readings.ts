/**
 * A string, as text and `<ruby>` elements — the readings above every kanji.
 *
 * The JSX runtime beside this file calls it on the children of every element in a file that opts
 * in. The shared shell (`layout.tsx`, `parts.tsx`) is compiled against plain Remix, so it calls
 * this itself on the strings it prints for a 図解 whose `ruby` flag is set.
 */

import type { RemixNode } from "@remix-run/component";
import { jsx as remixJsx } from "@remix-run/component/jsx-runtime";

import { hasKanji, rubify } from "./rubify.ts";

/** A string with readings set above its kanji; the string itself when it has none. */
export function readings(text: string): RemixNode {
  if (!hasKanji(text)) return text;
  const tokens = rubify(text);
  if (tokens.length === 1 && typeof tokens[0] === "string") return text;
  // One <span> around the lot: in a flex row (a button, a nav pill) every child is an item of its
  // own, and a sentence cut into text and <ruby> pieces would come apart at each kanji.
  return remixJsx("span", {
    children: tokens.map((token) =>
      typeof token === "string" ? token : remixJsx("ruby", {
        children: [token.base, remixJsx("rt", { children: token.reading })],
      })
    ),
  });
}
