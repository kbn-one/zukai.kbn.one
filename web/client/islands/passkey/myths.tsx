/**
 * 図解パスキー chapter 7: common beliefs about passkeys, each one a card to turn over. Some are
 * wrong, some are right, and one is right with a catch.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import { captionStyle, emphasize } from "../../ui/controls.tsx";
import { Icon } from "../../ui/icons.tsx";
import { art, color, font, radius } from "../../tokens.ts";

type Verdict = "wrong" | "right" | "partly";

interface Myth {
  claim: string;
  verdict: Verdict;
  answer: string;
}

const myths: Myth[] = [
  {
    claim: "指紋や顔のデータが、サイトに送られる",
    verdict: "wrong",
    answer:
      "送られない。指紋や顔は<端末のロックを開ける>のに使うだけで、照らし合わせも端末の中。サイトに届くのは「本人確認できた」という印と、しるしだけ。",
  },
  {
    claim: "パスキーは、パスワードを端末に保存しているだけ",
    verdict: "wrong",
    answer:
      "ちがう。パスキーは<秘密鍵と公開鍵のペア>。サイトに同じ秘密を教えることはなく、ログインのたびに送るのは、毎回ちがう問題へのしるし。",
  },
  {
    claim: "サイトから記録がもれても、パスキーは盗まれない",
    verdict: "right",
    answer:
      "そのとおり。サイトにあるのは<公開鍵>だけで、公開鍵ではしるしを作れない。ただし、名前やメールアドレスなど、ほかの情報がもれることは別の話。",
  },
  {
    claim: "スマホをなくしたら、もうログインできない",
    verdict: "partly",
    answer:
      "しまい場所しだい。iCloud キーチェーンや Google パスワードマネージャーなら、<ほかの端末や新しい端末にもどせる>。セキュリティキーだけに入れていたら、そのパスキーは使えなくなる。予備を登録しておこう。",
  },
  {
    claim: "パスキーにすれば、どんな攻撃でもぜったい安全",
    verdict: "wrong",
    answer:
      "そこまでは言えない。にせサイトやパスワードもれには強いけれど、<端末のロックを他人に知られる>、<Apple や Google のアカウントを乗っ取られる>、パスワードやSMSでのログインが<別の入口として残っている>、といった弱点は別にある。",
  },
  {
    claim: "パスキーを使うと、サイトどうしで行動を追跡される",
    verdict: "wrong",
    answer:
      "サイトごとに<別の鍵のペア>を作るので、パスキーから「同じ人だ」とはわからない。ほかのサイトのパスキーを、そのサイトが見ることもできない。",
  },
  {
    claim: "パスキーのPINは、サイトに送られている",
    verdict: "wrong",
    answer:
      "送られない。端末やセキュリティキーのPINは、指紋と同じく<その場で端末を開けるため>のもの。サイトが知るのは、確認がすんだかどうかだけ。",
  },
];

const verdictLabel: Record<
  Verdict,
  { text: string; icon: "x" | "check" | "alert" }
> = {
  wrong: { text: "誤解", icon: "x" },
  right: { text: "本当", icon: "check" },
  partly: { text: "場合による", icon: "alert" },
};

export const MythCards = clientEntry(
  import.meta.url,
  function MythCards(handle: Handle) {
    const open = myths.map(() => false);
    const flip = (i: number) => {
      open[i] = !open[i];
      handle.update();
    };

    return () => (
      <div>
        <p mix={hintStyle}>
          カードをおすと、本当かどうかが出ます。
        </p>
        <ul mix={listStyle}>
          {myths.map((m, i) => {
            const v = verdictLabel[m.verdict];
            return (
              <li key={m.claim}>
                <button
                  type="button"
                  aria-expanded={open[i] ? "true" : "false"}
                  mix={[cardStyle, on("click", () => flip(i))]}
                >
                  <span mix={claimStyle}>
                    <Icon name="question" />「{m.claim}」
                  </span>
                  {open[i]
                    ? (
                      <span mix={[badgeStyle, badgeTones[m.verdict]]}>
                        <Icon name={v.icon} /> {v.text}
                      </span>
                    )
                    : <span mix={tapStyle}>本当？</span>}
                </button>
                {open[i]
                  ? (
                    <p mix={[captionStyle, answerStyle]}>
                      {emphasize(m.answer)}
                    </p>
                  )
                  : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

const hintStyle = css({ margin: "0 0 0.75rem", color: color.muted });

const listStyle = css({
  display: "grid",
  gap: "0.5rem",
  margin: 0,
  padding: 0,
  listStyle: "none",
  "& li": { margin: 0 },
});

const cardStyle = css({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  width: "100%",
  padding: "0.8rem 1rem",
  border: `2px solid ${color.line}`,
  borderRadius: radius.md,
  background: color.surface,
  color: color.fg,
  textAlign: "left",
  fontFamily: font.round,
  fontWeight: 800,
  fontSize: "1rem",
  lineHeight: 1.6,
  "&:hover": { borderColor: color.accent },
});

const claimStyle = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "0.4rem",
  "& svg": { marginTop: "0.3em", color: color.accent },
});

const tapStyle = css({
  flex: "none",
  color: color.accent,
  fontSize: "0.85rem",
});

const badgeStyle = css({
  flex: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.3rem",
  padding: "0.2rem 0.6rem",
  borderRadius: "999px",
  fontSize: "0.85rem",
  animation: "pop-in 300ms ease-out",
});

const badgeTones: Record<Verdict, ReturnType<typeof css>> = {
  wrong: css({ background: art.softRed, color: art.ng }),
  right: css({ background: art.softGreen, color: art.ok }),
  partly: css({ background: art.goldSoft, color: art.gold }),
};

const answerStyle = css({ minHeight: 0, margin: "0.4rem 0 0" });
