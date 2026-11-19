/** @jsxImportSource ruby-jsx */
// The type checker still reads JSX types from Remix; this keeps them in the module graph.
import type {} from "@remix-run/component/jsx-runtime";
/**
 * `emphasize` from `controls.tsx`, compiled against the `ruby-jsx` runtime, so the words it sets
 * in bold get their readings too. マイナンバーカードのひみつ's islands use this one.
 */

/**
 * Turns `<…>` in a caption into bold, with readings above every kanji.
 *
 * @param text The caption, with the words to stress in `<…>`
 * @returns The caption as text and `<strong>` elements
 */
export function emphasize(text: string) {
  return text.split(/(<[^>]+>)/).map((part, i) =>
    part.startsWith("<") ? <strong key={i}>{part.slice(1, -1)}</strong> : part
  );
}
