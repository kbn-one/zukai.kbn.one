/**
 * 図解AI chapter 2: the model, copied.
 *
 * More people means more copies of the same file on more machines, not a bigger or different
 * model. Every copy has the same fingerprint, because every copy is the same numbers.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import { Fingerprint, MODEL_FINGERPRINT } from "../../ui/ai_art.tsx";
import {
  buttonStyle,
  captionStyle,
  emphasize,
  primaryStyle,
} from "../../ui/controls.tsx";
import { Icon } from "../../ui/icons.tsx";
import { art, color, font, radius } from "../../tokens.ts";

interface Scale {
  label: string;
  /** Copies drawn. The real numbers are far larger; the picture only has to show the shape. */
  copies: number;
  caption: string;
}

const scales: Scale[] = [
  {
    label: "100人",
    copies: 1,
    caption: "使う人が少なければ、モデルのコピーは<1つ>でも足りる。",
  },
  {
    label: "1万人",
    copies: 6,
    caption:
      "人がふえたら、<同じファイル>を別のコンピューターにも読みこませて、コピーをふやす。",
  },
  {
    label: "100万人",
    copies: 24,
    caption:
      "もっとふえたら、世界中のデータセンターにコピーを並べる。<どれに当たっても、中身は同じ>。",
  },
];

export const Copies = clientEntry(
  import.meta.url,
  function Copies(handle: Handle) {
    let scale = 0;
    let compared = false;

    const pick = (i: number) => {
      scale = i;
      compared = false;
      handle.update();
    };
    const compare = () => {
      compared = !compared;
      handle.update();
    };

    return () => {
      const s = scales[scale];
      return (
        <div>
          <div mix={chooserStyle} role="group" aria-label="使う人の数">
            {scales.map((x, i) => (
              <button
                key={x.label}
                type="button"
                aria-pressed={i === scale ? "true" : "false"}
                mix={[
                  buttonStyle,
                  i === scale ? primaryStyle : null,
                  on("click", () => pick(i)),
                ]}
              >
                <Icon name="users" /> {x.label}
              </button>
            ))}
          </div>

          <div mix={gridStyle} aria-label={`モデルのコピー ${s.copies}こ`}>
            {Array.from({ length: s.copies }, (_, i) => (
              <div
                key={`${scale}-${i}`}
                mix={[tileStyle, compared ? sameStyle : null]}
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              >
                <Icon name="layers" size="1.5rem" />
                <span mix={tileNameStyle}>モデル</span>
                <Fingerprint value={MODEL_FINGERPRINT} />
                {compared ? <Icon name="check" label="同じ" /> : null}
              </div>
            ))}
          </div>

          <p mix={captionStyle} key={`${scale}-${compared}`}>
            {emphasize(
              compared
                ? `${s.copies}この指紋は、<ぜんぶ同じ>。中の数字が1つでもちがえば、指紋も変わる。だからどのコピーも、まったく同じモデル。`
                : s.caption,
            )}
          </p>
          <button
            type="button"
            mix={[buttonStyle, on("click", compare)]}
            aria-pressed={compared ? "true" : "false"}
          >
            <Icon name="search" />{" "}
            {compared ? "比べるのをやめる" : "指紋を比べる"}
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

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(7rem, 1fr))",
  gap: "0.5rem",
  minHeight: "6.5rem",
});

const tileStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.25rem",
  padding: "0.6rem 0.4rem",
  border: `2px solid ${art.gold}`,
  borderRadius: radius.md,
  background: color.surface,
  color: art.gold,
  animation: "pop-in 300ms ease-out both",
  "& code": { color: color.fg },
});

const sameStyle = css({
  borderColor: art.ok,
  background: art.softGreen,
  "& > svg:last-child": { color: art.ok },
});

const tileNameStyle = css({
  fontFamily: font.round,
  fontWeight: 800,
  fontSize: "0.85rem",
  color: color.fg,
});
