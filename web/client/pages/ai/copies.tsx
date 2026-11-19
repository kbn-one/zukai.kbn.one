import type { Handle } from "@remix-run/component";

import { Copies } from "../../islands/ai/copies.tsx";
import {
  Analogy,
  ChapterHead,
  ChapterNav,
  DetailNote,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";

export const title = "モデルは、たくさんコピーされている — 図解AI";
export const description =
  "チャットAIのモデルは、同じファイルが世界中のデータセンターにたくさんコピーされて動いています。どのコピーも中身は同じです。";

export const hydrate = true;

export default function CopiesPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.ai.copies}>
        <p>
          何百万人もの人が同じAIを使えるのは、モデルを<strong>
            コピーして、たくさん並べて
          </strong>動かしているからです。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          人気のチェーン店は、どの店でも同じ味の料理が出てきます。本部の<strong>
            レシピを各店にコピーして配っている
          </strong>からです。お客さんがふえたら、お店をふやせばいい。レシピは同じものを配るだけです。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：使う人をふやしてみる">
        <Copies />
      </Stage>

      <h2>どのコピーに当たっても、同じ</h2>
      <p>
        あなたのメッセージがどのコピーで計算されるかは、そのときの空きぐあいで決まります。さっきとは別のデータセンターかもしれません。それでも問題がないのは、<strong>
          どのコピーも中身がまったく同じ
        </strong>だからです。
      </p>
      <p>
        ファイルの中身がそっくり同じかどうかは、「指紋」（ハッシュ値）を比べるとわかります。数字が1つでもちがえば、指紋はまったく別のものになります。
      </p>

      <Summary>
        <p>
          モデルは<strong>1つのファイル</strong>で、それを<strong>
            たくさんコピーして
          </strong>動かしている。どのコピーも中身は同じ。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            同じモデルを複数の GPU
            サーバーに読みこませたものを「レプリカ」と呼ぶ。リクエストはロードバランサーによって、空いているレプリカに振り分けられる。
          </li>
          <li>
            大きなモデルは1台の GPU に入りきらないため、1つのコピーを複数の GPU
            に分けて持つこともある（テンソル並列・パイプライン並列）。図では1つのコピーを1つの箱にしている。
          </li>
          <li>
            モデルが新しい版に更新されるときは、新しいファイルに入れかえる。使っている途中で少しずつ書きかわっていくわけではない（第5章）。
          </li>
        </ul>
      </DetailNote>

      <ChapterNav chapter={routes.ai.copies} />
    </>
  );
}
