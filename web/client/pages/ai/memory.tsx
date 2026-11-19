import type { Handle } from "@remix-run/component";

import { Memory } from "../../islands/ai/memory.tsx";
import {
  Analogy,
  ChapterHead,
  ChapterNav,
  DetailNote,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";

export const title = "「覚えている」のは、ハーネスのメモリ — 図解AI";
export const description =
  "チャットAIが前の話を覚えているように見えるのは、ハーネスが人ごとのメモリを毎回モデルに見せているからです。";

export const hydrate = true;

export default function MemoryPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.ai.memory}>
        <p>
          チャットAIは、前に話したことや、あなたの好みを覚えているように見えます。でも覚えているのはモデルではなく、<strong>
            ハーネスについているメモリ
          </strong>です。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          ホール係は、常連さんの<strong>
            伝票やメモ
          </strong>を持っています。「この方はお肉を食べない」と書いてあれば、それを厨房への注文にそえます。厨房のレシピに、お客さんのことは何も書いてありません。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：同じ質問を、3人がしてみる">
        <Memory />
      </Stage>

      <h2>メモリは、人ごとの引き出し</h2>
      <p>
        ハーネスは、会話の記録や「覚えておいて」と言われたことを、<strong>
          人ごとに分けて
        </strong>保存しています。あなたが話しかけるたびに、あなたの引き出しだけを開けて、中身を台本にそえてモデルに見せます。ほかの人の引き出しは開けません。
      </p>
      <p>
        モデルのほうは、台本に書いてあることしか知りません。台本にメモリが書いてあるから、まるで覚えているように答えられるのです。
      </p>

      <Summary>
        <p>
          <strong>
            メモリはハーネスにあって、人ごとに分かれている
          </strong>。モデルは1つで、毎回の台本に入ったその人のメモリを読んで答えている。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            「メモリ」の作りはサービスによってさまざま。会話の履歴そのもの、会話の要約、ユーザーについての短いメモ、Claude
            Code の CLAUDE.md
            のようなファイルなどがある。どれもモデルの外に保存され、必要な分だけ入力（コンテキスト）に入れられる。
          </li>
          <li>
            モデルが一度に読める長さ（コンテキストウィンドウ）には上限がある。長い会話では、古い部分を要約したり、関係のありそうなメモだけを選んだりして入れる。
          </li>
          <li>
            メモリはサービス側のサーバーに、アカウントごとに分けて保存されるのがふつう。どこに何が保存され、どう消せるかは、サービスの設定やプライバシーポリシーで確かめられる。
          </li>
        </ul>
      </DetailNote>

      <ChapterNav chapter={routes.ai.memory} />
    </>
  );
}
