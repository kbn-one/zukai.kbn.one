import type { Handle } from "@remix-run/component";

import { Together } from "../../islands/ai/together.tsx";
import {
  Analogy,
  ChapterHead,
  ChapterNav,
  DetailNote,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";

export const title = "1つのモデルが、何人もの相手を同時にしている — 図解AI";
export const description =
  "推論エンジンは何人分もの会話をたばにして、1つのモデルでまとめて計算します。答えはそれぞれ本人にだけ返ります。";

export const hydrate = true;

export default function TogetherPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.ai.together}>
        <p>
          ハーネスは1人に1つずつありますが、その先の推論エンジンとモデルは、みんなで共有しています。コピーの1つ1つも、1人専用ではありません。あなたが話しているその瞬間、<strong>
            同じコピーが、ほかの人の質問にも答えています
          </strong>。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          厨房では、注文を1皿ずつ作るより、同じなべやフライパンで<strong>
            何人分かまとめて作る
          </strong>ほうが速くすみます。それでも、どの皿をどのテーブルに運ぶかは、伝票を見ればまちがえません。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：3人が同時に話しかける">
        <Together />
      </Stage>

      <h2>まとめて計算するほうが速い</h2>
      <p>
        モデルの計算でいちばん時間がかかるのは、ばく大な数字をメモリから読み出すところです。一度読み出した数字で何人分もまとめて計算すれば、1人ずつやるよりずっと効率がよくなります。だから推論エンジンは、何人分もの会話を<strong>
          たば（バッチ）
        </strong>にして、いっしょにモデルに通します。
      </p>
      <p>
        たばの中でも、会話は1行ずつ分かれています。Aさんの行から出た言葉はAさんへ、Bさんの行から出た言葉はBさんへ返ります。
      </p>

      <Summary>
        <p>
          1つのモデルは、<strong>
            何人もの会話をまとめて
          </strong>計算している。でも会話どうしは分かれていて、答えは<strong>
            本人にだけ
          </strong>返る。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            まとめて計算することをバッチ処理という。実際の推論エンジンは、終わった会話をたばから抜き、新しい会話をすぐ入れる「continuous
            batching」で GPU を休ませないようにしている。
          </li>
          <li>
            計算のとちゅうで作られる一時的なデータ（KV
            キャッシュ）も、会話ごとに分かれている。会話の計算が終われば捨てられるか、短い時間だけ同じ会話の続きのために取っておかれる。
          </li>
          <li>
            図では答えの長さを数語にしているが、実際は数百〜数千トークンを、1秒に数十トークンほどの速さで作る。
          </li>
        </ul>
      </DetailNote>

      <ChapterNav chapter={routes.ai.together} />
    </>
  );
}
