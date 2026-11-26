/**
 * The 図解 on the shelf, and the chapters of each, in reading order.
 *
 * The home page's cards, the header's table of contents, a 図解's own もくじ and the "まえ / つぎ"
 * links at the foot of every chapter all read this list, so a chapter added here shows up in all
 * of them. A new 図解 is a new entry here, a `route()` in `routes.ts`, its pages under
 * `pages/<key>/`, and its moving pictures under `islands/<key>/`.
 */

import { routes } from "./routes.ts";
import type { IconName } from "./ui/icons.tsx";

export interface Chapter {
  /** The chapter's route, for its href. */
  route: { href(): string };
  /** Short label for the nav. */
  short: string;
  /** The chapter's question, as its heading. */
  title: string;
  /** One line for the もくじ. */
  lead: string;
  icon: IconName;
}

export interface Series {
  key: SeriesKey;
  /** The 図解's name, in the header and on its social cards. */
  title: string;
  /** One line under the name, on the home page and the 図解's own top page. */
  lead: string;
  icon: IconName;
  /**
   * Set readings above every kanji the shell prints for this 図解 — for one written for children.
   * Its own pages and islands opt in on their own, with the `ruby-jsx` runtime (`ruby/`).
   */
  ruby?: boolean;
  /** The 図解's own top page. */
  index: { href(): string };
  chapters: readonly Chapter[];
}

export type SeriesKey = "ai" | "myna" | "passkey";

