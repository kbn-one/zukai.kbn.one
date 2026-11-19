/** @jsxImportSource ruby-jsx */
// The type checker still reads JSX types from Remix; this keeps them in the module graph.
import type {} from "@remix-run/component/jsx-runtime";
/**
 * The footer line under every page of マイナンバーカードのひみつ, in place of the site's own:
 * the 図解 is unofficial, and the official pages are where the real answers are.
 */

import type { Handle } from "@remix-run/component";

export function MynaFootnote(_handle: Handle) {
  return () => (
    <p>
      {"この図解は、マイナンバーカードのしくみを、わかりやすく説明するために作った"}
      <strong>非公式</strong>
      {"の解説です。たとえ話を使っているので、こまかいところは本物とちがう部分があります。正しい情報は"}
      <a href="https://www.digital.go.jp/policies/mynumber">デジタル庁</a>
      {"や"}
      <a href="https://www.jpki.go.jp/">公的個人認証サービス（J-LIS）</a>
      {"のページを見てね。"}
    </p>
  );
}
