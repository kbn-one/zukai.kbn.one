/**
 * 図解AI chapter 4: memory belongs to the harness, and each person has a harness of their own.
 *
 * Three people ask the same model the same question and get different answers, because the
 * person's own harness puts their memory into what the model reads. Adding to the memory changes
 * the next answer; the model's fingerprint stays where it was.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import {
  Chip,
  Fingerprint,
  Flow,
  MODEL_FINGERPRINT,
  Party,
} from "../../ui/ai_art.tsx";
import {
  buttonStyle,
  captionStyle,
  emphasize,
  primaryStyle,
} from "../../ui/controls.tsx";
import { Icon } from "../../ui/icons.tsx";

const QUESTION = "今夜のごはん、何がいい？";

interface Person {
  who: string;
  memory: string[];
  /** The line "覚えてもらう" adds. */
  extra: string;
  answer: string;
  /** The answer once the extra line is in memory. */
  answerWithExtra: string;
}

const people: Person[] = [
  {
    who: "Aさん",
    memory: ["お肉を食べない"],
    extra: "からいものが好き",
    answer: "とうふと野菜のいためものはどうですか？",
    answerWithExtra: "お肉なしのマーボーどうふはどうですか？",
  },
  {
    who: "Bさん",
    memory: ["子どもが2人いる"],
    extra: "魚が苦手な子がいる",
    answer: "みんなで楽しめる手巻きずしは？",
    answerWithExtra: "具を自分で選べるタコスは？",
  },
  {
    who: "Cさん",
    memory: ["ひとりぐらし", "料理は苦手"],
    extra: "明日は早起き",
    answer: "電子レンジで作れる親子どんは？",
    answerWithExtra: "すぐ食べられる、具だくさんのスープは？",
  },
];

export const Memory = clientEntry(
  import.meta.url,
  function Memory(handle: Handle) {
    let current = 0;
    /** Which people have had their extra line remembered. */
    const added = people.map(() => false);
    let justAdded = false;

    const pick = (i: number) => {
      current = i;
      justAdded = false;
      handle.update();
    };
    const remember = () => {
      added[current] = true;
      justAdded = true;
      handle.update();
    };

    return () => {
      const p = people[current];
      const memory = added[current] ? [...p.memory, p.extra] : p.memory;
      const answer = added[current] ? p.answerWithExtra : p.answer;

      return (
        <div>
          <div mix={chooserStyle} role="group" aria-label="話しかける人">
            {people.map((x, i) => (
              <button
                key={x.who}
                type="button"
                aria-pressed={i === current ? "true" : "false"}
                mix={[
                  buttonStyle,
                  i === current ? primaryStyle : null,
                  on("click", () => pick(i)),
                ]}
              >
                <Icon name="user" /> {x.who}
              </button>
            ))}
          </div>

          <div mix={rowStyle}>
            <Party role="user" name={p.who}>
              <Chip>{QUESTION}</Chip>
              <Chip tone="answer" fresh key={`${current}-${answer}`}>
                {answer}
              </Chip>
            </Party>
            <Flow />
            <div mix={harnessesStyle}>
              {people.map((x, i) => (
                <Party
                  key={x.who}
                  role="harness"
                  name={`${x.who}のハーネス`}
                  active={i === current}
                  dim={i !== current}
                >
                  <Party role="memory">
                    {(added[i] ? [...x.memory, x.extra] : x.memory).map((m) => (
                      <Chip key={m} tone="memory" fresh={i === current}>
                        {m}
                      </Chip>
                    ))}
                  </Party>
                </Party>
              ))}
            </div>
            <Flow label="台本" />
            <Party role="engine">
              <Party role="model" note="3人とも同じ">
                <Fingerprint value={MODEL_FINGERPRINT} />
              </Party>
              <span mix={scriptStyle}>
                {memory.map((m) => <Chip key={m} tone="memory">{m}</Chip>)}
                <Chip>{QUESTION}</Chip>
              </span>
            </Party>
          </div>

          <p mix={captionStyle} key={`${current}-${justAdded}`}>
            {emphasize(
              justAdded
                ? `「${p.extra}」を<${p.who}のメモリ>に足した。つぎの答えが変わったね。でも、モデルの指紋は<${MODEL_FINGERPRINT}>のまま。覚えたのは${p.who}のハーネスで、モデルじゃない。`
                : `同じモデルに同じ質問をしても、答えはちがう。<${p.who}のハーネス>が、${p.who}のメモリを台本に入れてモデルに見せているから。ほかの人のハーネスとメモリは、まったく別のもの。`,
            )}
          </p>
          <button
            type="button"
            mix={[buttonStyle, on("click", remember)]}
            disabled={added[current]}
          >
            <Icon name="database" /> 「{p.extra}」と覚えてもらう
          </button>
        </div>
      );
    };
  },
);

const chooserStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "1rem",
});

const rowStyle = css({
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) auto minmax(0, 1.4fr) auto minmax(0, 1.2fr)",
  gap: "0.5rem",
  "@media (max-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

/** The three harnesses, one per person, stacked. */
const harnessesStyle = css({ display: "grid", gap: "0.4rem" });

const scriptStyle = css({ display: "flex", flexWrap: "wrap", gap: "0.3rem" });
