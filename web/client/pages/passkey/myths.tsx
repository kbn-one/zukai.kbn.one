import type { Handle } from "@remix-run/component";

import { MythCards } from "../../islands/passkey/myths.tsx";
import {
  ChapterHead,
  ChapterNav,
  DetailNote,
  Sources,
  Stage,
  Summary,
} from "../../parts.tsx";
import { routes } from "../../routes.ts";
import { sources } from "./sources.ts";

export const title = "パスキーの、よくある誤解 — 図解パスキー";
export const description =
  "「指紋がサイトに送られる」「スマホをなくしたらおしまい」「パスキーなら何があっても安全」。パスキーについてよく聞く話が本当かどうか、カードをめくって確かめます。";

export const hydrate = true;

export default function MythsPage(_handle: Handle) {
  return () => (
    <>
      <ChapterHead chapter={routes.passkey.myths}>
        <p>
          パスキーは新しいしくみなので、まちがった話も広まっています。ここまでの章をふりかえりながら、よくある誤解をひとつずつ確かめましょう。
        </p>
      </ChapterHead>

      <Stage label="ためしてみよう：これは本当？">
        <MythCards />
      </Stage>

      <h2>強いところと、別の話</h2>
      <p>
        パスキーが特に強いのは、<strong>
          にせサイト
        </strong>と<strong>
          サイトからの情報もれ
        </strong>です。どちらも、パスワードでいちばん多い被害の入口でした。
      </p>
      <p>
        いっぽうで、端末のロックを知られること、Apple や Google
        のアカウントを乗っ取られること、パスワードやSMSでのログインが別の入口として残っていることは、パスキーだけでは防げません。パスキーにしたあとも、端末のロックとアカウントの守りは大切です。
      </p>

      <Summary>
        <p>
          パスキーは<strong>
            にせサイトと情報もれに強い
          </strong>ログインのしくみ。ただし<strong>
            端末のロックと、同期に使うアカウント
          </strong>を守ることは、これまでどおり必要。
        </p>
      </Summary>

      <DetailNote>
        <ul>
          <li>
            パスキーは、サイトごと・アカウントごとに別の鍵のペアを作り、ほかのサイトからは見えない。ただし、同じメールアドレスや電話番号を登録していれば、サイトどうしがそれで同じ人だと気づくことはありうる。これはパスキーとは別の話。
          </li>
          <li>
            「パスキーに対応」していても、パスワードでのログインを残しているサイトは多い。パスワードを消したり、使えないように設定できたりするかはサイトしだい。
          </li>
          <li>
            端末を家族と共有していて、家族が画面ロックのPINを知っている場合、その家族もパスキーを使ってログインできてしまう。
          </li>
          <li>
            アカウントをなくしたときの回復（パスワードを忘れたとき、のような手続き）は、サイトごとに決めている。回復の手続きが弱いと、そこが攻撃の入口になる。
          </li>
        </ul>
      </DetailNote>

      <Sources items={[sources.fido, sources.passkeysDev]} />

      <ChapterNav chapter={routes.passkey.myths} />
    </>
  );
}
