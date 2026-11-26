/**
 * 図解パスキー chapter 4: a look-alike site. With a password, the reader types the secret into the
 * wrong site and it is gone. With a passkey, the browser — not the reader — compares the address
 * with the domain the passkey was made for, and finds none for the look-alike. A third story shows
 * why relaying the real site's question does not help the impostor either: the browser writes the
 * page's real address into what gets signed.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import {
  Actor,
  chooserStyle,
  FAKE_SITE,
  REAL_SITE,
  sceneStyle,
  Token,
  Verdict,
  Wire,
} from "../../ui/passkey_art.tsx";
import {
  buttonStyle,
  captionStyle,
  emphasize,
  primaryStyle,
} from "../../ui/controls.tsx";
import { Icon } from "../../ui/icons.tsx";
import { art, color, font, radius } from "../../tokens.ts";

type Story = "pwReal" | "pwFake" | "pkReal" | "pkFake" | "pkRelay";

const stories: {
  key: Story;
  label: string;
  site: "real" | "fake";
  passkey: boolean;
}[] = [
  { key: "pwReal", label: "パスワード × 本物", site: "real", passkey: false },
  { key: "pwFake", label: "パスワード × にせ", site: "fake", passkey: false },
  { key: "pkReal", label: "パスキー × 本物", site: "real", passkey: true },
  { key: "pkFake", label: "パスキー × にせ", site: "fake", passkey: true },
  {
    key: "pkRelay",
    label: "パスキー × にせ（本物の問題を横流し）",
    site: "fake",
    passkey: true,
  },
];

const captions: Record<Story, string> = {
  pwReal:
    "本物のサイトにパスワードを入れた。ログインできる。ここまでは問題なし。",
  pwFake:
    "見た目がそっくりな<にせサイト>。アドレスは1文字ちがうだけ。気づかずにパスワードを入れると、<そのまま相手の手に>。相手は本物のサイトでそれを使える。",
  pkReal:
    "ブラウザが、今のページのアドレス<{R}>を見て、<このサイト用に作ったパスキー>を探す。見つかったので、しるしをつけてログイン。",
  pkFake:
    "ブラウザは今のページのアドレス<{F}>を見る。このアドレス用のパスキーは<ない>。だから鍵は出てこない。<見分けるのは人ではなくブラウザ>なので、うっかり開いても鍵はわたらない。",
  pkRelay:
    "にせサイトが本物の問題を横流しして、しるしを取ろうとしても、<{F}用のパスキーはない>。かりにしるしが作られたとしても、ブラウザは<しるしの中に今のアドレス{F}を書きこむ>。本物のサイトは「うちのアドレスじゃない」とはねる。",
};

export const PhishingLab = clientEntry(
  import.meta.url,
  function PhishingLab(handle: Handle) {
    let story: Story = "pwReal";
    const choose = (s: Story) => {
      story = s;
      handle.update();
    };

    return () => {
      const s = stories.find((x) => x.key === story)!;
      const fake = s.site === "fake";
      const address = fake ? FAKE_SITE : REAL_SITE;
      return (
        <div>
          <div mix={chooserStyle} role="group" aria-label="ためす組み合わせ">
            {stories.map((x) => (
              <button
                key={x.key}
                type="button"
                aria-pressed={x.key === story ? "true" : "false"}
                mix={[
                  buttonStyle,
                  smallStyle,
                  x.key === story ? primaryStyle : null,
                  on("click", () => choose(x.key)),
                ]}
              >
                {x.label}
              </button>
            ))}
          </div>

          <div mix={sceneStyle} key={story}>
            <Actor
              tone="device"
              name="あなたのブラウザ"
              note={s.passkey ? "パスキーを持っている" : "パスワードを入れる"}
            >
              <span mix={addressStyle} data-fake={fake ? "true" : "false"}>
                <Icon name={fake ? "alert" : "lock"} />
                {address}
              </span>
              {s.passkey
                ? (
                  <>
                    <small>持っているパスキー</small>
                    <Token kind="secret">{REAL_SITE} 用の秘密鍵</Token>
                    {fake
                      ? <Verdict ok={false}>{FAKE_SITE} 用は、ない</Verdict>
                      : <Verdict ok>アドレスが合うパスキーがある</Verdict>}
                  </>
                )
                : <Token kind="password">hana1234</Token>}
            </Actor>

            <Wire dir="right" label={`${address} へ`}>
              {s.passkey
                ? (fake
                  ? <Token kind="ng">何も出さない</Token>
                  : (
                    <Token kind="signature">
                      しるし（{REAL_SITE} と書きこみ）
                    </Token>
                  ))
                : <Token kind="password">hana1234</Token>}
            </Wire>

            <Actor
              tone={fake ? "bad" : "site"}
              name={fake ? "にせサイト" : "本物のサイト"}
              note={address}
            >
              {fake
                ? (s.passkey
                  ? (
                    <Verdict ok>
                      {story === "pkRelay"
                        ? "しるしは手に入らない"
                        : "盗めるものがない"}
                    </Verdict>
                  )
                  : <Verdict ok={false}>パスワードを盗まれた</Verdict>)
                : <Verdict ok>ログインOK</Verdict>}
            </Actor>
          </div>

          {story === "pkRelay"
            ? (
              <div mix={relayStyle}>
                <Actor tone="site" name="本物のサイト" note={REAL_SITE}>
                  <small>もししるしがとどいても、中を見ると…</small>
                  <Token kind="domain">書かれたアドレス：{FAKE_SITE}</Token>
                  <Verdict ok={false}>うちのアドレスではない。はねる</Verdict>
                </Actor>
              </div>
            )
            : null}

          <p mix={captionStyle} key={`c-${story}`} aria-live="polite">
            {emphasize(
              captions[story].replaceAll("{R}", REAL_SITE).replaceAll(
                "{F}",
                FAKE_SITE,
              ),
            )}
          </p>
        </div>
      );
    };
  },
);

const smallStyle = css({
  minHeight: "2.5rem",
  padding: "0.3rem 0.9rem",
  fontSize: "0.9rem",
});

const addressStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.2rem 0.6rem",
  borderRadius: "999px",
  border: `1px solid ${color.line}`,
  background: color.surface,
  fontFamily: font.mono,
  fontSize: "0.9rem",
  '&[data-fake="true"]': { borderColor: art.ng, color: art.ng },
});

const relayStyle = css({
  marginTop: "0.75rem",
  borderRadius: radius.md,
});
