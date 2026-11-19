import type { Handle } from "@remix-run/component";

import { Readonly } from "../../islands/ai/readonly.tsx";
import {
  Analogy,
  ChapterHead,
  ChapterNav,
  DetailNote,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";

export const title = "モデルには書きこまれないから、話はまざらない — 図解AI";
export const description =
  "チャットAIを使っているあいだ、モデルの中身は1つも変わりません。だからあなたの話が、モデルを通ってほかの人にもれることはありません。";

export const hydrate = true;

export default function ReadonlyPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.ai.readonly}>
        <p>
          1つのモデルがたくさんの人と同時に話しているなら、だれかの話がほかの人にもれたりしないのでしょうか。ここまでの話をまとめると、答えが見えてきます。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          注文がいくつ入っても、レシピ本に書きこむ人はいません。だから、となりのテーブルの注文がレシピに残って、あなたの料理にまざることはありません。お客さんのことが書いてあるのは、<strong>
            そのお客さんの伝票
          </strong>だけです。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：Aさんの話は、Bさんにもれる？">
        <Readonly />
      </Stage>

      <h2>モデルは「読むだけ」</h2>
      <p>
        チャットAIが答えを作るとき、推論エンジンはモデルの数字を<strong>
          読むだけ
        </strong>です。どれだけ話しても、モデルの数字は1つも書きかわりません。第2章の「指紋」も変わらないままです。
      </p>
      <p>
        あなたが話したことが残るのは、ハーネスの<strong>
          あなたのメモリ
        </strong>だけです。ほかの人と話すときに使われるのは、同じ変わらないモデルと、その人のメモリ。あなたの話が入りこむすき間はありません。
      </p>

      <h2>全部まとめると</h2>
      <ol>
        <li>
          モデルは<strong>
            1つのファイル
          </strong>で、たくさんコピーされている（第2章）
        </li>
        <li>
          1つのコピーが、<strong>何人もの相手を同時に</strong>している（第3章）
        </li>
        <li>
          覚えているのは<strong>
            ハーネスのメモリ
          </strong>で、人ごとに分かれている（第4章）
        </li>
        <li>
          モデルには<strong>
            書きこまれない
          </strong>。だから、モデルを通って話がまざることはない
        </li>
      </ol>

      <Summary>
        <p>
          モデルはみんなで使う<strong>読むだけの本</strong>、メモリは<strong>
            1人ずつのノート
          </strong>。本に書きこまないから、だれかのノートの中身が、ほかの人に伝わることはない。
        </p>
      </Summary>

      <DetailNote>
        <p>
          この章の「大丈夫」は、<strong>
            使っている最中に、モデルを通じてほかの利用者にもれることはない
          </strong>という意味です。次の点は別の話なので注意してください。
        </p>
        <ul>
          <li>
            モデルを作る「学習（トレーニング）」は、使うこと（推論）とは別の工程。サービスによっては、利用者の会話を将来のモデルの学習に使うことがあり、その場合は次の版のモデルに影響しうる。多くのサービスでは、設定や契約の種類によって学習に使われないようにできる。利用規約とデータの設定を確かめておくとよい。
          </li>
          <li>
            ハーネス側のメモリや会話の記録は、サービスのサーバーに保存されている。その保管のしかた（だれが見られるか、いつ消えるか）は、モデルとは別に、サービスの安全対策しだいである。
          </li>
          <li>
            メモリの共有機能や、チームで同じプロジェクトを使う機能などでは、意図して同じメモリを複数の人で使うこともある。
          </li>
        </ul>
      </DetailNote>

      <ChapterNav chapter={routes.ai.readonly} />
    </>
  );
}
