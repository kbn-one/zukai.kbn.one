/**
 * 図解AI chapter 1: one message, followed through the three parts.
 *
 * The person talks to the harness. The harness puts together everything the model should see —
 * the standing instructions, the conversation so far, the memory, the new question — and hands it
 * to the inference engine, which runs it through the model to pick the next word, again and again,
 * until there is an answer. The harness hands that back. The model is read and never written.
 */

import { clientEntry, css, type Handle } from "@remix-run/component";

import { Chip, Flow, Party } from "../../ui/ai_art.tsx";
import { captionStyle, emphasize, StepBar } from "../../ui/controls.tsx";

type Focus = "user" | "harness" | "memory" | "engine" | "model" | null;

interface Step {
  caption: string;
  focus: Focus[];
  /** Which arrow is moving: to the harness, to the engine, or back. */
  flow: "in" | "engine" | "back" | null;
  /** What the harness has laid out for the model. */
  script: number;
  /** How many words of the answer exist. */
  words: number;
  answered: boolean;
}

const QUESTION = "週末、どこに行こう？";
const SCRIPT = [
  { tone: "rule", text: "決まりごと：ていねいに答える" },
  { tone: "memory", text: "メモリ：ねこを飼っている" },
  { tone: "plain", text: "これまでの会話" },
  { tone: "plain", text: `今回：${QUESTION}` },
] as const;
const ANSWER = [
  "ねこと",
  "いっしょに",
  "家で",
  "のんびり",
  "も",
  "いいですね。",
];

const steps: Step[] = [
  {
    caption:
      "チャットAIを使うとき、あなたが直接やりとりしているのは、<あなた専用のハーネス>。その奥に<推論エンジン>があって、エンジンの中で<モデル>が使われる。",
    focus: [],
    flow: null,
    script: 0,
    words: 0,
    answered: false,
  },
  {
    caption: `あなたが「${QUESTION}」と送る。受け取るのは<ハーネス>。`,
    focus: ["user", "harness"],
    flow: "in",
    script: 0,
    words: 0,
    answered: false,
  },
  {
    caption:
      "ハーネスは、モデルに見せる<台本>を組み立てる。決まりごと、<メモリ>にあるあなたのこと、これまでの会話、そして今回の質問。",
    focus: ["harness", "memory"],
    flow: null,
    script: SCRIPT.length,
    words: 0,
    answered: false,
  },
  {
    caption:
      "台本を<推論エンジン>にわたす。エンジンは台本をモデルに通して計算し、<つぎに来そうな言葉>を1つ選ぶ。",
    focus: ["engine", "model"],
    flow: "engine",
    script: SCRIPT.length,
    words: 1,
    answered: false,
  },
  {
    caption:
      "選んだ言葉を台本の後ろに足して、また計算。これを<何十回、何百回>とくりかえすと、文章になる。",
    focus: ["engine", "model"],
    flow: null,
    script: SCRIPT.length,
    words: ANSWER.length,
    answered: false,
  },
  {
    caption:
      "できた答えをハーネスが受け取って、あなたに返す。会話はハーネスが保存する。<モデルの中身は、何も変わっていない>。",
    focus: ["user", "harness"],
    flow: "back",
    script: SCRIPT.length,
    words: ANSWER.length,
    answered: true,
  },
];

export const PartsFlow = clientEntry(
  import.meta.url,
  function PartsFlow(handle: Handle) {
    let step = 0;
    const go = (next: number) => {
      step = Math.max(0, Math.min(steps.length - 1, next));
      handle.update();
    };

    return () => {
      const s = steps[step];
      const on = (f: Focus) => s.focus.length === 0 || s.focus.includes(f);
      const hot = (f: Focus) => s.focus.includes(f);

      return (
        <div>
          <div mix={rowStyle}>
            <Party role="user" active={hot("user")} dim={!on("user")}>
              <Chip>{QUESTION}</Chip>
              {s.answered
                ? <Chip tone="answer" fresh>{ANSWER.join("")}</Chip>
                : null}
            </Party>
            <Flow
              active={s.flow === "in" || s.flow === "back"}
              back={s.flow === "back"}
            />
            <Party
              role="harness"
              name="あなたのハーネス"
              active={hot("harness")}
              dim={!on("harness")}
            >
              <Party
                role="memory"
                note="あなた専用"
                active={hot("memory")}
                dim={!on("memory")}
              >
                <Chip tone="memory">ねこを飼っている</Chip>
              </Party>
              {SCRIPT.slice(0, s.script).map((line) => (
                <Chip key={line.text} tone={line.tone} fresh>{line.text}</Chip>
              ))}
            </Party>
            <Flow active={s.flow === "engine"} label="台本" />
            <Party role="engine" active={hot("engine")} dim={!on("engine")}>
              <Party
                role="model"
                note="読むだけ"
                active={hot("model")}
                dim={!on("model")}
              />
              {s.words > 0
                ? (
                  <span mix={wordsStyle}>
                    {ANSWER.slice(0, s.words).map((w, i) => (
                      <Chip key={i} tone="answer" fresh>{w}</Chip>
                    ))}
                  </span>
                )
                : null}
            </Party>
          </div>
          <p mix={captionStyle} key={step}>{emphasize(s.caption)}</p>
          <StepBar step={step} total={steps.length} onGo={go} />
        </div>
      );
    };
  },
);

const rowStyle = css({
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) auto minmax(0, 1.3fr) auto minmax(0, 1.3fr)",
  alignItems: "stretch",
  gap: "0.5rem",
  "@media (max-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

const wordsStyle = css({ display: "flex", flexWrap: "wrap", gap: "0.3rem" });
