import type { Handle } from "@remix-run/component";

import { Local } from "../../islands/ai/local.tsx";
import {
  Analogy,
  ChapterHead,
  ChapterNav,
  DetailNote,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";

export const title = "ローカルLLMなら、全部が自分のパソコンの中 — 図解AI";
export const description =
  "モデルを自分のパソコンで動かすローカルLLMでは、モデル・推論エンジン・ハーネスの3つがすべて手元にそろいます。クラウドのAIとのちがいを動く図で説明します。";

export const hydrate = true;

export default function LocalPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.ai.local}>
        <p>
          ここまでのチャットAIは、モデルも推論エンジンもデータセンターにありました。でも、モデルのファイルを<strong>
            自分のパソコンにダウンロードして
          </strong>動かすこともできます。これを<strong>
            ローカルLLM
          </strong>といいます。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          レストランで食べるかわりに、<strong>
            レシピ本を買ってきて、自分の台所で作る
          </strong>ようなものです。注文を聞くのも、作るのも、食べるのも自分だけ。台所の外には何も出ていきません。そのかわり、家の台所に入る大きさの鍋しか使えません。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：3つの部品を、どこに置く？">
        <Local />
      </Stage>

      <h2>何がちがう？</h2>
      <ul>
        <li>
          <strong>
            何もインターネットに出ていかない
          </strong>。質問も、メモリも、パソコンの中だけで使われます。
        </li>
        <li>
          モデルを使うのは<strong>
            あなた1人
          </strong>。第2章のようにコピーを並べたり、第3章のように何人分もまとめて計算したりする必要はありません。
        </li>
        <li>
          パソコンに入る大きさのモデルしか動かせないので、クラウドの大きなモデルより<strong>
            小さめ
          </strong>になります。答えの速さも、パソコンの性能しだいです。
        </li>
      </ul>

      <h2>変わらないこと</h2>
      <p>
        ローカルでも、モデルは<strong>
          読むだけ
        </strong>です。どれだけ話しても、ダウンロードしたモデルのファイルは1つも書きかわりません。前の話を覚えているように見えるなら、それは手元のハーネスのメモリのおかげです。第5章と同じしくみです。
      </p>

      <h2>「ハーネスだけ手元」という使い方</h2>
      <p>
        Claude
        Codeのようなエージェントは、ハーネスがあなたのパソコンで動き、メモリもパソコンに置きます。でもモデルはデータセンターにあるので、毎回の<strong>
          台本はインターネットを通って
        </strong>送られます。台本にはメモリや、読みこんだファイルの中身も入ります。「メモリが手元にある」ことと「何も外に出ない」ことは、同じではありません。
      </p>

      <Summary>
        <p>
          ローカルLLMは、<strong>
            3つの部品がぜんぶ自分のパソコンの中
          </strong>。外に何も出ないかわりに、モデルは小さめで、速さはパソコンしだい。モデルが読むだけなのは、クラウドでもローカルでも同じ。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            ローカルで動かせるのは、重み（モデルのファイル）が公開されている「オープンウェイト」のモデル。Llama、Qwen、Gemma、gpt-oss
            などがある。
          </li>
          <li>
            推論エンジンの例は llama.cpp、MLX、vLLM など。Ollama や LM Studio
            は、推論エンジンとかんたんな画面（ハーネス）をまとめたアプリ。
          </li>
          <li>
            パソコンのメモリに収めるため、数字の精度を落としてファイルを小さくする「量子化」がよく使われる。目安として、80億パラメータのモデルを4ビットに量子化すると約5GBになる。
          </li>
          <li>
            ローカルLLMでも、ハーネスがウェブ検索などネットにつながる道具を使えば、その分のデータは外に出る。「何も出ない」のは、道具も含めて手元だけで完結しているときに限る。
          </li>
          <li>
            モデルのファイルは、提供元が明らかな配布元から入手する。ファイル形式によっては読みこみ時にプログラムが実行されうるため、GGUF
            や safetensors のようなデータだけの形式が好まれる。
          </li>
        </ul>
      </DetailNote>

      <ChapterNav chapter={routes.ai.local} />
    </>
  );
}
