/**
 * 図解パスキー chapter 2: a key pair. The secret key makes a signature over a question; the public
 * key checks it. A different secret key, or the right signature on an old question, does not pass,
 * and the public key cannot make a signature at all.
 *
 * The signature is the stand-in `stampOf`, not real cryptography.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import {
  Actor,
  newChallenge,
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

/** The first question, fixed so the server and the browser render the same thing. */
const FIRST = "3A-91";

interface Signed {
  by: "mine" | "other";
  on: string;
}

export const KeyPairLab = clientEntry(
  import.meta.url,
  function KeyPairLab(handle: Handle) {
    let challenge = FIRST;
    let signed: Signed | null = null;
    let checked: boolean | null = null;
    let caption =
      "左があなたの端末、右がサイト。サイトの<問題>に、端末の<秘密鍵>でしるしをつけてみよう。";

    const sign = (by: Signed["by"]) => {
      signed = { by, on: challenge };
      checked = null;
      caption = by === "mine"
        ? "<あなたの秘密鍵>で、問題にしるしをつけた。しるしは問題と鍵の両方で決まるので、問題がちがえばしるしもちがう。"
        : "<別の人の秘密鍵>でしるしをつけた。見た目はそれらしいけれど、サイトが持っているのはあなたの公開鍵だよ。";
      handle.update();
    };
    const check = () => {
      if (!signed) return;
      checked = signed.by === "mine" && signed.on === challenge;
      caption = checked
        ? "サイトは<あなたの公開鍵>で確かめた。たしかにペアの秘密鍵で、この問題につけたしるしだ。<OK>。"
        : signed.by === "other"
        ? "公開鍵で確かめると<合わない>。ペアの秘密鍵で作ったしるしではないから。"
        : "公開鍵で確かめると<合わない>。これは前の問題につけたしるしで、今の問題につけたものではないから。";
      handle.update();
    };
    const renew = () => {
      challenge = newChallenge(challenge);
      checked = null;
      caption = signed
        ? "サイトが<新しい問題>を出した。手元のしるしは前の問題のもの。このまま確かめてもらうと、どうなるかな？"
        : "サイトが<新しい問題>を出した。";
      handle.update();
    };
    const forge = () => {
      signed = null;
      checked = null;
      caption =
        "公開鍵は<確かめる>ことしかできない。公開鍵から秘密鍵を割り出すこともできないように作られているので、公開鍵を持っていても、しるしは作れないんだ。";
      handle.update();
    };

    return () => {
      const stamp = signed
        ? stampOf(signed.on, signed.by === "mine" ? "you" : "someone")
        : null;
      return (
        <div>
          <div mix={sceneStyle}>
            <Actor tone="device" name="あなたの端末" note="秘密鍵を持っている">
              <Token kind="secret">あなたの秘密鍵</Token>
              {stamp
                ? (
                  <Token kind="signature" fresh key={stamp}>
                    しるし {stamp}
                  </Token>
                )
                : null}
            </Actor>
            <Wire dir="right" label="しるしを送る">
              {stamp ? <Token kind="signature">{stamp}</Token> : null}
            </Wire>
            <Actor tone="site" name="サイト" note="公開鍵を持っている">
              <Token kind="challenge" key={challenge} fresh>
                問題 {challenge}
              </Token>
              <Token kind="public">あなたの公開鍵</Token>
              {checked === null ? null : (
                <Verdict
                  ok={checked}
                  key={`${stamp}-${challenge}-${checked}`}
                >
                  {checked ? "ペアの鍵のしるし。OK" : "合わない"}
                </Verdict>
              )}
            </Actor>
          </div>

          <p mix={captionStyle} key={caption} aria-live="polite">
            {emphasize(caption)}
          </p>

          <div mix={buttonsStyle}>
            <button
              type="button"
              mix={[buttonStyle, primaryStyle, on("click", () => sign("mine"))]}
            >
              <Icon name="key" /> 秘密鍵でしるしをつける
            </button>
            <button
              type="button"
              mix={[buttonStyle, on("click", check)]}
              disabled={signed === null}
            >
              <Icon name="publicKey" /> 公開鍵で確かめる
            </button>
            <button type="button" mix={[buttonStyle, on("click", renew)]}>
              <Icon name="restart" /> 新しい問題にする
            </button>
            <button
              type="button"
              mix={[buttonStyle, dangerStyle, on("click", () => sign("other"))]}
            >
              <Icon name="userX" /> 別の人の秘密鍵でつける
            </button>
            <button
              type="button"
              mix={[buttonStyle, dangerStyle, on("click", forge)]}
            >
              <Icon name="publicKey" /> 公開鍵でしるしを作ってみる
            </button>
          </div>
        </div>
      );
    };
  },
);

const buttonsStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
});
