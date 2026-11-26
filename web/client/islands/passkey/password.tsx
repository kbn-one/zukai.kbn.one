/**
 * 図解パスキー chapter 1: what the website keeps, and what a leak of it gives away.
 *
 * With a password, the reader and the site both know the same secret, so a leak of the site's
 * records (or a look-alike site, chapter 4) hands it to someone else. With a passkey, the site
 * keeps only a public key, which can check a signature but cannot make one.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import {
  Actor,
  chooserStyle,
  sceneStyle,
  stampOf,
  Token,
  Verdict,
  Wire,
} from "../../ui/passkey_art.tsx";
import {
  buttonStyle,
  captionStyle,
  dangerStyle,
  emphasize,
  primaryStyle,
} from "../../ui/controls.tsx";
import { Icon } from "../../ui/icons.tsx";

type Method = "password" | "passkey";
type Act = "idle" | "login" | "leak";

const PASSWORD = "hana1234";
const CHALLENGE = "7C-2E";

const captions: Record<Method, Record<Act, string>> = {
  password: {
    idle:
      "パスワードでは、<あなたとサイトが同じ合言葉>を知っている。ログインのたびに、合言葉そのものをサイトに送るよ。",
    login:
      "あなたは合言葉<{P}>を送り、サイトは記録と照らし合わせる。合っていればログイン。でも、合言葉そのものがネットを通ったね。",
    leak:
      "サイトの記録がもれると、そこから<合言葉を割り出されて使われる>ことがある。同じパスワードをほかのサイトでも使っていたら、そっちも危ない。",
  },
  passkey: {
    idle:
      "パスキーでは、<秘密鍵はあなたの端末だけ>。サイトが持っているのは、ペアの<公開鍵>だけだよ。",
    login:
      "サイトは毎回ちがう<問題>を出す。端末は秘密鍵で問題に<しるし>をつけて返す。サイトは公開鍵でしるしを確かめてログイン。秘密鍵は送らない。",
    leak:
      "サイトの記録がもれても、出てくるのは<公開鍵>だけ。公開鍵では、しるしは作れない。だから、もれた情報で<ログインはできない>。",
  },
};

export const PasswordVsPasskey = clientEntry(
  import.meta.url,
  function PasswordVsPasskey(handle: Handle) {
    let method: Method = "password";
    let act: Act = "idle";

    const choose = (m: Method) => {
      method = m;
      act = "idle";
      handle.update();
    };
    const run = (a: Act) => {
      act = a;
      handle.update();
    };

    return () => {
      const pw = method === "password";
      const stamp = stampOf(CHALLENGE, "you");
      return (
        <div>
          <div mix={chooserStyle} role="group" aria-label="ログインの方法">
            {([
              ["password", "keypad", "パスワード"],
              ["passkey", "key", "パスキー"],
            ] as const).map(([m, icon, label]) => (
              <button
                key={m}
                type="button"
                aria-pressed={method === m ? "true" : "false"}
                mix={[
                  buttonStyle,
                  method === m ? primaryStyle : null,
                  on("click", () => choose(m)),
                ]}
              >
                <Icon name={icon} /> {label}
              </button>
            ))}
          </div>

          <div mix={sceneStyle}>
            <Actor
              tone="device"
              name="あなたの端末"
              note={pw ? "合言葉を覚えている" : "秘密鍵をしまっている"}
            >
              {pw
                ? <Token kind="password">{PASSWORD}</Token>
                : <Token kind="secret">秘密鍵（外に出ない）</Token>}
            </Actor>

            {act === "login"
              ? (
                <div mix={wiresStyle} key={`w-${method}`}>
                  {pw ? null : (
                    <Wire dir="left" label="サイトから">
                      <Token kind="challenge">問題 {CHALLENGE}</Token>
                    </Wire>
                  )}
                  <Wire dir="right" label="サイトへ">
                    {pw
                      ? <Token kind="password">{PASSWORD}</Token>
                      : <Token kind="signature">しるし {stamp}</Token>}
                  </Wire>
                </div>
              )
              : <Wire />}

            <Actor
              tone="site"
              name="サイト"
              note={pw ? "合言葉の記録を持っている" : "公開鍵だけを持っている"}
            >
              {pw
                ? <Token kind="password">{PASSWORD} の記録</Token>
                : <Token kind="public">公開鍵</Token>}
              {act === "login"
                ? <Verdict ok key={`ok-${method}`}>ログインOK</Verdict>
                : null}
            </Actor>
          </div>

          {act === "leak"
            ? (
              <div mix={leakStyle} key={`leak-${method}`}>
                <Actor
                  tone="bad"
                  name="もれた記録を手に入れた人"
                  icon="peeker"
                >
                  {pw
                    ? <Token kind="password">{PASSWORD}</Token>
                    : <Token kind="public">公開鍵</Token>}
                  {pw
                    ? (
                      <Verdict ok={false}>
                        この合言葉で、あなたとしてログインできてしまう
                      </Verdict>
                    )
                    : (
                      <Verdict ok>
                        公開鍵ではしるしを作れない。ログインできない
                      </Verdict>
                    )}
                </Actor>
              </div>
            )
            : null}

          <p mix={captionStyle} key={`${method}-${act}`} aria-live="polite">
            {emphasize(captions[method][act].replace("{P}", PASSWORD))}
          </p>

          <div mix={chooserStyle}>
            <button
              type="button"
              mix={[buttonStyle, on("click", () => run("login"))]}
            >
              <Icon name="door" /> ログインする
            </button>
            <button
              type="button"
              mix={[buttonStyle, dangerStyle, on("click", () => run("leak"))]}
            >
              <Icon name="alert" /> サイトから記録がもれたら？
            </button>
          </div>
        </div>
      );
    };
  },
);

const wiresStyle = css({ display: "grid", gap: "0.5rem" });

const leakStyle = css({ marginTop: "0.75rem" });
