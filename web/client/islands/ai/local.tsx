/**
 * 図解AI chapter 6: where the three parts live.
 *
 * The same three parts, placed three ways: everything in the data center (a chat service in the
 * browser), the harness on your computer and the model in the data center (an agent like Claude
 * Code calling an API), and everything on your computer (a local LLM). What changes is where your
 * memory sits and what has to cross the internet; what does not change is that the model is only
 * read.
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
  emphasize,
  primaryStyle,
} from "../../ui/controls.tsx";
import { Icon, type IconName } from "../../ui/icons.tsx";
import { art, color, font, radius } from "../../tokens.ts";

type Place = "pc" | "cloud";

interface Mode {
  label: string;
  icon: IconName;
  harness: Place;
  engine: Place;
  /** What crosses the internet, or `null` for nothing. */
  wire: string | null;
  caption: string;
  facts: [string, string][];
}

const modes: Mode[] = [
  {
    label: "クラウドのチャットAI",
    icon: "globe",
    harness: "cloud",
    engine: "cloud",
    wire: "質問と答え",
    caption:
      "ブラウザやアプリで使うチャットAI。手元にあるのは画面だけで、<ハーネスもメモリもモデルもデータセンター>にある。あなたの質問は、インターネットを通ってあなたのハーネスにとどく。",
    facts: [
      ["メモリの置き場所", "サービスのサーバー"],
      ["ネットに出るもの", "質問と答え（メモリはサーバー側にある）"],
      ["モデル", "大きくて高性能。みんなで共有"],
    ],
  },
  {
    label: "ハーネスだけ手元",
    icon: "harness",
    harness: "pc",
    engine: "cloud",
    wire: "台本（メモリ・会話・読んだファイルもふくむ）",
    caption:
      "Claude Codeのようなエージェントは、<ハーネスがあなたのパソコンで>動き、メモリもパソコンに置く。でもモデルはデータセンター。だから毎回、<台本がまるごと>インターネットを通る。",
    facts: [
      ["メモリの置き場所", "あなたのパソコン"],
      ["ネットに出るもの", "台本（メモリや読んだファイルの中身も入る）"],
      ["モデル", "大きくて高性能。みんなで共有"],
    ],
  },
  {
    label: "ローカルLLM",
    icon: "monitor",
    harness: "pc",
    engine: "pc",
    wire: null,
    caption:
      "モデルのファイルをダウンロードして、<推論エンジンもパソコンで>動かす。3つの部品がぜんぶ手元にあるので、<何もインターネットに出ていかない>。モデルを使うのはあなた1人。",
    facts: [
      ["メモリの置き場所", "あなたのパソコン"],
      ["ネットに出るもの", "なし（モデルをダウンロードするときだけ）"],
      ["モデル", "パソコンに入る大きさまで。小さめで、速さはパソコンしだい"],
    ],
  },
];

export const Local = clientEntry(
  import.meta.url,
  function Local(handle: Handle) {
    let current = 0;
    const pick = (i: number) => {
      current = i;
      handle.update();
    };

    return () => {
      const m = modes[current];

      const harness = (
        <Party role="harness" name="あなたのハーネス" key="harness">
          <Party role="memory">
            <Chip tone="memory">ねこを飼っている</Chip>
          </Party>
        </Party>
      );
      const engine = (
        <Party
          role="engine"
          key="engine"
          note={m.engine === "pc" ? "あなた専用" : "みんなで共有"}
        >
          <Party role="model" note="読むだけ">
            <Fingerprint value={MODEL_FINGERPRINT} />
          </Party>
        </Party>
      );

      return (
        <div>
          <div mix={chooserStyle} role="group" aria-label="使い方">
            {modes.map((x, i) => (
              <button
                key={x.label}
                type="button"
                aria-pressed={i === current ? "true" : "false"}
                mix={[
                  buttonStyle,
                  i === current ? primaryStyle : null,
                  on("click", () => pick(i)),
                ]}
              >
                <Icon name={x.icon} /> {x.label}
              </button>
            ))}
          </div>

          <div mix={mapStyle} key={current}>
            <section mix={[zoneStyle, pcStyle]} aria-label="あなたのパソコン">
              <p mix={zoneLabelStyle}>
                <Icon name="monitor" /> あなたのパソコン
              </p>
              <Party role="user" />
              {m.harness === "pc" ? harness : null}
              {m.engine === "pc" ? engine : null}
            </section>

            <div
              mix={[wireStyle, m.wire ? null : wireOffStyle]}
              aria-label="インターネット"
            >
              <Icon name={m.wire ? "wave" : "ban"} size="1.6rem" />
              <small>インターネット</small>
              {m.wire
                ? <Chip fresh>{m.wire}</Chip>
                : <strong>何も通らない</strong>}
            </div>

            <section
              mix={[
                zoneStyle,
                cloudStyle,
                m.engine === "pc" ? unusedStyle : null,
              ]}
              aria-label="データセンター"
            >
              <p mix={zoneLabelStyle}>
                <Icon name="server" /> データセンター
              </p>
              {m.harness === "cloud" ? harness : null}
              {m.engine === "cloud" ? engine : null}
              {m.engine === "cloud"
                ? (
                  <p mix={othersStyle}>
                    <Icon name="users" /> ほかの人のハーネスからも、台本がとどく
                  </p>
                )
                : <p mix={othersStyle}>使わない</p>}
            </section>
          </div>

          <p mix={captionStyle} key={`c${current}`}>{emphasize(m.caption)}</p>

          <dl mix={factsStyle}>
            {m.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
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

const mapStyle = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(7rem, 0.5fr) minmax(0, 1fr)",
  gap: "0.5rem",
  alignItems: "stretch",
  "@media (max-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

const zoneStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  padding: "0.75rem",
  borderRadius: radius.md,
  border: `2px solid ${color.line}`,
  animation: "pop-in 300ms ease-out",
});

const pcStyle = css({ background: color.surface });
const cloudStyle = css({ background: color.card });
const unusedStyle = css({ opacity: 0.4, borderStyle: "dashed" });

const zoneLabelStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  margin: 0,
  fontFamily: font.round,
  fontWeight: 800,
});

const wireStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.4rem",
  padding: "0.5rem",
  borderBlock: `3px dotted ${color.accent}`,
  color: color.accent,
  textAlign: "center",
  "& small": { color: color.muted },
  "@media (min-width: 641px)": {
    borderBlock: "none",
    borderInline: `3px dotted ${color.accent}`,
  },
});

const wireOffStyle = css({
  color: art.ok,
  borderColor: art.ok,
  "& strong": { fontFamily: font.round, fontWeight: 800 },
});

const othersStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  margin: 0,
  color: color.muted,
  fontSize: "0.85rem",
});

const factsStyle = css({
  display: "grid",
  gap: "0.4rem",
  margin: "0.75rem 0 0",
  "& > div": {
    display: "grid",
    gridTemplateColumns: "9rem minmax(0, 1fr)",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderRadius: radius.sm,
    background: color.card,
  },
  "& dt": { fontWeight: 700 },
  "& dd": { margin: 0 },
  "@media (max-width: 480px)": {
    "& > div": { gridTemplateColumns: "minmax(0, 1fr)", gap: 0 },
  },
});
