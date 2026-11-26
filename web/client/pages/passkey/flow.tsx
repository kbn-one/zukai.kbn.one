import type { Handle } from "@remix-run/component";

import { RegisterAndLogin } from "../../islands/passkey/flow.tsx";
import {
  Analogy,
  ChapterHead,
  ChapterNav,
  DetailNote,
  Sources,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";
import { sources } from "./sources.ts";

export const title = "登録とログインは、こう流れる — 図解パスキー";
export const description =
  "パスキーの登録では、サイトごとに新しい鍵のペアを作り、公開鍵だけをサイトにわたします。ログインでは、毎回ちがう問題にしるしをつけて返します。2つの流れを、1歩ずつ見てみます。";

export const hydrate = true;

export default function FlowPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.passkey.flow}>
        <p>
          パスキーを使うには、まずサイトに<strong>
            登録
          </strong>します。一度登録すれば、つぎからはそのパスキーで<strong>
            ログイン
          </strong>できます。それぞれで、端末とサイトの間に何が行き来するのかを見てみましょう。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          登録は、<strong>
            新しいはんこを作って、印影を届け出る
          </strong>こと。ログインは、窓口で出された<strong>
            その日だけの書類
          </strong>にはんこを押して見せることです。はんこは、そのお店専用に毎回新しく作ります。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：登録とログインを1歩ずつ">
        <RegisterAndLogin />
      </Stage>

      <h2>登録：鍵のペアを作って、公開鍵をわたす</h2>
      <p>
        サイトで「パスキーを作成」を選ぶと、サイトは問題・サイトのドメイン・あなたのアカウントの番号を送ってきます。端末は本人確認をしてから、そのサイト専用の鍵のペアを作り、秘密鍵をしまいます。サイトには公開鍵と、鍵を見分けるための番号をわたします。
      </p>
      <h2>ログイン：毎回ちがう問題に、しるしをつける</h2>
      <p>
        ログインでは、サイトが新しい問題を出します。ブラウザは今のページのドメインに合うパスキーを探して候補を出し、あなたが選んで本人確認をすると、秘密鍵で問題にしるしをつけて返します。サイトは保存しておいた公開鍵で確かめます。ユーザー名を入れなくても、パスキーを選ぶだけでどのアカウントかがわかります。
      </p>

      <Summary>
        <p>
          登録は<strong>
            鍵のペアを作って公開鍵をわたす
          </strong>。ログインは<strong>
            毎回ちがう問題にしるしをつけて返す
          </strong>。どちらでも、秘密鍵はサイトへ行かない。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            登録はブラウザの{" "}
            <code>navigator.credentials.create()</code>、ログインは{" "}
            <code>navigator.credentials.get()</code>{" "}
            で始まる。サイトのサーバーが問題（challenge）などを用意し、ブラウザと認証器が残りを受け持つ。
          </li>
          <li>
            登録でサイトに返るのは、公開鍵・鍵の番号（credential
            ID）・clientDataJSON（問題とオリジン）・authenticatorData
            など。サイトは問題とオリジンを確かめてから、公開鍵をアカウントに保存する。
          </li>
          <li>
            登録のとき、認証器の種類を証明する「アテステーション」をつけることもできるが、ふつうのサイトでは求めないことが多く、同期するパスキーではつかないのがふつう。
          </li>
          <li>
            ログインで返るのは、しるし（signature）・authenticatorData・clientDataJSON・鍵の番号・アカウントの番号（user
            handle）。サイトは、しるしが公開鍵で合うこと、問題が今回出したものであること、オリジンと
            RP ID
            が自分のものであること、必要なら本人確認のフラグが立っていることを確かめる。
          </li>
          <li>
            図では「本人確認」を毎回入れているが、サイトが本人確認をどこまで求めるかは設定（userVerification）で決まる。多くのパスキーのログインでは本人確認を行う。
          </li>
          <li>
            ユーザー名の入力欄をタップしたときに、パスワードの候補と並んでパスキーが出てくる形（オートフィル、仕様では
            conditional mediation）もある。
          </li>
        </ul>
      </DetailNote>

      <Sources items={[sources.webauthn, sources.mdn, sources.google]} />

      <ChapterNav chapter={routes.passkey.flow} />
    </>
  );
}
