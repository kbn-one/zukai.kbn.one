import type { Handle } from "@remix-run/component";

import { SyncLab } from "../../islands/passkey/sync.tsx";
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

export const title = "スマホをなくしたら、パスキーはどうなる？ — 図解パスキー";
export const description =
  "iCloud キーチェーンや Google パスワードマネージャーは、パスキーを暗号化したまま、あなたの端末どうしで同期します。スマホをなくしたとき、新しいスマホにしたとき、人のパソコンでログインするときを、動く図で見てみます。";

export const hydrate = true;

export default function SyncPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.passkey.sync}>
        <p>
          秘密鍵が端末の中にあるなら、その端末をなくしたらどうなるのでしょう。答えは、<strong>
            パスキーをどこにしまっているか
          </strong>で変わります。
        </p>
      </ChapterHead>

      <Analogy>
        <p>
          同期するパスキーは、<strong>
            あなたにしか開けられない貸金庫
          </strong>に合いかぎを預けておくようなものです。手元の1本をなくしても、貸金庫から新しい端末へもどせます。貸金庫の管理会社も、中のかぎは見られません。セキュリティキーは、<strong>
            合いかぎを作れないかぎ
          </strong>です。なくしたら、そのかぎはもう使えません。
        </p>
      </Analogy>

      <Stage label="動かしてみよう：スマホをなくしたら？">
        <SyncLab />
      </Stage>

      <h2>同期するパスキー</h2>
      <p>
        iPhone や Mac では<strong>
          iCloud キーチェーン
        </strong>、Android や Chrome では<strong>
          Google パスワードマネージャー
        </strong>が、パスキーを暗号化したまま保存し、同じアカウントでサインインしているあなたの端末に同期します。1台をなくしても、ほかの端末で使えますし、新しい端末で同じアカウントにサインインすればもどってきます。1Password
        などのパスワード管理アプリも、同じようにパスキーを同期できます。
      </p>
      <h2>同期しないパスキー</h2>
      <p>
        USB や NFC でつなぐ<strong>
          セキュリティキー
        </strong>の中のパスキーは、コピーできません。なくすと、そのパスキーは使えなくなります。大事なアカウントには、予備のキーやスマホのパスキーなど、<strong>
          2つ以上登録しておく
        </strong>と安心です。
      </p>
      <h2>人のパソコンでログインするとき</h2>
      <p>
        自分のパスキーが入っていないパソコンでも、画面に出る QR
        コードを自分のスマホで読めば、スマホのパスキーでログインできます。このとき、パスキーはパソコンにコピーされません。
      </p>

      <Summary>
        <p>
          同期するパスキーは<strong>
            暗号化したまま、あなたの端末どうしで共有
          </strong>されるので、1台なくしても使いつづけられる。同期しないパスキーは、<strong>
            予備を登録
          </strong>しておく。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            iCloud キーチェーンと Google
            パスワードマネージャーは、パスキーをエンドツーエンドで暗号化して同期する。暗号を解くための鍵は利用者の端末側にあり、新しい端末でもどすときは、Apple
            アカウントや Google
            アカウントへのサインインに加えて、前の端末の画面ロックのパスコードや、Google
            パスワードマネージャーの PIN などを求められる。
          </li>
          <li>
            同期するパスキーの安全は、<strong>
              Apple アカウントや Google アカウントの安全
            </strong>にかかっている。アカウントの2段階認証や回復の方法は、きちんと設定しておく。
          </li>
          <li>
            Apple と Google の間で、パスキーが自動で同期されることはない。iPhone
            と Windows パソコンのように別々の仲間の端末を使うなら、QR
            コードでのログインや、両方で使えるパスワード管理アプリを使う。パスワード管理アプリどうしでパスキーを安全に移すしくみ（FIDO
            Alliance の Credential Exchange）も、使われ始めている。
          </li>
          <li>
            QR
            コードでのログインは、仕様では「ハイブリッド（hybrid）」と呼ばれる。QR
            コードで接続の情報をわたし、スマホとパソコンが近くにあることを
            Bluetooth
            で確かめてから、暗号化した通信でしるしを送る。遠くにいるだれかにQRコードを読ませても使えない。
          </li>
          <li>
            なくした端末は、「探す」機能やアカウントの設定から、遠くからロックしたり消したり、アカウントから外したりできる。端末のロックが破られないかぎり、拾った人がパスキーを使うことはできない。
          </li>
        </ul>
      </DetailNote>

      <Sources items={[sources.apple, sources.google, sources.fido]} />

      <ChapterNav chapter={routes.passkey.sync} />
    </>
  );
}
