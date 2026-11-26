/**
 * Where 図解パスキー's facts come from: the specification, and the passkey pages of the groups and
 * companies that build them. Each chapter lists the ones it leans on.
 */

import type { Source } from "../../parts.tsx";

export const sources = {
  webauthn: {
    href: "https://www.w3.org/TR/webauthn-3/",
    label:
      "W3C「Web Authentication: An API for accessing Public Key Credentials Level 3」（WebAuthn の仕様、英語）",
  },
  fido: {
    href: "https://fidoalliance.org/passkeys/",
    label: "FIDO Alliance「Passkeys」（英語）",
  },
  passkeysDev: {
    href: "https://passkeys.dev/",
    label: "passkeys.dev（W3C・FIDO の関係者による開発者向け解説、英語）",
  },
  mdn: {
    href:
      "https://developer.mozilla.org/ja/docs/Web/API/Web_Authentication_API",
    label: "MDN「ウェブ認証 API」",
  },
  apple: {
    href: "https://developer.apple.com/passkeys/",
    label: "Apple Developer「Passkeys」（英語）",
  },
  google: {
    href: "https://developers.google.com/identity/passkeys",
    label: "Google for Developers「Passkeys」",
  },
} as const satisfies Record<string, Source>;
