/**
 * The building blocks every chapter page is made of, in every 図解.
 *
 * A chapter reads the same way each time — its question, a "たとえるなら" box, the moving picture,
 * "ひとことで", the details worth knowing, sources, then まえ / つぎ — and these are those pieces.
 * They render on the server only; the moving pictures are the islands under `islands/`.
 *
 * A 図解 written for children sets `ruby` on its series, and the strings printed here from the
 * series list get readings above their kanji. The pieces that print a string prop of their own
 * (`Stage`, `Cast`, `Sources`) take a `ruby` flag for the same reason.
 */

import { css, type Handle, type RemixNode } from "@remix-run/component";

import { readings } from "./ruby/readings.ts";
import { placeOf, type Series } from "./series.ts";
import { art, color, font, radius } from "./tokens.ts";
import { Icon, type IconName } from "./ui/icons.tsx";

/** The text as it is, or with readings above its kanji when `ruby` is set. */
function say(ruby: boolean | undefined, text: string): RemixNode {
  return ruby ? readings(text) : text;
}

/** The chapter's number, its question and the lead line under it. */
export function ChapterHead(
  handle: Handle<{ chapter: { href(): string }; children?: RemixNode }>,
) {
  return () => {
    const { chapter, number, series } = placeOf(handle.props.chapter);
    return (
      <header mix={chapterHeadStyle}>
        <p mix={eyebrowStyle}>
          <span mix={badgeStyle} aria-hidden="true">{number}</span>
          {say(series.ruby, `${series.title}第${number}章`)}
        </p>
        <h1>{say(series.ruby, chapter.title)}</h1>
        {handle.props.children
          ? <div mix={leadStyle}>{handle.props.children}</div>
          : null}
      </header>
    );
  };
}

/** A "たとえるなら" box: the everyday thing the idea is like. */
export function Analogy(handle: Handle<{ children: RemixNode }>) {
  return () => (
    <aside mix={[boxStyle, analogyStyle]}>
      <span mix={[boxMarkStyle, analogyMarkStyle]} aria-hidden="true">
        <Icon name="bulb" size="1.25rem" />
      </span>
      <div>
        <p mix={boxLabelStyle}>たとえるなら</p>
        {handle.props.children}
      </div>
    </aside>
  );
}

/** The chapter in one line or two. */
export function Summary(handle: Handle<{ children: RemixNode }>) {
  return () => (
    <aside mix={[boxStyle, summaryStyle]}>
      <span mix={[boxMarkStyle, summaryMarkStyle]} aria-hidden="true">！</span>
      <div>
        <p mix={boxLabelStyle}>ひとことでいうと</p>
        {handle.props.children}
      </div>
    </aside>
  );
}

/** "くわしいメモ": the real names, the numbers and the caveats the picture leaves out. */
export function DetailNote(handle: Handle<{ children: RemixNode }>) {
  return () => (
    <details mix={noteStyle}>
      <summary>くわしいメモ（正確な名前と、図で省いたこと）</summary>
      <div mix={noteBodyStyle}>{handle.props.children}</div>
    </details>
  );
}

/**
 * "大人向けメモ": the real names and numbers, for whoever is reading along with a child — the
 * {@link DetailNote} of a 図解 written for children.
 */
export function GrownUpNote(handle: Handle<{ children: RemixNode }>) {
  return () => (
    <details mix={noteStyle}>
      <summary>
        {readings("大人向けメモ（本当の名前と、くわしいこと）")}
      </summary>
      <div mix={noteBodyStyle}>{handle.props.children}</div>
    </details>
  );
}

/** A frame around an island, so the moving picture reads as the thing to play with. */
export function Stage(
  handle: Handle<{ label: string; ruby?: boolean; children: RemixNode }>,
) {
  return () => (
    <section mix={stageStyle} aria-label={handle.props.label}>
      <p mix={stageLabelStyle}>
        <Icon name="play" size="1.1rem" />{" "}
        {say(handle.props.ruby, handle.props.label)}
      </p>
      {handle.props.children}
    </section>
  );
}

/** One of the things a chapter's picture is about, for {@link Cast}. */
export interface CastMember {
  icon: IconName;
  name: string;
  /** One short line: what it is, or what it does. */
  note: string;
}

