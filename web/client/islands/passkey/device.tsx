/**
 * 図解パスキー chapter 3: one login, step by step, with a running list of what crossed the network
 * and what stayed on the device. The fingerprint (or face, or PIN) only unlocks the device; the
 * site hears that the check passed, never the fingerprint itself.
 */

import { clientEntry, css, type Handle } from "@remix-run/component";

import {
  Actor,
  sceneStyle,
  stampOf,
  Token,
  Verdict,
  Wire,
} from "../../ui/passkey_art.tsx";
import { captionStyle, emphasize, StepBar } from "../../ui/controls.tsx";
import { art, color, font, radius } from "../../tokens.ts";

const CHALLENGE = "B4-0D";

const captions = [
  "「パスキーでログイン」をおすと、サイトは<毎回ちがう問題>を作って、端末に送ってくる。",
  "端末が「本人ですか？」と聞く。<指紋・顔・画面ロックのPIN>で答える。照らし合わせるのは<端末の中だけ>。",
  "本人とわかったら、端末の中で<秘密鍵>が問題にしるしをつける。秘密鍵は、しまわれた場所から出ない。",
  "端末は<しるし>と「本人確認できた」という<印>をサイトへ送る。指紋も秘密鍵も送らない。",
  "サイトは<公開鍵>でしるしを確かめて、ログインOK。サイトは、あなたの指紋を一度も見ていない。",
];

export const WhatTravels = clientEntry(
  import.meta.url,
  function WhatTravels(handle: Handle) {
    let step = 0;
    const go = (n: number) => {
      step = Math.max(0, Math.min(captions.length - 1, n));
      handle.update();
    };

    return () => {
      const stamp = stampOf(CHALLENGE, "you");
      return (
        <div>
          <div mix={sceneStyle}>
            <Actor
              tone="device"
              name="あなたの端末"
              note="スマホ・パソコンなど"
              active={step === 1 || step === 2}
            >
              <Token kind="secret">秘密鍵</Token>
              {step >= 1
                ? (
                  <Token kind="bio" fresh={step === 1}>
                    指紋・顔・PIN（照合は端末の中）
                  </Token>
                )
                : null}
              {step >= 2
                ? (
                  <Token kind="signature" fresh={step === 2}>
                    しるし {stamp}
                  </Token>
                )
                : null}
            </Actor>

            {step === 0
              ? (
                <Wire dir="left" key="q" label="サイトから">
                  <Token kind="challenge">問題 {CHALLENGE}</Token>
                </Wire>
              )
              : step === 3
              ? (
                <Wire dir="right" key="s" label="サイトへ">
                  <Token kind="signature">しるし</Token>
                  <Token kind="bio">本人確認OKの印</Token>
                </Wire>
              )
              : <Wire />}

            <Actor
              tone="site"
              name="サイト"
              note="example-bank.jp"
              active={step === 0 || step === 4}
            >
              <Token kind="public">あなたの公開鍵</Token>
              <Token kind="challenge">問題 {CHALLENGE}</Token>
              {step >= 4
                ? <Verdict ok>しるしが合う。ログインOK</Verdict>
                : null}
            </Actor>
          </div>

          <div mix={ledgerStyle}>
            <section aria-label="ネットを流れたもの">
              <h3>ネットを流れたもの</h3>
              <ul>
                <li>問題（毎回ちがう）</li>
                {step >= 3 ? <li>しるし</li> : null}
                {step >= 3 ? <li>本人確認できた、という印</li> : null}
              </ul>
            </section>
            <section aria-label="端末から出なかったもの">
              <h3>端末から出なかったもの</h3>
              <ul>
                <li>秘密鍵</li>
                {step >= 1 ? <li>指紋・顔のデータ、PIN</li> : null}
              </ul>
            </section>
          </div>

          <p mix={captionStyle} key={step} aria-live="polite">
            {emphasize(captions[step])}
          </p>
          <StepBar step={step} total={captions.length} onGo={go} />
        </div>
      );
    };
  },
);

const ledgerStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.5rem",
  marginTop: "0.75rem",
  "@media (max-width: 480px)": { gridTemplateColumns: "minmax(0, 1fr)" },
  "& section": {
    padding: "0.6rem 0.85rem",
    borderRadius: radius.md,
    border: `1px solid ${color.border}`,
    background: color.card,
  },
  "& section:last-child": { background: art.softGreen },
  "& h3": {
    margin: 0,
    fontFamily: font.round,
    fontSize: "0.9rem",
    color: color.muted,
  },
  "& ul": { margin: "0.3rem 0 0", paddingLeft: "1.2rem" },
  "& li": { fontSize: "0.9rem", lineHeight: 1.7 },
});
