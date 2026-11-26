import type { Handle } from "@remix-run/component";

import { PasswordVsPasskey } from "../../islands/passkey/password.tsx";
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

export const title = "パスワードと、何がちがう？ — 図解パスキー";
export const description =
  "パスワードは、あなたとサイトが同じ合言葉を知っているしくみ。パスキーでは、サイトはログインに使える秘密を持っていません。サイトの記録がもれたときのちがいを、動く図で見てみます。";

export const hydrate = true;

export default function PasswordPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.passkey.password}>
        <p>
          パスキーは、パスワードのかわりにログインに使うものです。スマホやパソコンのロックを開けるのと同じように、指紋・顔・画面ロックのPINで「本人です」と示すだけで、サイトにログインできます。
        </p>
      </ChapterHead>

      <Cast
        items={[
          {
            icon: "keypad",
            name: "パスワード",
            note:
              "あなたとサイトが、同じ合言葉を知っている。ログインのたびに合言葉そのものを送る。",
          },
          {
            icon: "key",
            name: "パスキー",
            note:
              "ペアになった2つの鍵。秘密鍵はあなたの端末に、公開鍵はサイトに置く。",
          },
        ]}
      />

      <Analogy>
        <p>
          パスワードは、<strong>
            お店の人と決めた合言葉
          </strong>のようなものです。合言葉を言えば通してもらえますが、お店の名簿がだれかに見られたら、その人も同じ合言葉で通れてしまいます。パスキーは、<strong>
            あなたしか持っていないはんこ
          </strong>と、お店に預けた<strong>
            印影の見本
          </strong>のようなもの。お店は見本と見くらべて確かめるだけなので、見本が見られても、はんこは作れません。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：サイトの記録がもれたら、どうなる？">
        <PasswordVsPasskey />
      </Stage>

      <h2>サイトが持っているものが、ちがう</h2>
      <p>
        パスワードでは、サイトもあなたの合言葉を確かめられるだけの記録を持っています。そのため、サイトから記録がもれたり、にせサイトに合言葉を入れてしまったりすると、ほかの人があなたとしてログインできてしまいます。同じパスワードを使い回していると、被害はほかのサイトにも広がります。
      </p>
      <p>
        パスキーでは、サイトが持っているのは<strong>
          公開鍵
        </strong>だけです。公開鍵は「しるしが本物か」を確かめることはできても、しるしを作ることはできません。ログインに必要な<strong>
          秘密鍵は、あなたの端末の中
        </strong>にあり、サイトに送られることはありません。
      </p>
      <p>
        パスワードのように覚える必要もなく、サイトごとに別の鍵が自動で作られるので、使い回しもおきません。
      </p>

      <Summary>
        <p>
          パスワードは<strong>
            サイトと同じ秘密を分け合う
          </strong>しくみ。パスキーは、<strong>
            秘密はあなたの端末だけ
          </strong>に置き、サイトには確かめる道具（公開鍵）だけをわたすしくみ。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            パスキーは、W3C の仕様「Web Authentication（WebAuthn）」と、FIDO
            Alliance の仕様（CTAP など）にもとづく「FIDO 認証資格情報（FIDO
            credential）」の呼び名。仕様の言葉では「公開鍵クレデンシャル（public
            key
            credential）」で、パスキーはそのうち、ユーザー名を入れなくても選べる「discoverable
            credential」を指すことが多い。
          </li>
          <li>
            多くのサイトはパスワードをそのまま保存せず、ハッシュ（元にもどしにくい形に変換した値）で保存する。それでも、もれたハッシュから弱いパスワードは割り出されることがある。図では「記録」とまとめている。
          </li>
          <li>
            鍵の種類はサイトとの取り決めで決まり、よく使われるのは楕円曲線暗号の
            ECDSA（P-256、仕様の番号では ES256）。RSA や Ed25519 も使える。
          </li>
          <li>
            「サイトの記録がもれても大丈夫」なのは、<strong>
              パスキーでのログインを乗っ取られない
            </strong>という意味。名前・メールアドレス・購入履歴など、サイトが持つほかの情報がもれることは、パスキーでは防げない。
          </li>
          <li>
            パスキーを登録しても、そのサイトでパスワードやSMSのコードでもログインできるままなら、そちらは今までどおりねらわれうる。パスワードを使わない設定にできるサイトもある。
          </li>
        </ul>
      </DetailNote>

      <Sources items={[sources.fido, sources.passkeysDev, sources.webauthn]} />

      <ChapterNav chapter={routes.passkey.password} />
    </>
  );
}