/** "登場するもの": the cast of a chapter's picture, as a row of small tiles. */
export function Cast(
  handle: Handle<{ items: CastMember[]; ruby?: boolean }>,
) {
  return () => (
    <ul mix={castStyle}>
      {handle.props.items.map((m) => (
        <li key={m.name} mix={castItemStyle}>
          <span mix={castIconStyle}>
            <Icon name={m.icon} size="1.6rem" />
          </span>
          <strong>{say(handle.props.ruby, m.name)}</strong>
          <span>{say(handle.props.ruby, m.note)}</span>
        </li>
      ))}
    </ul>
  );
}

/** One link to a source, for the "もっとくわしく" list. */
export interface Source {
  href: string;
  label: string;
}

/** Where the facts on the page come from. */
export function Sources(
  handle: Handle<{ items: Source[]; ruby?: boolean }>,
) {
  return () => (
    <section mix={sourcesStyle}>
      <h2>もっとくわしく</h2>
      <ul>
        {handle.props.items.map((s) => (
          <li key={s.href}>
            <a href={s.href}>{say(handle.props.ruby, s.label)}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** まえ / つぎ, at the foot of a chapter. */
export function ChapterNav(handle: Handle<{ chapter: { href(): string } }>) {
  return () => {
    const { prev, next, series } = placeOf(handle.props.chapter);
    return (
      <nav aria-label="まえ・つぎの章" mix={chapterNavStyle}>
        {prev
          ? (
            <a href={prev.route.href()} mix={[pagerStyle, prevStyle]}>
              <small>まえ</small>
              <span>{say(series.ruby, prev.title)}</span>
            </a>
          )
          : (
            <a href={series.index.href()} mix={[pagerStyle, prevStyle]}>
              <small>もどる</small>
              <span>{say(series.ruby, `${series.title}のもくじ`)}</span>
            </a>
          )}
        {next
          ? (
            <a href={next.route.href()} mix={[pagerStyle, nextStyle]}>
              <small>つぎ</small>
              <span>{say(series.ruby, next.title)}</span>
            </a>
          )
          : (
            <a href={series.index.href()} mix={[pagerStyle, nextStyle]}>
              <small>おしまい</small>
              <span>{say(series.ruby, `${series.title}のもくじへ`)}</span>
            </a>
          )}
      </nav>
    );
  };
}

/** A 図解's もくじ: one card per chapter, in order. */
export function ChapterList(handle: Handle<{ series: Series }>) {
  return () => (
    <ol mix={chapterListStyle}>
      {handle.props.series.chapters.map((c, i) => {
        const ruby = handle.props.series.ruby;
        return (
          <li key={c.route.href()}>
            <a href={c.route.href()} mix={chapterCardStyle}>
              <span mix={chapterCardIconStyle}>
                <Icon name={c.icon} size="1.5rem" />
              </span>
              <span>
                <small>{say(ruby, `第${i + 1}章`)}</small>
                <strong>{say(ruby, c.title)}</strong>
                <span>{say(ruby, c.lead)}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

// --- styles -----------------------------------------------------------------

const chapterHeadStyle = css({
  marginBottom: "2rem",
  "& h1": { marginBottom: "0.75rem" },
});

const eyebrowStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  margin: "0 0 1.25rem",
  fontFamily: font.round,
  fontWeight: 800,
  color: color.accent,
});

/** The chapter's number in a blue circle. */
const badgeStyle = css({
  display: "inline-grid",
  placeItems: "center",
  width: "3.25rem",
  height: "3.25rem",
  borderRadius: "999px",
  background: color.accent,
  color: color.onAccent,
  fontSize: "1.6rem",
});

const leadStyle = css({
  color: color.muted,
  "& p": { marginBlock: "0.5rem", fontSize: "1.15rem" },
});

const boxStyle = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "0.9rem",
  marginBlock: "2rem",
  padding: "1.25rem 1.5rem",
  borderRadius: radius.lg,
  "& > div > :last-child": { marginBottom: 0 },
  "& > div > p:not(:first-child)": { marginTop: "0.25rem" },
});

/** The little square at the start of a box: what kind of box it is. */
const boxMarkStyle = css({
  flex: "none",
  display: "grid",
  placeItems: "center",
  width: "2.25rem",
  height: "2.25rem",
  borderRadius: "0.6rem",
  fontFamily: font.round,
  fontWeight: 800,
});

const boxLabelStyle = css({
  margin: "0.2rem 0 0.25rem",
  fontFamily: font.round,
  fontWeight: 800,
  fontSize: "1.05rem",
});

const analogyStyle = css({ background: color.surface });

const analogyMarkStyle = css({
  background: art.softBlue,
  color: color.accent,
});

const summaryStyle = css({ background: art.goldSoft });

const summaryMarkStyle = css({
  background: art.goldLight,
  color: art.ink,
});

const noteStyle = css({
  marginBlock: "2rem",
  padding: "1rem 1.25rem",
  border: `1px solid ${color.border}`,
  borderRadius: radius.md,
  background: color.surface,
  fontSize: "0.95rem",
  "& summary": { cursor: "pointer", fontWeight: 700, color: color.muted },
  "& summary:hover": { color: color.accent },
});

const noteBodyStyle = css({
  "& p, & li": { fontSize: "0.95rem", lineHeight: 1.8 },
  "& ul": { paddingLeft: "1.2rem" },
});

const stageStyle = css({
  marginBlock: "2.25rem",
  padding: "1.5rem",
  border: `3px solid ${color.accent}`,
  borderRadius: "1.5rem",
  background: color.surface,
  "@media (max-width: 560px)": { padding: "1rem" },
});

const stageLabelStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  margin: "0 0 1rem",
  fontFamily: font.round,
  fontWeight: 800,
  color: color.accent,
  fontSize: "1rem",
});

const castStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(14rem, 100%), 1fr))",
  gap: "0.75rem",
  margin: "1rem 0 0",
  padding: 0,
  listStyle: "none",
});

const castItemStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  margin: 0,
  padding: "1.1rem",
  borderRadius: "1.1rem",
  background: color.surface,
  "& strong": { fontSize: "1rem" },
  "& > span:last-child": {
    color: color.muted,
    fontSize: "0.875rem",
    lineHeight: 1.7,
  },
});

