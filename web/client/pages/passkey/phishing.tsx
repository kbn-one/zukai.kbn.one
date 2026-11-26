import type { Handle } from "@remix-run/component";

import { PhishingLab } from "../../islands/passkey/phishing.tsx";
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

export const title = "にせサイトでは、パスキーは使えない — 図解パスキー";
export const description =
  "パスキーは、作ったサイトのドメインに結びついています。見た目がそっくりなにせサイトでも、ドメインがちがえばブラウザは鍵を出しません。フィッシングに強い理由を、動く図でくらべます。";

export const hydrate = true;

export default function PhishingPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.passkey.phishing}>
        <p>
          本物そっくりのにせサイトにさそいこんで、パスワードを入れさせる手口を<strong>
            フィッシング
          </strong>といいます。パスキーは、このフィッシングにとても強いしくみです。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          パスキーは、<strong>
            宛先の名前が書かれた鍵
          </strong>のようなものです。「example-bank.jp
          用」と書かれた鍵は、名前がぴったり合うとびらにしか差しこめません。そっくりなとびらでも、名前が1文字でもちがえば、鍵はポケットから出てきません。名前を見くらべるのは、あなたではなく<strong>
            ブラウザ
          </strong>です。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：にせサイトで、パスワードとパスキーをくらべる">
        <PhishingLab />
      </Stage>

      <h2>人が見分けなくても、ブラウザが見分ける</h2>
      <p>
        パスワードは、あなたが入れた場所へそのまま送られます。にせサイトかどうかを見分けるのは、あなたの目だけがたよりです。アドレスが1文字ちがうだけのにせサイトに、気づかずに入れてしまうこともあります。
      </p>
      <p>
        パスキーは、作ったときに<strong>
          サイトのドメイン
        </strong>（example-bank.jp
        のような名前）と結びつけてしまわれます。ログインのときは、ブラウザが今開いているページのアドレスを見て、それに合うパスキーだけを使います。にせサイトのアドレスに合うパスキーはないので、そもそも鍵が使われません。
      </p>
      <p>
        さらにブラウザは、しるしをつける中身に<strong>
          今のページのアドレス
        </strong>を書きこみます。サイトは、それが自分のアドレスかどうかも確かめます。
      </p>

      <Summary>
        <p>
          パスキーは<strong>
            作ったサイトのドメインに結びつく
          </strong>。ドメインを見くらべるのはブラウザなので、にせサイトにだまされても、鍵はわたらない。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            パスキーが結びつく名前を、仕様では「RP ID」（Relying Party
            ID）と呼ぶ。ふつうはサイトのドメイン（例：example-bank.jp）。ブラウザは、今のページのドメインがその
            RP ID
            と同じか、そのサブドメイン（例：login.example-bank.jp）のときだけ、そのパスキーを使わせる。
          </li>
          <li>
            しるしをつける中身（clientDataJSON）には、ブラウザが今のページのオリジン（https://example-bank.jp
            など）を書きこむ。サイトのサーバーはこれと、authenticatorData
            に入った RP ID
            のハッシュを確かめる。サイトがこの確認をきちんと行うことも、フィッシングに強い理由の一部。
          </li>
          <li>
            見分けるのはブラウザなので、ブラウザや端末そのものがウイルスに乗っ取られている場合は話が別。また、ログインしたあとの状態（クッキー）を盗む攻撃は、パスキーでは防げない。
          </li>
          <li>
            にせサイトに強くなるのは、パスキーでログインするときの話。同じアカウントでパスワードやSMSのコードでのログインもできるままなら、にせサイトはそちらを入れさせようとする。「パスキーでログインしてください」と出るはずの場面で、パスワードを聞かれたら注意する。
          </li>
          <li>
            スマホのアプリでも、アプリとサイトのドメインの結びつきをOSが確かめたうえで、同じパスキーを使えるようになっている。
          </li>
        </ul>
      </DetailNote>

      <Sources items={[sources.webauthn, sources.passkeysDev, sources.fido]} />

      <ChapterNav chapter={routes.passkey.phishing} />
    </>
  );
}
