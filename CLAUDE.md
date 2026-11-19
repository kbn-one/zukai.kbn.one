# zukai.kbn.one

身のまわりのしくみを、動く図でざっくり説明する図解集。1つのリポジトリに、図解ごとの
サブディレクトリ（`/ai/` など）で並べる。Remix v3 + Deno。サーバー API
は持たず、GitHub Pages に静的サイトとして出す。

## 構造

- `web/server/router.tsx`
  が唯一のエントリ。`deno task build`（`@remix-kbn/ssg`） が同じ router を
  `fetch()` でクロールして `web/dist` に静的 HTML を書き出す。クロールは
  `entryPoints`（`/` と og 画像）とそこからのリンクだけを辿る。
- `web/client/` — ブラウザに渡るもの全て。`deno.ns` 無しで型チェックされる
  - `routes.ts` — URL の一覧。図解ごとに `route("<key>", {...})` を1つ持つ
  - `series.ts` —
    図解と、その章の一覧。トップのカード・ヘッダーのもくじ・図解のもくじ・
    まえ/つぎ がここを読む
  - `pages/index.tsx` — サイトのトップ（図解の一覧）
  - `pages/<key>/` — 図解のページ（サーバーでだけ描画）。`index.tsx`
    が図解のトップ、 ほかが各章。章は `parts.tsx` の部品（`ChapterHead`
    `Analogy` `Stage` `Summary` `DetailNote` `Sources` `ChapterNav`）で「問い →
    たとえ → 動く図 → ひとことで → くわしいメモ」の順に組む
  - `islands/<key>/` — 動く図（`clientEntry`）。`islands/*/*.tsx` は全部 bundle
    の entrypoint になるので、共有部品は `ui/` に置く
  - `ui/` — 共有部品。`controls.tsx`（`StepBar`、ボタンの
    style）、`icons.tsx`（線アイコン）、
    `<key>_art.tsx`（その図解の絵の部品。例: `ai_art.tsx`）
  - `static/app.css` — トークンの値と `@keyframes`（`css()` mixin は keyframes
    を宣言 できないので、アニメーションはここに足す）
- `web/server/og/` — 各ページの SNS カード画像（ビルド時に生成）

## 図解を足すとき

1. `routes.ts` に `route("<key>", { index: get("/"), ... })` を足す
2. `series.ts` の `SeriesKey` と `series` に足す（章の順番もここ）
3. `pages/<key>/` にページ、`islands/<key>/` に動く図を書く
4. `router.tsx` に `createController(routes.<key>, ...)` と `router.map` を足す
5. `router.test.ts` は `series` を読むので、章は自動でテストされる

## 書き方

- 図解AI
  の読み手は、ITにくわしくない大人。本文は「です・ます」、図の説明は短い話しことば。
  正確な名前・数字・注意点は「くわしいメモ」（`DetailNote`）に書く
- 図解ごとに読み手がちがってよい。子ども向けの図解（`myna` =
  マイナンバーカードのひみつ）は下の「ルビ」にしたがう
- 絵文字は使わない。アイコンは `ui/icons.tsx` の `Icon`
- JSX のテキストを日本語の途中で改行しない（改行が空白になって表示される）
- island の初期描画はサーバーとブラウザで同じにする（乱数・時刻は操作後に使う）
- 誇張しない。「大丈夫」と言うときは、何が大丈夫で何が別の話かを `DetailNote`
  に書く

## ルビ（子ども向けの図解）

- `myna` のページ・island・`ui/myna_*.tsx` は、先頭に
  `/** @jsxImportSource ruby-jsx */` と
  `import type {} from "@remix-run/component/jsx-runtime";` を置く。JSX
  の文字の漢字に自動でルビがつく（`web/client/ruby/`）。型チェックは Remix の
  JSX 型を読むので、2行目の import が要る
- 共有の `layout.tsx` / `parts.tsx` は普通の Remix で書かれている。`series.ts`
  で `ruby: true` の図解では、そこが出す文字（章の題、もくじ）にもルビをつける。
  `Stage` `Cast` `Sources` には `ruby` を渡す。本文は `DetailNote` のかわりに
  `GrownUpNote`（大人向けメモ）。強調つきの説明は `ui/myna_text.tsx` の
  `emphasize`
- 表記のルールは `docs/myna/WRITING.md`、章の構成は `docs/myna/PLAN.md`。
  漢字の単語を書いたら `web/client/ruby/words.ts` に読みを足す。
  `web/server/text_rules.test.ts` が読みの抜け・配当表外の漢字などを見つける

## 環境変数

- `BASE_URL` — 静的ビルド専用。Pages のサブパス（PR プレビュー等）を `base`
  にする。 og 画像の絶対 URL にも使う。

## GitHub Actions の lockfile

`.github/workflows/actions.lock` で action を commit
に固定する（まだ無い。作るには `gh extension install github/gh-actions-lock`
のうえで `gh actions-lock`）。 `verify-lockfile.yml` は lockfile
が無い間は何もしない。

## 開発

```bash
deno task dev      # 開発サーバー起動
deno task build    # GitHub Pages 用の静的サイトを web/dist へ生成
deno task test     # ルーターのテスト
deno task test:browser  # ブラウザ smoke テスト (lightpanda)
deno task check    # 型チェック + lint + fmt
```

変更後は `deno task check && deno task test && deno task build` と
`deno task test:browser` を通す。

## コーディング規約

- Deno ファースト（Web API 優先、Node.js API は必要最小限）
- TypeScript strict mode
- テストは `Deno.test()` + `@std/assert`
- ファイル名はスネークケース（例: `parts_flow.tsx`）
- 見た目は `@remix-run/component` の `css()` mixin と `web/client/tokens.ts`
  のトークンで 書く (Tailwind / daisyUI は使わない)
- ブラウザへ渡るコードは `web/client/` に置き、`Deno.` を参照しない
- 追加した `import` は `deno.json`（ルート）にだけ書く
