/**
 * The document shell — the header, the page, and the footer.
 *
 * Inside a 図解 the header carries that 図解's name and its table of contents; on the home page it
 * carries only the site's name. Written the way every Remix component is: a setup function that
 * returns a render function. Its CSS is right here as `css(...)` mixins; the renderer collects the
 * mixins a page rendered and writes them into `<head>`.
 *
 * What turns this tree into a response is `context.render`, from the `render({ assets })`
 * middleware in `router.tsx` — `renderToStream`, whose end-of-document marker the runtime needs to
 * swap pages on a soft navigation.
 *
 * The one stylesheet it links is `static/app.css`: the site's tokens, its document-level defaults,
 * its animations, and the `@layer base, rmx, app` statement the whole cascade hangs off. Layers
 * rank by where they are first named and Remix appends its collected styles just before `</head>`,
 * so the link has to come first.
 */

import { css, type Handle, type RemixNode } from "@remix-run/component";

import { base, BASE_META_NAME } from "./base.ts";
import { routes } from "./routes.ts";
import { type SeriesKey, seriesOf } from "./series.ts";
import { color, contentWidth, font, wideWidth } from "./tokens.ts";
import { Icon } from "./ui/icons.tsx";

/** What every page hands the shell. */
export interface LayoutProps {
  title: string;
  description?: string;
  /**
   * The page's social card — the URL of the PNG `server/og/` draws for it. Absolute when the
   * deploy URL is known, because `og:image` is fetched by someone else's server.
   */
  image: string | null;
  /**
   * The client runtime, for a page that places an island; `null` for a page with none. Required
   * rather than optional because a forgotten runtime looks exactly like a page that needs none —
   * it renders fine, and nothing on it moves.
   */
  script: ClientRuntime | null;
  /** The 図解 this page belongs to, so the header can show its table of contents. */
  series?: SeriesKey;
  /** The page's own path, so the table of contents can mark it. */
  current?: string;
  /** Lay the page out at the wider measure — a grid of cards. */
  wide?: boolean;
  children: RemixNode;
}

/** Where the client runtime lives, and what it pulls in behind it. */
export interface ClientRuntime {
  src: string;
  /** The chunks it imports, for `<link rel="modulepreload">`. */
  preloads: readonly string[];
}

/**
 * What every page module exports: a component, plus what the shell needs to frame it.
 *
 * `hydrate` is required rather than optional: an omitted flag is indistinguishable from a page
 * that genuinely ships nothing, and the page still renders.
 */
export interface PageModule<Props = Record<string, never>> {
  default: (handle: Handle<Props>) => () => RemixNode;
  title: string;
  description?: string;
  /** Whether the page places a client entry, so the shell boots the runtime for it. */
  hydrate: boolean;
}

/** The site's name, in the header and on the home page's social card. */
export const SITE_NAME = "zukai.kbn.one";

/**
 * Renders a page inside the document shell.
 *
 * @param handle The page's title, body, and whether it hydrates
 * @returns The document
 */
