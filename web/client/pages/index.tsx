/**
 * The site's top page: the shelf of 図解, one card each.
 */

import { css, type Handle } from "@remix-run/component";

import { SITE_NAME } from "../layout.tsx";
import { series } from "../series.ts";
import { art, color, font, radius } from "../tokens.ts";
import { Icon } from "../ui/icons.tsx";

export const title = `${SITE_NAME} — 動く図で、しくみをざっくり`;
export const description =
  "身のまわりのしくみを、さわって動かせる図で説明する図解集。";

export const hydrate = false;

export default function Home(_handle: Handle) {
  return () => (
    <>
      <header mix={heroStyle}>
        <h1>動く図で、しくみをざっくり</h1>
        <p>
          身のまわりのしくみを、さわって動かせる図で説明します。気になるものから読んでください。
        </p>
      </header>

      <ul mix={gridStyle}>
        {series.map((s) => (
          <li key={s.key}>
            <a href={s.index.href()} mix={cardStyle}>
              <span mix={iconStyle}>
                <Icon name={s.icon} size="2rem" />
              </span>
              <strong>{s.title}</strong>
              <span>{s.lead}</span>
              <small>{s.chapters.length}章</small>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

const heroStyle = css({
  marginBottom: "2.5rem",
  "& p": { fontSize: "1.15rem", color: color.muted },
});

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(20rem, 100%), 1fr))",
  gap: "1rem",
  margin: 0,
  padding: 0,
  listStyle: "none",
  "& li": { margin: 0 },
});

const cardStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
  height: "100%",
  padding: "1.5rem",
  border: "2px solid transparent",
  borderRadius: radius.lg,
  background: color.surface,
  color: color.fg,
  textDecoration: "none",
  "&:hover": { borderColor: color.accent, color: color.fg },
  "& strong": { fontFamily: font.round, fontWeight: 800, fontSize: "1.5rem" },
  "& > span:not(:first-child)": { color: color.muted, lineHeight: 1.8 },
  "& small": { color: color.accent, fontWeight: 700 },
});

const iconStyle = css({
  display: "grid",
  placeItems: "center",
  width: "3.5rem",
  height: "3.5rem",
  borderRadius: "1rem",
  background: art.softBlue,
  color: color.accent,
});
