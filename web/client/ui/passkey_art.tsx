/**
 * The pictures 図解パスキー is drawn with: the people and machines in a login (you, your device,
 * the website, an impostor), the things that travel between them (a question, a signature, a
 * password, a public key) and the arrow they travel along.
 *
 * Shared by the islands under `islands/passkey/` and by the overview on `/passkey/`. Plain HTML
 * boxes with the site's line icons rather than one big SVG, so the picture reflows on a phone
 * instead of shrinking.
 */

import { css, type Handle, type RemixNode } from "@remix-run/component";

import { art, color, font, radius } from "../tokens.ts";
import { Icon, type IconName } from "./icons.tsx";

/** The kinds of party in a login. */
export type ActorTone = "you" | "device" | "site" | "bad" | "cloud";

const actorIcons: Record<ActorTone, IconName> = {
  you: "user",
  device: "phone",
  site: "monitor",
  bad: "hook",
  cloud: "cloud",
};

/**
 * One party in the picture: an icon, a name, an optional second line, and what it holds.
 *
 * `dim` pushes it back for a step that is about something else; `active` lifts it forward.
 */
export function Actor(
  handle: Handle<{
    tone: ActorTone;
    name: string;
    note?: string;
    icon?: IconName;
    active?: boolean;
    dim?: boolean;
    children?: RemixNode;
  }>,
) {
  return () => {
    const { tone, name, note, icon, active, dim, children } = handle.props;
    return (
      <div
        mix={[
          actorStyle,
          actorTones[tone],
          active ? activeStyle : null,
          dim ? dimStyle : null,
        ]}
      >
        <p mix={actorHeadStyle}>
          <span mix={actorIconStyle} aria-hidden="true">
            <Icon name={icon ?? actorIcons[tone]} size="1.2rem" />
          </span>
          <span>
            <strong>{name}</strong>
            {note ? <small>{note}</small> : null}
          </span>
        </p>
        {children ? <div mix={actorBodyStyle}>{children}</div> : null}
      </div>
    );
  };
}

/** What a token is, which decides its icon and color. */
export type TokenKind =
  | "secret"
  | "public"
  | "signature"
  | "challenge"
  | "password"
  | "bio"
  | "domain"
  | "ng";

const tokenIcons: Record<TokenKind, IconName> = {
  secret: "key",
  public: "publicKey",
  signature: "sign",
  challenge: "question",
  password: "keypad",
  bio: "fingerprint",
  domain: "globe",
  ng: "x",
};

/** A small labelled thing: a key, a signature, a password, the address of a site. */
export function Token(
  handle: Handle<{
    kind: TokenKind;
    children: RemixNode;
    /** Animate it in — for a token that just arrived. */
    fresh?: boolean;
    /** Cross it out: it is not there, or it does not work. */
    struck?: boolean;
  }>,
) {
  return () => {
    const { kind, children, fresh, struck } = handle.props;
    return (
      <span
        mix={[
          tokenStyle,
          tokenTones[kind],
          fresh ? freshStyle : null,
          struck ? struckStyle : null,
        ]}
      >
        <Icon name={tokenIcons[kind]} />
        <span>{children}</span>
      </span>
    );
  };
}

/**
 * The line between two parties, and what is on its way along it. Points sideways on a wide
 * screen and up or down once the parties stack on a phone.
 */
export function Wire(
  handle: Handle<{
    /** `right` travels from the left party to the right one (down on a phone). */
    dir?: "right" | "left";
    label?: string;
    children?: RemixNode;
  }>,
) {
  return () => {
    const { dir = "right", label, children } = handle.props;
    const right = dir === "right";
    return (
      <div mix={wireStyle}>
        {children
          ? (
            <div mix={[cargoStyle, right ? toRightStyle : toLeftStyle]}>
              {children}
            </div>
          )
          : null}
        <span mix={arrowStyle} aria-hidden="true">
          <span mix={wideOnlyStyle}>
            <Icon name={right ? "arrowRight" : "arrowLeft"} size="1.4rem" />
          </span>
          <span mix={narrowOnlyStyle}>
            <Icon name={right ? "arrowDown" : "arrowUp"} size="1.4rem" />
          </span>
        </span>
        {label ? <small>{label}</small> : null}
      </div>
    );
  };
}

/** "OK" or "NG", said in a line. */
export function Verdict(handle: Handle<{ ok: boolean; children: RemixNode }>) {
  return () => (
    <span mix={[verdictStyle, handle.props.ok ? okStyle : ngStyle]}>
      <Icon name={handle.props.ok ? "check" : "x"} />
      <span>{handle.props.children}</span>
    </span>
  );
}

/**
 * A stand-in signature: looks like a jumble, and depends on what was signed and on which key
 * signed it. The same key and message always give the same code; anything else gives another.
 * Not cryptography — a picture of what a signature does.
 */
export function stampOf(message: string, key: string): string {
  let h = 2166136261;
  for (const ch of key + ":" + message) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += (h >>> (i * 8) & 0xff).toString(16).padStart(2, "0");
    h = Math.imul(h ^ (h >>> 13), 2246822507) >>> 0;
  }
  return `${out.slice(0, 4)}…${out.slice(4)}`;
}

