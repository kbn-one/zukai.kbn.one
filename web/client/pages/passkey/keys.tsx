import type { Handle } from "@remix-run/component";

import { KeyPairLab } from "../../islands/passkey/keys.tsx";
import {
  Analogy,
  Cast,
  ChapterHead,
  ChapterNav,
  DetailNote,
  Sources,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";
import { sources } from "./sources.ts";

export const title = "秘密鍵と公開鍵は、はんこと印影の関係 — 図解パスキー";
export const description =
  "パスキーの正体は、ペアになった秘密鍵と公開鍵。秘密鍵でしか作れない「しるし」を、公開鍵で確かめます。しるしをつけて確かめる様子を、動く図でためせます。";

export const hydrate = true;

export default function KeysPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.passkey.keys}>
        <p>
          パスキーの中身は、<strong>
            秘密鍵と公開鍵
          </strong>という、ペアで作られた2つの「鍵」です。鍵といっても、数字の並んだデータです。
        </p>
      </ChapterHead>

      <Cast
        items={[
          {
            icon: "key",
            name: "秘密鍵",
            note:
              "しるし（電子署名）を作るための鍵。あなたの端末の中だけにしまわれる。",
          },
          {
            icon: "publicKey",
            name: "公開鍵",
            note:
              "しるしを確かめるための鍵。サイトにわたす。見られてもかまわない。",
          },
          {
            icon: "question",
            name: "問題（チャレンジ）",
            note: "サイトがログインのたびに作る、使い捨ての数字の並び。",
          },
        ]}
      />

      <Analogy>
        <p>
          秘密鍵は<strong>はんこ</strong>、公開鍵は<strong>
            役所に届けた印影
          </strong>にあたります。書類に押された印が、届けた印影と合えば「本人のはんこだ」とわかります。印影の見本をいくら見ても、はんこそのものは手に入りません。
        </p>
        <p>
          ただし、本物のはんこは印影から複製されることもあります。パスキーの鍵は、<strong>
            公開鍵から秘密鍵を割り出せないように
          </strong>、数学を使って作られているのがちがうところです。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：しるしをつけて、確かめてもらう">
        <KeyPairLab />
      </Stage>

      <h2>しるしは、問題と鍵の両方で決まる</h2>
      <p>
        ログインのとき、サイトは毎回ちがう<strong>
          問題
        </strong>を出します。端末は、その問題に秘密鍵で<strong>
          しるし
        </strong>をつけて返します。サイトは公開鍵で、「このしるしは、ペアの秘密鍵で、この問題につけたものか」を確かめます。
      </p>
      <p>
        問題が毎回ちがうので、前のログインのしるしをだれかがのぞき見して、あとでそのまま使っても通りません。別の人の秘密鍵で作ったしるしも、あなたの公開鍵では合いません。
      </p>

      <Summary>
        <p>
          秘密鍵は<strong>しるしを作る</strong>鍵、公開鍵は<strong>
            しるしを確かめる
          </strong>だけの鍵。サイトは公開鍵しか持たないので、サイトにはあなたのふりができない。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            ここでの「しるし」は電子署名（デジタル署名）のこと。図の英数字は説明用の作りもので、本物の電子署名はもっと長いデータになる。
          </li>
          <li>
            WebAuthn
            で署名されるのは、問題そのものだけではない。ブラウザが作る「clientDataJSON」（問題・ページのオリジン・処理の種類が入る）のハッシュと、認証器が作る「authenticatorData」（サイトの
            ID
            のハッシュ・本人確認のフラグ・カウンターなど）をつなげたものに署名する。
          </li>
          <li>
            公開鍵から秘密鍵を計算で求めるのは、今のコンピューターでは現実的な時間ではできないとされている。将来の大きな量子コンピューターには弱いと考えられている方式もあり、新しい方式への切りかえが検討されている。
          </li>
          <li>
            鍵のペアは、サイト（とアカウント）ごとに新しく作られる。1つのパスキーを、いくつものサイトで使い回すことはない。
          </li>
        </ul>
      </DetailNote>

      <Sources items={[sources.webauthn, sources.mdn, sources.passkeysDev]} />

      <ChapterNav chapter={routes.passkey.keys} />
    </>
  );
}
