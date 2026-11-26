/**
 * 図解パスキー chapter 5: registration and login, each as a step-through. What the device and the
 * site hold grows step by step, and the wire between them shows what crosses on each step.
 */

import {
  clientEntry,
  type Handle,
  on,
  type RemixNode,
} from "@remix-run/component";

import {
  Actor,
  chooserStyle,
  REAL_SITE,
  sceneStyle,
  stampOf,
  Token,
  Verdict,
  Wire,
} from "../../ui/passkey_art.tsx";
import {
  buttonStyle,
  captionStyle,
  emphasize,
  primaryStyle,
  StepBar,
} from "../../ui/controls.tsx";
import { Icon } from "../../ui/icons.tsx";

type Mode = "register" | "login";

const REG_CHALLENGE = "51-A7";
const LOGIN_CHALLENGE = "E2-3C";
const CRED_ID = "鍵の番号 #k9";

interface Step {
  caption: string;
  /** What crosses this step, and which way. */
  wire?: { dir: "left" | "right"; items: RemixNode[] };
}

const registerSteps: Step[] = [
  {
    caption:
      "ログインした状態で「パスキーを作成」をおす。サイトは<問題>・<サイトのドメイン>・<あなたのアカウントの番号>を端末に送る。",
    wire: {
      dir: "left",
      items: [
        <Token key="q" kind="challenge">問題 {REG_CHALLENGE}</Token>,
        <Token key="d" kind="domain">{REAL_SITE}</Token>,
        <Token key="u" kind="challenge">アカウント番号</Token>,
      ],
    },
  },
  {
    caption:
      "端末が<本人確認>をする。指紋・顔・画面ロックのPINなど。照らし合わせるのは端末の中。",
  },
  {
    caption:
      "端末は<このサイトのためだけの、新しい鍵のペア>を作る。秘密鍵は<{D}用>として、端末（またはパスワードマネージャー）にしまう。",
  },
  {
    caption:
      "サイトに送るのは<公開鍵>と<鍵の番号>。ブラウザが<問題とページのアドレス>を書いた記録もそえる。",
    wire: {
      dir: "right",
      items: [
        <Token key="p" kind="public">公開鍵</Token>,
        <Token key="i" kind="challenge">{CRED_ID}</Token>,
      ],
    },
  },
  {
    caption:
      "サイトは問題とドメインを確かめ、<公開鍵をあなたのアカウントに保存>する。これで登録はおしまい。秘密鍵は一度もサイトに行っていない。",
  },
];

const loginSteps: Step[] = [
  {
    caption:
      "ログイン画面で「パスキーでログイン」。サイトは<今回だけの新しい問題>を送る。",
    wire: {
      dir: "left",
      items: [
        <Token key="q" kind="challenge">問題 {LOGIN_CHALLENGE}</Token>,
      ],
    },
  },
  {
    caption:
      "ブラウザは、今のページのアドレス<{D}>用のパスキーを探して、候補を出す。あなたはそれを選ぶだけ。",
  },
  {
    caption: "端末が<本人確認>をする。ここも端末の中だけで終わる。",
  },
  {
    caption:
      "秘密鍵で、<問題・アドレス・本人確認した印>をまとめたものにしるしをつけて、<鍵の番号>といっしょに送る。",
    wire: {
      dir: "right",
      items: [
        <Token key="s" kind="signature">
          しるし {stampOf(LOGIN_CHALLENGE, "you")}
        </Token>,
        <Token key="i" kind="challenge">{CRED_ID}</Token>,
      ],
    },
  },
  {
    caption:
      "サイトは鍵の番号から<保存しておいた公開鍵>を出して確かめる。しるしが合う・問題が今回のもの・アドレスが自分のもの。そろえば<ログインOK>。",
  },
];

export const RegisterAndLogin = clientEntry(
  import.meta.url,
  function RegisterAndLogin(handle: Handle) {
    let mode: Mode = "register";
    let step = 0;

    const steps = () => (mode === "register" ? registerSteps : loginSteps);
    const go = (n: number) => {
      step = Math.max(0, Math.min(steps().length - 1, n));
      handle.update();
    };
    const choose = (m: Mode) => {
      mode = m;
      step = 0;
      handle.update();
    };

    return () => {
      const current = steps()[step];
      const reg = mode === "register";
      // What each side holds by this step.
      const deviceHas = reg
        ? [
          step >= 1 ? <Token key="b" kind="bio">本人確認OK</Token> : null,
          step >= 2
            ? (
              <Token key="k" kind="secret" fresh={step === 2}>
                秘密鍵（{REAL_SITE} 用）
              </Token>
            )
            : null,
          step >= 2 ? <Token key="p" kind="public">公開鍵</Token> : null,
        ]
        : [
          <Token key="k" kind="secret">秘密鍵（{REAL_SITE} 用）</Token>,
          step >= 1
            ? (
              <Token key="d" kind="domain" fresh={step === 1}>
                {REAL_SITE} 用が見つかった
              </Token>
            )
            : null,
          step >= 2 ? <Token key="b" kind="bio">本人確認OK</Token> : null,
        ];
      const siteHas = reg
        ? [
          <Token key="q" kind="challenge">問題 {REG_CHALLENGE}</Token>,
          step >= 4
            ? (
              <Token key="p" kind="public" fresh>
                あなたの公開鍵（{CRED_ID}）
              </Token>
            )
            : null,
          step >= 4 ? <Verdict key="v" ok>登録できた</Verdict> : null,
        ]
        : [
          <Token key="p" kind="public">あなたの公開鍵（{CRED_ID}）</Token>,
          <Token key="q" kind="challenge">問題 {LOGIN_CHALLENGE}</Token>,
          step >= 4 ? <Verdict key="v" ok>ログインOK</Verdict> : null,
        ];

      return (
        <div>
          <div mix={chooserStyle} role="group" aria-label="登録かログインか">
            {([
              ["register", "sparkle", "はじめての登録"],
              ["login", "door", "つぎからのログイン"],
            ] as const).map(([m, icon, label]) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m ? "true" : "false"}
                mix={[
                  buttonStyle,
                  mode === m ? primaryStyle : null,
                  on("click", () => choose(m)),
                ]}
              >
                <Icon name={icon} /> {label}
              </button>
            ))}
          </div>

          <div mix={sceneStyle}>
            <Actor tone="device" name="あなたの端末" note="ブラウザ・OS">
              {deviceHas}
            </Actor>
            {current.wire
              ? (
                <Wire
                  key={`${mode}-${step}`}
                  dir={current.wire.dir}
                  label={current.wire.dir === "left"
                    ? "サイトから"
                    : "サイトへ"}
                >
                  {current.wire.items}
                </Wire>
              )
              : <Wire />}
            <Actor tone="site" name="サイト" note={REAL_SITE}>
              {siteHas}
            </Actor>
          </div>

          <p mix={captionStyle} key={`${mode}-${step}`} aria-live="polite">
            {emphasize(current.caption.replaceAll("{D}", REAL_SITE))}
          </p>
          <StepBar step={step} total={steps().length} onGo={go} />
        </div>
      );
    };
  },
);
