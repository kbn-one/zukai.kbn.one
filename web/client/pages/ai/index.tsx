/**
 * 図解AI's own top page: the whole picture at once, then the chapters that take it apart.
 *
 * The overview is drawn on the server and does not move; each chapter's picture does.
 */

import { css, type Handle } from "@remix-run/component";

import {
  Chip,
  Fingerprint,
  Flow,
  MODEL_FINGERPRINT,
  Party,
} from "../../ui/ai_art.tsx";
import { ChapterList, Summary } from "../../parts.tsx";
import { seriesOf } from "../../series.ts";
import { color, font } from "../../tokens.ts";

const ai = seriesOf("ai");

export const title = "図解AI — モデル・推論エンジン・ハーネスのしくみ";
export const description = ai.lead;

/** The overview is still; the runtime is only needed on the chapters. */
export const hydrate = false;

const people = [
  { who: "Aさん", memo: "お肉を食べない" },
  { who: "Bさん", memo: "子どもが2人" },
  { who: "Cさん", memo: "料理は苦手" },
];

export default function AiIndex(_handle: Handle) {
  return () => (
    <>
      <header mix={heroStyle}>
        <p mix={eyebrowStyle}>図解AI</p>
        <h1>チャットAIの中は、どうなっている？</h1>
        <p>{ai.lead}</p>
      </header>

      <section aria-label="全体図" mix={overviewStyle}>
        {people.map((p, i) => (
          <div key={p.who} mix={laneStyle} style={{ gridRow: i + 1 }}>
            <Party role="user" name={p.who} />
            <Flow />
            <Party role="harness" name={`${p.who}のハーネス`}>
              <Party role="memory" note={`${p.who}の分だけ`}>
                <Chip tone="memory">{p.memo}</Chip>
              </Party>
            </Party>
            <Flow label="台本" />
          </div>
        ))}
        <div mix={engineCellStyle}>
          <Party role="engine" note="みんなで共有。モデルを読んで計算する">
            {[1, 2, 3].map((n) => (
              <Party key={n} role="model" name={`モデル（コピー${n}）`}>
                <Fingerprint value={MODEL_FINGERPRINT} />
                <Chip>読むだけ</Chip>
              </Party>
            ))}
          </Party>
        </div>
      </section>

      <Summary>
        <ul mix={pointsStyle}>
          <li>
            モデルは<strong>大量にコピー</strong>されていて、どれも中身は同じ。
          </li>
          <li>
            1つのモデルが、<strong>何人もの相手を同時に</strong>している。
          </li>
          <li>
            1人に1つ、<strong>
              その人専用のハーネス
            </strong>があって、メモリはそこにくっついている。
          </li>
          <li>
            モデルには<strong>
              書きこまれない
            </strong>から、だれかの話がほかの人にまざることはない。
          </li>
          <li>
            ローカルLLMなら、この全部が<strong>
              自分のパソコンの中
            </strong>だけで動く。
          </li>
        </ul>
      </Summary>

      <h2>もくじ</h2>
      <ChapterList series={ai} />
    </>
  );
}

const heroStyle = css({
  marginBottom: "2rem",
  "& > p:last-child": { fontSize: "1.15rem" },
});

const eyebrowStyle = css({
  margin: "0 0 0.5rem",
  fontFamily: font.round,
  fontWeight: 800,
  color: color.accent,
});

const overviewStyle = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 2.6fr) minmax(0, 1.2fr)",
  gap: "0.75rem",
  "@media (max-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

/** One person's row: the person, their own harness, and the arrow to the shared engine. */
const laneStyle = css({
  gridColumn: 1,
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.7fr) auto minmax(0, 1.3fr) auto",
  alignItems: "center",
  gap: "0.5rem",
  "@media (max-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

/** The engine spans every person's row: they all reach the same one. */
const engineCellStyle = css({
  gridColumn: 2,
  gridRow: "1 / span 3",
  "@media (max-width: 640px)": { gridColumn: 1, gridRow: "auto" },
});

const pointsStyle = css({
  margin: 0,
  paddingLeft: "1.2rem",
  "& li": { marginBlock: "0.2rem" },
});