export function Layout(handle: Handle<LayoutProps>) {
  return () => {
    const props = handle.props;
    const s = props.series ? seriesOf(props.series) : null;

    return (
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{props.title}</title>
          {props.description
            ? <meta name="description" content={props.description} />
            : null}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={props.title} />
          {props.description
            ? <meta property="og:description" content={props.description} />
            : null}
          {props.image
            ? (
              <>
                <meta property="og:image" content={props.image} />
                <meta name="twitter:card" content="summary_large_image" />
              </>
            )
            : null}
          {/* The deploy prefix, for the browser — see `client/base.ts`. */}
          <meta name={BASE_META_NAME} content={base} />
          <link rel="stylesheet" href={`${base}/static/app.css`} />
          {/* The two faces the design is set in; `app.css` falls back to system fonts. */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href={FONTS_HREF} />
          <link
            rel="icon"
            type="image/svg+xml"
            href={`${base}/static/favicon.svg`}
          />
          {(props.script?.preloads ?? []).map((href) => (
            <link key={href} rel="modulepreload" href={href} />
          ))}
        </head>
        <body>
          <header mix={headerStyle}>
            <div mix={[bandStyle, wideBandStyle, headerInnerStyle]}>
              <p mix={brandRowStyle}>
                <a mix={siteStyle} href={routes.home.href()}>{SITE_NAME}</a>
                {s
                  ? (
                    <>
                      <span aria-hidden="true" mix={sepStyle}>/</span>
                      <a
                        mix={brandStyle}
                        href={s.index.href()}
                        aria-current={props.current === s.index.href()
                          ? "page"
                          : undefined}
                      >
                        <span mix={brandMarkStyle} aria-hidden="true">
                          <Icon name={s.icon} size="1.1rem" />
                        </span>
                        {s.title}
                      </a>
                    </>
                  )
                  : null}
              </p>
              {s
                ? (
                  <nav aria-label={`${s.title}のもくじ`} mix={navStyle}>
                    {s.chapters.map((c, i) => (
                      <a
                        key={c.route.href()}
                        href={c.route.href()}
                        aria-current={c.route.href() === props.current
                          ? "page"
                          : undefined}
                        mix={navLinkStyle}
                      >
                        <span mix={navNumStyle}>{i + 1}</span>
                        {c.short}
                      </a>
                    ))}
                  </nav>
                )
                : null}
            </div>
          </header>
          <main mix={[bandStyle, props.wide ? wideBandStyle : null, mainStyle]}>
            {props.children}
          </main>
          <footer mix={footerStyle}>
            <div mix={[bandStyle, wideBandStyle]}>
              <p>
                しくみを、動く図でざっくり説明するサイトです。わかりやすさのために、たとえ話を使ったり、こまかいところを省いたりしています。
              </p>
            </div>
          </footer>
          {props.script
            ? <script type="module" src={props.script.src}></script>
            : null}
        </body>
      </html>
    );
  };
}

/** M PLUS Rounded 1c for headings, Zen Kaku Gothic New for the text. */
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@800&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap";

// --- styles -----------------------------------------------------------------

/** The measure the header, the main column and the footer all share. */
const bandStyle = css({
  width: "100%",
  maxWidth: contentWidth,
  marginInline: "auto",
  paddingInline: "1rem",
});

/** The header, the footer and the card grids run wider than a chapter's column of text. */
const wideBandStyle = css({ maxWidth: wideWidth });

const headerStyle = css({
  background: color.surface,
  borderBottom: `1px solid ${color.border}`,
});

const headerInnerStyle = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  paddingBlock: "1rem",
});

const brandRowStyle = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "0.5rem",
  margin: 0,
});

const siteStyle = css({
  fontFamily: font.round,
  fontWeight: 800,
  fontSize: "1rem",
  color: color.muted,
  textDecoration: "none",
  "&:hover": { color: color.accent },
});

const sepStyle = css({ color: color.line, fontWeight: 700 });

const brandStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  fontFamily: font.round,
  fontWeight: 800,
  fontSize: "1.25rem",
  textDecoration: "none",
  color: color.fg,
  "&:hover": { color: color.accent },
});

const brandMarkStyle = css({
  display: "inline-grid",
  placeItems: "center",
  width: "2rem",
  height: "2rem",
  borderRadius: "0.6rem",
  background: color.accent,
  color: color.onAccent,
});

const navStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
});

const navLinkStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.45rem 0.8rem",
  borderRadius: "999px",
  background: color.bg,
  color: color.fg,
  fontSize: "0.875rem",
  fontWeight: 700,
  textDecoration: "none",
  "&:hover": { color: color.accent },
  '&[aria-current="page"]': {
    background: color.accent,
    color: color.onAccent,
  },
});

const navNumStyle = css({
  fontFamily: font.round,
  fontWeight: 800,
});

const mainStyle = css({ paddingBlock: "3rem 5rem" });

const footerStyle = css({
  borderTop: `1px solid ${color.border}`,
  background: color.surface,
  color: color.muted,
  "& p": {
    margin: 0,
    paddingBlock: "1.75rem",
    fontSize: "0.875rem",
    lineHeight: 1.8,
  },
});
