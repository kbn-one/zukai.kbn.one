/**
 * The 図解 on the shelf, and the chapters of each, in reading order.
 *
 * The home page's cards, the header's table of contents, a 図解's own もくじ and the "まえ / つぎ"
 * links at the foot of every chapter all read this list, so a chapter added here shows up in all
 * of them. A new 図解 is a new entry here, a `route()` in `routes.ts`, its pages under
 * `pages/<key>/`, and its moving pictures under `islands/<key>/`.
 */

import { routes } from "./routes.ts";
import type { IconName } from "./ui/icons.tsx";

export interface Chapter {
  /** The chapter's route, for its href. */
  route: { href(): string };
  /** Short label for the nav. */
  short: string;
  /** The chapter's question, as its heading. */
  title: string;
  /** One line for the もくじ. */
  lead: string;
  icon: IconName;
}

export interface Series {
  key: SeriesKey;
  /** The 図解's name, in the header and on its social cards. */
  title: string;
  /** One line under the name, on the home page and the 図解's own top page. */
  lead: string;
  icon: IconName;
  /** The 図解's own top page. */
  index: { href(): string };
  chapters: readonly Chapter[];
}

export type SeriesKey = "ai";

export const series: readonly Series[] = [
  {
    key: "ai",
    title: "図解AI",
    lead:
      "チャットAIの中身は、モデル・推論エンジン・ハーネスの3つ。たくさんの人と同時に話せるのに、話がまざらないのはなぜ？",
    icon: "layers",
    index: routes.ai.index,
    chapters: [
      {
        route: routes.ai.parts,
        short: "3つの部品",
        title: "チャットAIは、3つの部品でできている",
        lead:
          "「AI」とひとことで言っても、中ではモデル・推論エンジン・ハーネスが役割を分けて動いています。",
        icon: "layers",
      },
      {
        route: routes.ai.copies,
        short: "コピー",
        title: "モデルは、たくさんコピーされている",
        lead:
          "同じモデルのファイルが、世界中のデータセンターでたくさん並んで動いています。どれも中身はまったく同じ。",
        icon: "copy",
      },
      {
        route: routes.ai.together,
        short: "同時に話す",
        title: "1つのモデルが、何人もの相手を同時にしている",
        lead:
          "あなたと話しているモデルは、同じ瞬間にほかの人の質問にも答えています。",
        icon: "users",
      },
      {
        route: routes.ai.memory,
        short: "メモリ",
        title: "「覚えている」のは、ハーネスのメモリ",
        lead:
          "前の会話を覚えているように見えるのは、ハーネスが人ごとのメモリを毎回モデルに見せているから。",
        icon: "database",
      },
      {
        route: routes.ai.readonly,
        short: "書きこまれない",
        title: "モデルには書きこまれないから、話はまざらない",
        lead:
          "使っている間、モデルの中身は1つも変わりません。だからあなたの話が、モデルを通ってほかの人にもれることはありません。",
        icon: "lock",
      },
    ],
  },
];

/** The 図解 with this key. */
export function seriesOf(key: SeriesKey): Series {
  return series.find((s) => s.key === key)!;
}

/** Where a chapter sits: its 図解, its number from 1, and the chapters either side. */
export interface ChapterPlace {
  series: Series;
  chapter: Chapter;
  number: number;
  prev: Chapter | null;
  next: Chapter | null;
}

/**
 * Finds a chapter by its route.
 *
 * @param route The chapter's route, as `routes` holds it
 * @returns Where it sits
 */
export function placeOf(route: { href(): string }): ChapterPlace {
  for (const s of series) {
    const i = s.chapters.findIndex((c) => c.route === route);
    if (i === -1) continue;
    return {
      series: s,
      chapter: s.chapters[i],
      number: i + 1,
      prev: s.chapters[i - 1] ?? null,
      next: s.chapters[i + 1] ?? null,
    };
  }
  throw new Error(`No chapter is registered at ${route.href()}`);
}
