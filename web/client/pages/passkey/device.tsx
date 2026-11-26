import type { Handle } from "@remix-run/component";

import { WhatTravels } from "../../islands/passkey/device.tsx";
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

export const title = "秘密鍵も指紋も、端末の外へは出ていかない — 図解パスキー";
export const description =
  "パスキーでログインするとき、ネットを流れるのは「問題」と「しるし」だけ。指紋や顔は端末のロックを開けるのに使われるだけで、サイトには送られません。1回のログインを、1歩ずつ追いかけます。";

export const hydrate = true;

export default function DevicePage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.passkey.device}>
        <p>
          パスキーでログインするとき、指紋や顔を使うことがよくあります。「指紋がサイトに送られるの？」と心配になるかもしれませんが、<strong>
            送られません
          </strong>。秘密鍵も、端末の外へは出ていきません。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          金庫の中にはんこがしまってあり、金庫は<strong>
            あなたの指紋でしか開かない
          </strong>、と考えてください。書類にはんこを押すときは、指紋で金庫を開け、金庫の中ではんこを押して、書類だけを外に出します。書類を受け取った人は、あなたの指紋もはんこも見ていません。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：ログインのとき、何がネットを流れる？">
        <WhatTravels />
      </Stage>

      <h2>指紋や顔は「端末を開ける」ために使う</h2>
      <p>
        指紋・顔・画面ロックのPINは、端末が「今さわっているのは持ち主だ」と確かめるために使います。照らし合わせは端末の中だけで行われ、サイトに届くのは「本人確認ができた」という印だけです。指紋を使わず、PINやパターンでロックを開けても、パスキーは同じように使えます。
      </p>
      <h2>秘密鍵は、しまわれた場所から出ない</h2>
      <p>
        秘密鍵は、端末の中の守られた場所や、パスワードマネージャーの中にしまわれます。しるしをつける計算もそこで行い、サイトへは結果のしるしだけを送ります。サイトがほしがっても、秘密鍵を取り出してわたすしくみはありません。
      </p>

      <Summary>
        <p>
          ネットを流れるのは<strong>
            問題としるし
          </strong>だけ。指紋・顔・PIN・秘密鍵は、<strong>
            端末から出ない
          </strong>。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            パスキーをしまい、しるしをつける部分を、仕様では「認証器（authenticator）」と呼ぶ。スマホやパソコンに組みこまれたもの（プラットフォーム認証器）と、USBやNFCでつなぐセキュリティキーなどがある。
          </li>
          <li>
            指紋・顔・PINでの確認を仕様では「ユーザー検証（user
            verification）」と呼び、サイトに届くのは、確認したかどうかを表すフラグ（UV
            フラグ）だけ。何で確認したか、指紋の特徴そのものは届かない。
          </li>
          <li>
            「秘密鍵は端末から出ない」は、サイトやネットに対しての話。iCloud
            キーチェーンや Google
            パスワードマネージャーのように同期するパスキーは、暗号化された形で、あなたの別の端末にコピーされる（第6章）。セキュリティキーのように、鍵を外に出せない作りのものもある。
          </li>
          <li>
            端末のロックを開けられる人（PINを知っている人など）は、その端末のパスキーも使えてしまう。端末のロックはしっかり設定しておく。
          </li>
        </ul>
      </DetailNote>

      <Sources items={[sources.webauthn, sources.apple, sources.google]} />

      <ChapterNav chapter={routes.passkey.device} />
    </>
  );
}
