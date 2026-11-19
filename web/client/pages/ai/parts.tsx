import type { Handle } from "@remix-run/component";

import { PartsFlow } from "../../islands/ai/parts_flow.tsx";
import {
  Analogy,
  Cast,
  ChapterHead,
  ChapterNav,
  DetailNote,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";

export const title = "チャットAIは、3つの部品でできている — 図解AI";
export const description =
  "チャットAIの中身を、モデル・推論エンジン・ハーネスの3つに分けて、1つのメッセージがどう流れるかを動く図で説明します。";

export const hydrate = true;

export default function Parts(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.ai.parts}>
        <p>
          チャットAIに話しかけると、すぐに答えが返ってきます。この「AI」は1つのかたまりではなく、役割のちがう3つの部品が組み合わさって動いています。
        </p>
      </ChapterHead>

      <Cast
        items={[
          {
            icon: "layers",
            name: "モデル",
            note:
              "ばく大な数の数字が入った、大きなファイル。「つぎに来る言葉」を見積もるための知識が、数字の形でつまっている。",
          },
          {
            icon: "chip",
            name: "推論エンジン",
            note:
              "モデルを読みこんで、実際に計算するプログラムと機械（GPU）。台本を受け取り、言葉を1つずつ作り出す。",
          },
          {
            icon: "harness",
            name: "ハーネス",
            note:
              "あなたとのやりとりを受け持つ係。会話やメモリを管理し、モデルに見せる台本を組み立てる。道具（検索など）を使うのもここ。",
          },
        ]}
      />

      <Analogy>
        <p>
          レストランにたとえると、<strong>
            ハーネスはホール係
          </strong>、<strong>推論エンジンは厨房</strong>、<strong>
            モデルはレシピ
          </strong>です。お客さんの注文を聞き、お客さんごとの伝票（メモリ）を持っているのはホール係。厨房はレシピのとおりに料理を作ります。注文がいくつ入っても、レシピそのものは書きかわりません。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：1つのメッセージを追いかける">
        <PartsFlow />
      </Stage>

      <h2>モデルは「つぎの言葉」を当てるだけ</h2>
      <p>
        モデルがやっていることは、見せられた文章のつづきとして<strong>
          つぎに来そうな言葉
        </strong>を見積もることだけです。推論エンジンはそれを1つ選んで文章の後ろに足し、またモデルに通す。これをくりかえすと、長い答えができあがります。
      </p>
      <p>
        モデル自身は、だれと話しているのかも、前に何を話したのかも知りません。それを知っていて、毎回の台本に書きこんでいるのはハーネスです。
      </p>

      <Summary>
        <p>
          チャットAIは、<strong>ハーネス（受付）</strong>・<strong>
            推論エンジン（計算）
          </strong>・<strong>
            モデル（知識のつまった数字）
          </strong>の3つでできている。あなたが話しているのはハーネスで、モデルは読まれるだけ。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            モデルの中身は「重み」または「パラメータ」と呼ばれる数値の集まり。大きなモデルでは数百億〜数兆個になり、ファイルの大きさは数百GB以上になる。
          </li>
          <li>
            モデルが1回に出すのは正確には「言葉」ではなく「トークン」（単語や文字の切れはし）。出したトークンを入力に足して、また次を計算する（自己回帰生成）。
          </li>
          <li>
            推論エンジンの例は vLLM、TensorRT-LLM、SGLang など。GPU や TPU
            のような計算用の機械の上で動く。
          </li>
          <li>
            ハーネスは、チャットアプリの裏側や、Claude Code
            のようなエージェントの本体にあたる。システムプロンプト、会話履歴、ツール呼び出し、メモリの管理などを受け持つ。ここでは説明のため、サービスの受付まわりをまとめて「ハーネス」と呼んでいる。
          </li>
        </ul>
      </DetailNote>

      <ChapterNav chapter={routes.ai.parts} />
    </>
  );
}
