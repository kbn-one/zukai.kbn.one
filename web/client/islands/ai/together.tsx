/**
 * 図解AI chapter 3: one model, several people, at the same moment.
 *
 * The engine lines the three conversations up side by side (a batch) and runs the model once for
 * all of them: each pass gives every row its next word. Taken one person at a time, the same
 * answers would take as many passes as all three answers have words; together, only as many as the
 * longest one. Each row stays its own — an answer goes back to the person whose row it is.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import { Chip, Party } from "../../ui/ai_art.tsx";
import {
  buttonStyle,
  captionStyle,
  emphasize,
  primaryStyle,
} from "../../ui/controls.tsx";
import { Icon } from "../../ui/icons.tsx";
import { art, color, font, radius } from "../../tokens.ts";

interface Talk {
  who: string;
  question: string;
  answer: string[];
}

const talks: Talk[] = [
  {
    who: "Aさん",
    question: "カレーのかくし味は？",
    answer: ["はちみつや", "チョコを", "少し", "入れます。"],
  },
  {
    who: "Bさん",
    question: "雨の日の遊びは？",
    answer: ["室内で", "ボードゲーム", "はどう？"],
  },
  {
    who: "Cさん",
    question: "朝早く起きるコツは？",
    answer: ["朝の光を", "あびると", "体が", "目をさまします。", "ぜひ。"],
  },
];

const PASS_MS = 900;
const longest = Math.max(...talks.map((t) => t.answer.length));
const oneByOne = talks.reduce((n, t) => n + t.answer.length, 0);

type Phase = "idle" | "running" | "done";

export const Together = clientEntry(
  import.meta.url,
  function Together(handle: Handle) {
    let phase: Phase = "idle";
    let passes = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
    };
    handle.signal.addEventListener("abort", stop);

    const start = () => {
      stop();
      phase = "running";
      passes = 0;
      handle.update();
      timer = setInterval(() => {
        passes += 1;
        if (passes >= longest) {
          phase = "done";
          stop();
        }
        handle.update();
      }, PASS_MS);
    };

    const reset = () => {
      stop();
      phase = "idle";
      passes = 0;
      handle.update();
    };

    return () => {
      const caption = phase === "idle"
        ? "3人が、同じタイミングで、ちがう質問を送ったとしよう。モデルは1つしかない。"
        : phase === "running"
        ? `推論エンジンは3人分を<1つのたばにして>、モデルに通す。1回の計算で、<3人それぞれの>つぎの言葉が出る。（${passes}回目）`
        : `<${passes}回>の計算で、3人とも答えが出た。1人ずつ順番なら${oneByOne}回かかるところ。答えはそれぞれ、<質問した本人にだけ>返る。`;

      return (
        <div>
          <div mix={layoutStyle}>
            <div mix={usersStyle}>
              {talks.map((t) => (
                <Party key={t.who} role="user" name={t.who}>
                  <Chip>{t.question}</Chip>
                  {phase === "done"
                    ? <Chip tone="answer" fresh>{t.answer.join("")}</Chip>
                    : null}
                </Party>
              ))}
            </div>
            <Party
              role="engine"
              active={phase === "running"}
              note="1つのモデルで、まとめて計算"
            >
              <Party role="model" note="1つだけ" />
              <ol mix={batchStyle} aria-label="たば（バッチ）">
                {talks.map((t) => (
                  <li key={t.who} mix={rowStyle}>
                    <span mix={rowWhoStyle}>{t.who}</span>
                    <span mix={wordsStyle}>
                      {phase === "idle"
                        ? <span mix={waitStyle}>…</span>
                        : t.answer.slice(0, passes).map((w, i) => (
                          <Chip key={i} tone="answer" fresh>{w}</Chip>
                        ))}
                      {phase !== "idle" && passes >= t.answer.length
                        ? <Icon name="check" label="できた" />
                        : null}
                    </span>
                  </li>
                ))}
              </ol>
            </Party>
          </div>
          <p mix={captionStyle} key={`${phase}-${passes}`}>
            {emphasize(caption)}
          </p>
          {phase === "idle"
            ? (
              <button
                type="button"
                mix={[buttonStyle, primaryStyle, on("click", start)]}
              >
                <Icon name="play" /> 3人が同時に送る
              </button>
            )
            : (
              <button
                type="button"
                mix={[buttonStyle, on("click", reset)]}
                disabled={phase === "running"}
              >
                <Icon name="restart" /> さいしょから
              </button>
            )}
        </div>
      );
    };
  },
);

const layoutStyle = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.6fr)",
  gap: "0.75rem",
  "@media (max-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

const usersStyle = css({ display: "grid", gap: "0.5rem" });

const batchStyle = css({
  width: "100%",
  display: "grid",
  gap: "0.4rem",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

const rowStyle = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "0.5rem",
  margin: 0,
  padding: "0.4rem 0.5rem",
  borderRadius: radius.sm,
  background: color.surface,
  fontSize: "0.9rem",
});

const rowWhoStyle = css({
  flex: "none",
  fontFamily: font.round,
  fontWeight: 800,
  lineHeight: 2,
});

const wordsStyle = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.25rem",
  "& > svg": { color: art.ok },
});

const waitStyle = css({ color: color.muted, lineHeight: 2 });