/**
 * A fresh question ("チャレンジ") for a login. Only ever called after the reader presses
 * something, so the first render can use a fixed one and match on server and browser.
 */
export function newChallenge(not?: string): string {
  for (;;) {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 0x10000;
    const q = n.toString(16).padStart(4, "0").toUpperCase();
    const c = `${q.slice(0, 2)}-${q.slice(2)}`;
    if (c !== not) return c;
  }
}

/** The real site in these pictures, and its look-alike. Both made up. */
export const REAL_SITE = "example-bank.jp";
export const FAKE_SITE = "examp1e-bank.jp";

// --- styles -----------------------------------------------------------------

/** Where the parties stop sitting side by side and stack instead. */
export const narrow = "@media (max-width: 640px)";

export const wideOnlyStyle = css({
  display: "flex",
  [narrow]: { display: "none" },
});
export const narrowOnlyStyle = css({
  display: "none",
  [narrow]: { display: "flex" },
});

/** A row of three: party, wire, party — stacked on a phone. */
export const sceneStyle = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(6.5rem, 0.8fr) minmax(0, 1fr)",
  alignItems: "stretch",
  gap: "0.5rem",
  [narrow]: { gridTemplateColumns: "minmax(0, 1fr)" },
});

/** The buttons that choose which story to tell. */
export const chooserStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "1rem",
});

const actorStyle = css({
  minWidth: 0,
  padding: "0.75rem 0.85rem",
  border: "2px solid transparent",
  borderRadius: radius.md,
  transition: "opacity 200ms, transform 200ms, box-shadow 200ms",
});

const actorTones: Record<ActorTone, ReturnType<typeof css>> = {
  you: css({ background: color.card, borderColor: color.border }),
  device: css({ background: art.softGreen, borderColor: art.ok }),
  site: css({ background: art.softBlue, borderColor: color.accent }),
  bad: css({
    background: art.softRed,
    borderColor: art.ng,
    borderStyle: "dashed",
  }),
  cloud: css({
    background: art.goldSoft,
    borderColor: art.warm,
    borderStyle: "dashed",
  }),
};

const activeStyle = css({
  boxShadow: `0 0 0 4px color-mix(in srgb, ${color.accent} 25%, transparent)`,
  transform: "translateY(-2px)",
});

const dimStyle = css({ opacity: 0.45 });

const actorHeadStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  margin: 0,
  lineHeight: 1.4,
  "& strong": { display: "block", fontFamily: font.round, fontWeight: 800 },
  "& small": { display: "block", color: color.muted, fontSize: "0.8rem" },
});

const actorIconStyle = css({
  flex: "none",
  display: "inline-grid",
  placeItems: "center",
  width: "2.1rem",
  height: "2.1rem",
  borderRadius: "0.6rem",
  background: color.surface,
});

const actorBodyStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
  marginTop: "0.6rem",
  "& > small": { flexBasis: "100%", color: color.muted, fontSize: "0.8rem" },
  "& > div": { flexBasis: "100%" },
});

const tokenStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  maxWidth: "100%",
  padding: "0.2rem 0.6rem",
  borderRadius: radius.sm,
  border: `1px solid ${color.line}`,
  background: color.surface,
  fontSize: "0.9rem",
  lineHeight: 1.6,
  overflowWrap: "anywhere",
  "& > span": { minWidth: 0 },
});

const tokenTones: Record<TokenKind, ReturnType<typeof css>> = {
  secret: css({ borderColor: art.ok, color: art.ok, fontWeight: 700 }),
  public: css({ borderColor: color.accent, color: color.accent }),
  signature: css({
    borderColor: art.warm,
    background: art.goldSoft,
    fontFamily: font.mono,
  }),
  challenge: css({ fontFamily: font.mono }),
  password: css({ borderColor: art.ng, color: art.ng, fontFamily: font.mono }),
  bio: css({ borderColor: art.ok, background: art.softGreen }),
  domain: css({ fontFamily: font.mono }),
  ng: css({ borderColor: art.ng, background: art.softRed, color: art.ng }),
};

const freshStyle = css({ animation: "pop-in 300ms ease-out" });

const struckStyle = css({ opacity: 0.55, textDecoration: "line-through" });

const wireStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.3rem",
  minHeight: "3rem",
  color: color.line,
  "& > small": {
    fontSize: "0.75rem",
    color: color.muted,
    textAlign: "center",
  },
});

const arrowStyle = css({ display: "flex" });

const cargoStyle = css({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "0.3rem",
  maxWidth: "100%",
  color: color.fg,
  "& > span": { fontSize: "0.8rem" },
});

const toRightStyle = css({
  animation: "arrive-right 500ms ease-out both",
  [narrow]: { animation: "pop-in 300ms ease-out" },
});
const toLeftStyle = css({
  animation: "arrive-left 500ms ease-out both",
  [narrow]: { animation: "pop-in 300ms ease-out" },
});

const verdictStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.2rem 0.6rem",
  borderRadius: radius.sm,
  fontWeight: 700,
  fontSize: "0.9rem",
  animation: "pop-in 300ms ease-out",
});

const okStyle = css({ background: art.softGreen, color: art.ok });
const ngStyle = css({ background: art.softRed, color: art.ng });
