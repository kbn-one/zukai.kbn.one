/**
 * 図解パスキー's own top page: the whole picture at once — what stays on your device, what the
 * site keeps, and what travels between them — then the chapters that take it apart.
 *
 * The overview is drawn on the server and does not move; each chapter's picture does.
 */

import { css, type Handle } from "@remix-run/component";

import {
  Actor,
  REAL_SITE,
  sceneStyle,
  Token,
  Wire,
} from "../../ui/passkey_art.tsx";
import { ChapterList, Summary } from "../../parts.tsx";
import { seriesOf } from "../../series.ts";
import { color, font } from "../../tokens.ts";

const passkey = seriesOf("passkey");

export const title = "図解パスキー — パスワードのいらないログインのしくみ";
export const description = passkey.lead;

/** The overview is still; the runtime is only needed on the chapters. */
export const hydrate = false;

export default function PasskeyIndex(_handle: Handle) {
  return () => (
    <>
      <header mix={heroStyle}>
        <p mix={eyebrowStyle}>図解パスキー</p>
        <h1>パスキーって、どういうしくみ？</h1>
        <p>{passkey.lead}</p>
      </header>

      <section aria-label="全体図" mix={overviewStyle}>
        <div mix={sceneStyle}>
          <Actor tone="device" name="あなたの端末" note="スマホ・パソコン">
            <small>端末から出ないもの</small>
            <Token kind="secret">秘密鍵（サイトごとに1つ）</Token>
            <Token kind="bio">指紋・顔・PIN</Token>
          </Actor>
          <div mix={wiresStyle}>
            <Wire dir="left" label="毎回ちがう問題">
              <Token kind="challenge">問題</Token>
            </Wire>
            <Wire dir="right" label="秘密鍵でつけたしるし">
              <Token kind="signature">しるし</Token>
            </Wire>
          </div>
          <Actor tone="site" name="サイト" note={REAL_SITE}>
            <small>サイトが持っているもの</small>
            <Token kind="public">公開鍵（確かめる専用）</Token>
          </Actor>
        </div>
      </section>

      <Summary>
        <ul mix={pointsStyle}>
          <li>
            パスキーは、<strong>
              秘密鍵と公開鍵のペア
            </strong>。サイトには公開鍵だけをわたす。
          </li>
          <li>
            ログインでは、サイトの<strong>
              毎回ちがう問題
            </strong>に、秘密鍵でしるしをつけて返す。
          </li>
          <li>
            秘密鍵も指紋も<strong>
              端末の外へは出ない
            </strong>。指紋や顔は、端末のロックを開けるのに使うだけ。
          </li>
          <li>
            パスキーは<strong>
              作ったサイトのドメインに結びつく
            </strong>ので、にせサイトでは使えない。
          </li>
          <li>
            iCloud キーチェーンや Google パスワードマネージャーなら、<strong>
              暗号化したまま同期
            </strong>されて、スマホをなくしても使いつづけられる。
          </li>
        </ul>
      </Summary>

      <h2>もくじ</h2>
      <ChapterList series={passkey} />
    </>
  );
}

const heroStyle = css({
  marginBottom: "2rem",
  "& > p:last-child": { fontSize: "1.15rem" },
});

const eyebrowStyle = css({
  margin: "0 0 0.5rem",
  fontFamily: font.round,
  fontWeight: 800,
  color: color.accent,
});

const overviewStyle = css({ marginBlock: "1rem 0" });

const wiresStyle = css({ display: "grid", gap: "0.5rem" });

const pointsStyle = css({
  margin: 0,
  paddingLeft: "1.2rem",
  "& li": { marginBlock: "0.2rem" },
});