const castIconStyle = css({ color: color.accent, display: "flex" });

const sourcesStyle = css({
  marginTop: "3rem",
  "& h2": { fontSize: "1.1rem", color: color.muted },
  "& ul": { paddingLeft: "1.2rem" },
  "& li": { fontSize: "0.9rem", lineHeight: 1.7 },
});

const chapterNavStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.75rem",
  marginTop: "2.5rem",
});

const pagerStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  padding: "1rem 1.15rem",
  border: "2px solid transparent",
  borderRadius: "1.1rem",
  background: color.surface,
  color: color.fg,
  textDecoration: "none",
  "& small": { color: color.accent, fontWeight: 700, fontSize: "0.8rem" },
  "& > span": { fontSize: "0.95rem", lineHeight: 1.6 },
  "&:hover": { borderColor: color.accent, color: color.fg },
});

const prevStyle = css({ textAlign: "left" });
const nextStyle = css({ textAlign: "right" });

const chapterListStyle = css({
  display: "grid",
  gap: "0.75rem",
  margin: "1rem 0 0",
  padding: 0,
  listStyle: "none",
  "& li": { margin: 0 },
});

const chapterCardStyle = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "1rem",
  padding: "1.1rem 1.25rem",
  border: "2px solid transparent",
  borderRadius: "1.1rem",
  background: color.surface,
  color: color.fg,
  textDecoration: "none",
  "&:hover": { borderColor: color.accent, color: color.fg },
  "& small": {
    display: "block",
    color: color.accent,
    fontFamily: font.round,
    fontWeight: 800,
  },
  "& strong": {
    display: "block",
    fontFamily: font.round,
    fontWeight: 800,
    fontSize: "1.1rem",
    lineHeight: 1.5,
  },
  "& > span > span": {
    display: "block",
    marginTop: "0.25rem",
    color: color.muted,
    fontSize: "0.95rem",
    lineHeight: 1.7,
  },
});

const chapterCardIconStyle = css({
  flex: "none",
  display: "grid",
  placeItems: "center",
  width: "3rem",
  height: "3rem",
  borderRadius: "0.9rem",
  background: art.softBlue,
  color: color.accent,
});
