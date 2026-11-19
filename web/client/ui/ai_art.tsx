/**
 * The pictures 図解AI is drawn with: the five kinds of thing in it, each with its own color, and
 * the little speech chips that travel between them.
 *
 * Shared by the islands under `islands/ai/` and by the static overview on `/ai/`. Plain HTML boxes
 * rather than an SVG, so the picture reflows on a phone instead of shrinking.
 */

import { css, type Handle, type RemixNode } from "@remix-run/component";

import { art, color, font, radius } from "../tokens.ts";
import { Icon, type IconName } from "./icons.tsx";

/** The kinds of thing in a picture of an AI service. */
export type Role = "user" | "harness" | "memory" | "engine" | "model";

/** Each role's icon and the name it goes by. */
export const roleInfo: Record<Role, { icon: IconName; name: string }> = {
  user: { icon: "user", name: "あなた" },
  harness: { icon: "harness", name: "ハーネス" },
  memory: { icon: "database", name: "メモリ" },
  engine: { icon: "chip", name: "推論エンジン" },
  model: { icon: "layers", name: "モデル" },
};

/**
 * One thing in the picture: an icon, a name, and whatever sits inside it.
 *
 * `active` lifts it out of the picture for the step that is about it; `dim` pushes it back for a
 * step that is about something else.
 */
export function Party(
  handle: Handle<{
    role: Role;
    /** Overrides the role's name — "Aさん" rather than "あなた". */
    name?: string;
    /** A second line under the name. */
    note?: string;
    active?: boolean;
    dim?: boolean;
    children?: RemixNode;
  }>,
) {
  return () => {
    const { role, name, note, active, dim, children } = handle.props;
    const info = roleInfo[role];
    return (
      <div
        mix={[
          partyStyle,
          roleStyles[role],
          active ? activeStyle : null,
          dim ? dimStyle : null,
        ]}
      >
        <p mix={partyHeadStyle}>
          <span mix={partyIconStyle} aria-hidden="true">
            <Icon name={info.icon} size="1.15rem" />
          </span>
          <span>
            <strong>{name ?? info.name}</strong>
            {note ? <small>{note}</small> : null}
          </span>
        </p>
        {children ? <div mix={partyBodyStyle}>{children}</div> : null}
      </div>
    );
  };
}

/** A short piece of text in flight: a question, an answer, a line of memory. */
export function Chip(
  handle: Handle<{
    children: RemixNode;
    tone?: "plain" | "memory" | "answer" | "rule";
    /** Animate it in — for a chip that just arrived. */
    fresh?: boolean;
  }>,
) {
  return () => {
    const { children, tone = "plain", fresh } = handle.props;
    return (
      <span mix={[chipStyle, chipTones[tone], fresh ? freshStyle : null]}>
        {children}
      </span>
    );
  };
}

/** An arrow between two parties, pointing right on a wide screen and down on a phone. */
export function Flow(
  handle: Handle<{ label?: string; active?: boolean; back?: boolean }>,
) {
  return () => {
    const { label, active, back } = handle.props;
    return (
      <div mix={[flowStyle, active ? flowActiveStyle : null]}>
        <span mix={flowArrowStyle} aria-hidden="true">
          <Icon name={back ? "arrowLeft" : "arrowRight"} size="1.4rem" />
        </span>
        {label ? <small>{label}</small> : null}
      </div>
    );
  };
}

/** The model's fingerprint, the way a file's hash reads: the same text means the same contents. */
export function Fingerprint(
  handle: Handle<{ value: string; changed?: boolean }>,
) {
  return () => (
    <code
      mix={[fingerprintStyle, handle.props.changed ? changedStyle : null]}
      title="モデルのファイルの指紋（ハッシュ値）"
    >
      {handle.props.value}
    </code>
  );
}

/** The fingerprint every copy of the model in these pictures has. Made up. */
export const MODEL_FINGERPRINT = "7f3a…c91e";

// --- styles -----------------------------------------------------------------

const partyStyle = css({
  minWidth: 0,
  padding: "0.75rem 0.85rem",
  border: "2px solid transparent",
  borderRadius: radius.md,
  transition: "opacity 200ms, transform 200ms, box-shadow 200ms",
});

const roleStyles: Record<Role, ReturnType<typeof css>> = {
  user: css({ background: color.card, borderColor: color.border }),
  harness: css({ background: art.softGreen, borderColor: art.ok }),
  memory: css({
    background: art.goldSoft,
    borderColor: art.warm,
    borderStyle: "dashed",
  }),
  engine: css({ background: art.softBlue, borderColor: color.accent }),
  model: css({ background: color.surface, borderColor: art.gold }),
};

const activeStyle = css({
  boxShadow: `0 0 0 4px color-mix(in srgb, ${color.accent} 25%, transparent)`,
  transform: "translateY(-2px)",
});

const dimStyle = css({ opacity: 0.45 });

const partyHeadStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  margin: 0,
  lineHeight: 1.4,
  "& strong": { display: "block", fontFamily: font.round, fontWeight: 800 },
  "& small": { display: "block", color: color.muted, fontSize: "0.8rem" },
});

const partyIconStyle = css({
  flex: "none",
  display: "inline-grid",
  placeItems: "center",
  width: "2rem",
  height: "2rem",
  borderRadius: "0.6rem",
  background: color.surface,
});

const partyBodyStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
  marginTop: "0.6rem",
  // A party inside a party — the memory in the harness, the model in the engine — takes a row.
  "& > div": { flexBasis: "100%" },
});

const chipStyle = css({
  display: "inline-block",
  padding: "0.2rem 0.6rem",
  borderRadius: radius.sm,
  border: `1px solid ${color.line}`,
  background: color.surface,
  fontSize: "0.9rem",
  lineHeight: 1.6,
});

const chipTones = {
  plain: css({}),
  memory: css({ borderColor: art.warm, background: art.goldSoft }),
  answer: css({ borderColor: color.accent, color: color.accent }),
  rule: css({ borderColor: art.ok, background: art.softGreen }),
} as const;

const freshStyle = css({ animation: "pop-in 300ms ease-out" });

const flowStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.1rem",
  color: color.line,
  "& small": { fontSize: "0.75rem", color: color.muted, textAlign: "center" },
  "@media (max-width: 640px)": { "& > span": { transform: "rotate(90deg)" } },
});

const flowActiveStyle = css({
  color: color.accent,
  "& svg": { animation: "float 900ms ease-in-out infinite" },
});

const flowArrowStyle = css({ display: "flex" });

const fingerprintStyle = css({
  fontSize: "0.8rem",
  transition: "background 200ms",
});

const changedStyle = css({ background: art.softRed, color: art.ng });
