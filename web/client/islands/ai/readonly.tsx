/**
 * 図解AI chapter 5: the model is only ever read.
 *
 * A tells the AI something private; B then asks about A. While A talks, the model's numbers light
 * up — they are being read — but none of them changes, and the fingerprint stays put. What A said
 * went into A's memory, in the harness. B's turn reads the same unchanged model with B's memory,
 * so there is nothing of A's for it to find. The last button shows the world this is not: a model
 * that was written to as people talked would carry A's words to B.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import {
  Chip,
  Fingerprint,
  MODEL_FINGERPRINT,
  Party,
} from "../../ui/ai_art.tsx";
import {
  buttonStyle,
  captionStyle,
  dangerStyle,
  emphasize,
  primaryStyle,
} from "../../ui/controls.tsx";
import { Icon } from "../../ui/icons.tsx";
import { art, font } from "../../tokens.ts";

type Phase = "start" | "a" | "b" | "whatif";

const A_SAYS = "ひみつだけど、来月ひっこすんだ";
const B_ASKS = "Aさんって、何か言ってた？";
const B_ANSWER = "ほかの人との会話は、わたしには見えません。";
const B_LEAK = "Aさんは、来月ひっこすそうですよ。";

/** The model's numbers, as far as the picture shows them. Fixed, so server and browser agree. */
const WEIGHTS = Array.from(
  { length: 24 },
  (_, i) => ((i * 37 + 11) % 97 / 100 - 0.48).toFixed(2).replace("0.", "."),
);
/** The cells the "もしも" world overwrites. */
const WRITTEN = new Set([3, 8, 14, 19]);

const captions: Record<Phase, string> = {
  start:
    "モデルの中身は、たくさんの<数字>（ここでは24こだけ。本物は数百億こ以上）。この数字が、モデルの「知識」や「言葉のくせ」になっている。",
  a: `Aさんが「${A_SAYS}」と話した。モデルの数字は<読まれた>けど、<1つも変わっていない>。指紋も同じ。Aさんの話は、ハーネスの<Aさんのメモリ>に入った。`,
  b: `Bさんが「${B_ASKS}」と聞いた。モデルは同じ数字のまま、Bさんのメモリだけを見て答える。Aさんの話は<どこにも入っていない>から、もれようがない。`,
  whatif:
    `<もしも>話すたびにモデルの数字が書きかわるとしたら……Aさんの話がモデルにしみこんで、Bさんに<もれてしまう>。チャットAIを使っているあいだ、<こうはならない>。`,
};

export const Readonly = clientEntry(
  import.meta.url,
  function Readonly(handle: Handle) {
    let phase: Phase = "start";
    /** Whether the numbers are lit up as being read. */
    let reading = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    handle.signal.addEventListener("abort", () => clearTimeout(timer));

    const go = (next: Phase) => {
      phase = next;
      reading = next === "a" || next === "b";
      clearTimeout(timer);
      if (reading) {
        timer = setTimeout(() => {
          reading = false;
          handle.update();
        }, 1400);
      }
      handle.update();
    };

    return () => {
      const whatif = phase === "whatif";
      const aSpoke = phase !== "start";
      const bAsked = phase === "b" || whatif;

      return (
        <div>
          <div mix={layoutStyle}>
            <div mix={sideStyle}>
              <Party role="user" name="Aさん" active={phase === "a"}>
                {aSpoke ? <Chip>{A_SAYS}</Chip> : null}
              </Party>
              <Party role="user" name="Bさん" active={phase === "b"}>
                {bAsked ? <Chip>{B_ASKS}</Chip> : null}
                {bAsked
                  ? (
                    <Chip tone="answer" fresh key={phase}>
                      {whatif ? B_LEAK : B_ANSWER}
                    </Chip>
                  )
                  : null}
              </Party>
            </div>

            <Party role="harness">
              <Party role="memory" name="Aさん" note="のメモリ">
                {aSpoke ? <Chip tone="memory">{A_SAYS}</Chip> : null}
              </Party>
              <Party role="memory" name="Bさん" note="のメモリ">
                {bAsked ? <Chip tone="memory">{B_ASKS}</Chip> : null}
              </Party>
            </Party>

            <Party
              role="model"
              note={whatif ? "もしも書きこまれたら" : "読むだけ"}
              active={reading}
            >
              <div mix={gridStyle} aria-label="モデルの数字">
                {WEIGHTS.map((w, i) => {
                  const written = whatif && WRITTEN.has(i);
                  return (
                    <span
                      key={i}
                      mix={[
                        cellStyle,
                        reading ? readingStyle : null,
                        written ? writtenStyle : null,
                      ]}
                      style={reading
                        ? { animationDelay: `${(i % 6) * 60}ms` }
                        : undefined}
                    >
                      {written ? "A" : w}
                    </span>
                  );
                })}
              </div>
              <p mix={statusStyle}>
                指紋{" "}
                <Fingerprint
                  value={whatif ? "b20d…4e7a" : MODEL_FINGERPRINT}
                  changed={whatif}
                />
                <span>
                  変わった数字：<strong>{whatif ? WRITTEN.size : 0}こ</strong>
                </span>
              </p>
            </Party>
          </div>

          <p mix={[captionStyle, whatif ? warnStyle : null]} key={phase}>
            {emphasize(captions[phase])}
          </p>

          <div mix={buttonsStyle}>
            <button
              type="button"
              mix={[
                buttonStyle,
                phase === "start" ? primaryStyle : null,
                on("click", () => go("a")),
              ]}
            >
              <Icon name="message" /> Aさんが話す
            </button>
            <button
              type="button"
              mix={[
                buttonStyle,
                phase === "a" ? primaryStyle : null,
                on("click", () => go("b")),
              ]}
              disabled={!aSpoke}
            >
              <Icon name="message" /> Bさんが聞く
            </button>
            <button
              type="button"
              mix={[buttonStyle, dangerStyle, on("click", () => go("whatif"))]}
              disabled={phase !== "b"}
            >
              <Icon name="alert" /> もしもモデルに書きこまれたら？
            </button>
            <button
              type="button"
              mix={[buttonStyle, on("click", () => go("start"))]}
              disabled={phase === "start"}
            >
              <Icon name="restart" /> さいしょから
            </button>
          </div>
        </div>
      );
    };
  },
);

const layoutStyle = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.3fr)",
  gap: "0.75rem",
  "@media (max-width: 720px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

const sideStyle = css({
  display: "grid",
  gap: "0.5rem",
  alignContent: "start",
});

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gap: "0.2rem",
  width: "100%",
});

const cellStyle = css({
  display: "grid",
  placeItems: "center",
  padding: "0.2rem 0",
  borderRadius: "0.3rem",
  background: art.goldSoft,
  fontFamily: font.mono,
  fontSize: "0.7rem",
  fontFeatureSettings: "normal",
});

const readingStyle = css({ animation: "use-glow 700ms ease-in-out 2" });

const writtenStyle = css({
  background: art.softRed,
  color: art.ng,
  fontWeight: 700,
  animation: "shake 400ms ease-in-out",
});

const statusStyle = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.4rem 1rem",
  margin: "0.5rem 0 0",
  fontSize: "0.85rem",
  width: "100%",
});

const warnStyle = css({
  background: art.softRed,
  "& strong": { color: art.ng },
});

const buttonsStyle = css({ display: "flex", flexWrap: "wrap", gap: "0.5rem" });