export const series: readonly Series[] = [
  {
    key: "ai",
    title: "図解AI",
    lead:
      "チャットAIの中身は、モデル・推論エンジン・ハーネスの3つ。たくさんの人と同時に話せるのに、話がまざらないのはなぜ？ ローカルLLMとのちがいは？",
    icon: "layers",
    index: routes.ai.index,
    chapters: [
      {
        route: routes.ai.parts,
        short: "3つの部品",
        title: "チャットAIは、3つの部品でできている",
        lead:
          "「AI」とひとことで言っても、中ではモデル・推論エンジン・ハーネスが役割を分けて動いています。",
        icon: "layers",
      },
      {
        route: routes.ai.copies,
        short: "コピー",
        title: "モデルは、たくさんコピーされている",
        lead:
          "同じモデルのファイルが、世界中のデータセンターでたくさん並んで動いています。どれも中身はまったく同じ。",
        icon: "copy",
      },
      {
        route: routes.ai.together,
        short: "同時に話す",
        title: "1つのモデルが、何人もの相手を同時にしている",
        lead:
          "あなたと話しているモデルは、同じ瞬間にほかの人の質問にも答えています。",
        icon: "users",
      },
      {
        route: routes.ai.memory,
        short: "メモリ",
        title: "「覚えている」のは、あなたのハーネスのメモリ",
        lead:
          "ハーネスは1人に1つ。前の会話を覚えているように見えるのは、あなたのハーネスが、あなたのメモリを毎回モデルに見せているから。",
        icon: "database",
      },
      {
        route: routes.ai.readonly,
        short: "書きこまれない",
        title: "モデルには書きこまれないから、話はまざらない",
        lead:
          "使っている間、モデルの中身は1つも変わりません。だからあなたの話が、モデルを通ってほかの人にもれることはありません。",
        icon: "lock",
      },
      {
        route: routes.ai.local,
        short: "ローカルLLM",
        title: "ローカルLLMなら、全部が自分のパソコンの中",
        lead:
          "モデルを自分のパソコンにダウンロードして動かすと、3つの部品がすべて手元にそろいます。クラウドのAIと何がちがう？",
        icon: "monitor",
      },
    ],
  },
  {
    key: "myna",
    title: "マイナンバーカードのひみつ",
    lead:
      "ICチップの中身、こわされにくさ、スマホ、本人確認、名前を出さないログインまで。小学生にもわかる言葉で説明します。",
    icon: "card",
    ruby: true,
    index: routes.myna.index,
    chapters: [
      {
        route: routes.myna.inside,
        short: "ICチップ",
        title: "ICチップには何ができる？",
        lead:
          "金色のICチップは、メモ帳じゃなくて小さなコンピューター。できること・できないことを見てみよう。",
        icon: "chip",
      },
      {
        route: routes.myna.tamper,
        short: "こわすと守る",
        title: "むりやり開けようとすると、どうなる？",
        lead:
          "チップは「金庫」。こじあけようとすると、中身を守るしくみがあるよ。",
        icon: "shield",
      },
      {
        route: routes.myna.phone,
        short: "スマホの中",
        title: "スマホにマイナンバーカードが入るって、どういうこと？",
        lead:
          "カードをコピーするんじゃない。スマホの金庫に「スマホ用のカギ」を作るんだ。",
        icon: "phone",
      },
      {
        route: routes.myna.auth,
        short: "本人確認",
        title: "どうやって「本人だ」とわかるの？",
        lead:
          "毎回ちがう問題に、ひみつのカギで電子署名をつけてもらって、本物かどうか確かめるよ。",
        icon: "key",
      },
      {
        route: routes.myna.anonymous,
        short: "名前を出さない",
        title: "名前を教えずに「本物の人」だと伝えられる？",
        lead:
          "お店ごとにちがう番号を使えば、名前を言わなくてもログインできる。",
        icon: "userOff",
      },
      {
        route: routes.myna.digitalAuthApp,
        short: "デジタル認証アプリ",
        title: "デジタル庁の「デジタル認証アプリ」",
        lead:
          "いろいろなサイトが、マイナンバーカードでのログインを無料で使えるしくみ。",
        icon: "landmark",
      },
      {
        route: routes.myna.signature,
        short: "電子署名",
        title: "電子署名を、自分で作ってみよう",
        lead:
          "アリスさんがボブさんに手紙を送るよ。本当にアリスさんが書いたと、ボブさんはどうやってわかるのかな？",
        icon: "sign",
      },
      {
        route: routes.myna.license,
        short: "スマホ免許証",
        title: "スマホが運転免許証になる日は来る？",
        lead:
          "今は、カードを持っていないと運転できない。国は、スマホだけで運転できるようにする道を考えているよ。",
        icon: "car",
      },
    ],
  },
  {
    key: "passkey",
    title: "図解パスキー",
    lead:
      "パスワードのかわりに、指紋や顔、画面ロックでログインする「パスキー」。何がサイトに届いて、何が手元に残るの？ にせサイトに強いのはなぜ？ スマホをなくしたら？",
    icon: "key",
    index: routes.passkey.index,
    chapters: [
      {
        route: routes.passkey.password,
        short: "パスワードとのちがい",
        title: "パスワードと、何がちがう？",
        lead:
          "パスワードは、あなたとサイトが同じ合言葉を知っています。パスキーでは、サイトはログインに使える秘密を持っていません。",
        icon: "lock",
      },
      {
        route: routes.passkey.keys,
        short: "2つの鍵",
        title: "秘密鍵と公開鍵は、はんこと印影の関係",
        lead:
          "パスキーの正体は、ペアになった2つの鍵。片方でしか作れない「しるし」を、もう片方で確かめます。",
        icon: "publicKey",
      },
      {
        route: routes.passkey.device,
        short: "端末から出ない",
        title: "秘密鍵も指紋も、端末の外へは出ていかない",
        lead:
          "ログインのとき、ネットを流れるのは「問題」と「しるし」だけ。指紋や顔は、端末のロックを開けるのに使われるだけです。",
        icon: "fingerprint",
      },
      {
        route: routes.passkey.phishing,
        short: "にせサイトに強い",
        title: "にせサイトでは、パスキーは使えない",
        lead:
          "パスキーは、作ったサイトのドメインに結びついています。見た目がそっくりでも、ドメインがちがえば鍵は出てきません。",
        icon: "hook",
      },
      {
        route: routes.passkey.flow,
        short: "登録とログイン",
        title: "登録とログインは、こう流れる",
        lead:
          "登録ではサイトごとに新しい鍵のペアを作り、公開鍵だけをわたします。ログインでは毎回ちがう問題に、しるしをつけて返します。",
        icon: "arrowRight",
      },
      {
        route: routes.passkey.sync,
        short: "なくしたら・同期",
        title: "スマホをなくしたら、パスキーはどうなる？",
        lead:
          "iCloud キーチェーンや Google パスワードマネージャーは、パスキーを暗号化したまま、あなたの端末どうしで同期します。",
        icon: "cloud",
      },
      {
        route: routes.passkey.myths,
        short: "よくある誤解",
        title: "パスキーの、よくある誤解",
        lead:
          "「指紋がサイトに送られる」「スマホをなくしたらおしまい」「パスキーなら何があっても安全」……本当はどうなのか、ひとつずつ見ていきます。",
        icon: "question",
      },
    ],
  },
];

/** The 図解 with this key. */
export function seriesOf(key: SeriesKey): Series {
  return series.find((s) => s.key === key)!;
}

/** Where a chapter sits: its 図解, its number from 1, and the chapters either side. */
export interface ChapterPlace {
  series: Series;
  chapter: Chapter;
  number: number;
  prev: Chapter | null;
  next: Chapter | null;
}

/**
 * Finds a chapter by its route.
 *
 * @param route The chapter's route, as `routes` holds it
 * @returns Where it sits
 */
export function placeOf(route: { href(): string }): ChapterPlace {
  for (const s of series) {
    const i = s.chapters.findIndex((c) => c.route === route);
    if (i === -1) continue;
    return {
      series: s,
      chapter: s.chapters[i],
      number: i + 1,
      prev: s.chapters[i - 1] ?? null,
      next: s.chapters[i + 1] ?? null,
    };
  }
  throw new Error(`No chapter is registered at ${route.href()}`);
}
