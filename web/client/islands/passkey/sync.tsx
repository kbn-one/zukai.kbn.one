/**
 * 図解パスキー chapter 6: where a passkey lives, and what losing a device does to it.
 *
 * A synced passkey (iCloud キーチェーン, Google パスワードマネージャー) is kept, encrypted end to
 * end, in the reader's account and copied to their other devices; losing one phone leaves it on
 * the rest, and a new phone gets it back by signing in. A passkey on a security key is never
 * copied, so losing the key loses that passkey. Signing in on someone else's computer with a
 * phone's QR code uses the phone's passkey without copying it to the computer.
 */

import { clientEntry, css, type Handle, on } from "@remix-run/component";

import { Actor, chooserStyle, Token, Verdict } from "../../ui/passkey_art.tsx";
import {
  buttonStyle,
  captionStyle,
  dangerStyle,
  emphasize,
  primaryStyle,
} from "../../ui/controls.tsx";
import { Icon, type IconName } from "../../ui/icons.tsx";

type Keeper = "apple" | "google" | "key";
type Event = "start" | "lost" | "restored" | "borrow";

interface KeeperInfo {
  label: string;
  /** The account the passkeys sync through, or null for none. */
  cloud: string | null;
  devices: { name: string; icon: IconName }[];
  /** The device the "lost" button loses, and its replacement. */
  replacement: string;
}

const keepers: Record<Keeper, KeeperInfo> = {
  apple: {
    label: "iCloud キーチェーン",
    cloud: "Apple アカウントの iCloud キーチェーン",
    devices: [
      { name: "iPhone", icon: "phone" },
      { name: "Mac", icon: "monitor" },
    ],
    replacement: "新しい iPhone",
  },
  google: {
    label: "Google パスワードマネージャー",
    cloud: "Google アカウントの Google パスワードマネージャー",
    devices: [
      { name: "Android スマホ", icon: "phone" },
      { name: "パソコンの Chrome", icon: "monitor" },
    ],
    replacement: "新しい Android スマホ",
  },
  key: {
    label: "セキュリティキー（同期しない）",
    cloud: null,
    devices: [{ name: "セキュリティキー", icon: "key" }],
    replacement: "新しいセキュリティキー",
  },
};

function caption(k: Keeper, e: Event): string {
  const info = keepers[k];
  if (k === "key") {
    switch (e) {
      case "start":
        return "USBやNFCでつなぐ小さな鍵の機械。パスキーは<この1本の中だけ>にあって、ほかへコピーされない。";
      case "lost":
        return "なくすと、<この中のパスキーは使えなくなる>。だから、もう1本のキーやスマホのパスキーも登録しておくのがおすすめ。";
      case "restored":
        return "新しいキーを買っても、<前のパスキーはもどらない>。登録しておいたほかのパスキーなどでログインして、新しいキーを登録し直す。";
      case "borrow":
        return "";
    }
  }
  const [first, second] = info.devices;
  switch (e) {
    case "start":
      return `${first.name}で作ったパスキーは、<${info.label}>に暗号化したまま保存され、同じアカウントの<${second.name}>にも同期される。`;
    case "lost":
      return `${first.name}をなくしても、<${second.name}にはパスキーが残っている>。なくした${first.name}は、アカウントから外したり、遠くから消したりしておこう。`;
    case "restored":
      return `<${info.replacement}>で同じアカウントにサインインし直すと、パスキーが<同期でもどってくる>。サイトに登録し直さなくてよい。`;
    case "borrow":
      return `友だちのパソコンでログインするときは、画面の<QRコードを自分の${first.name}で読む>。近くにいることを<Bluetooth>で確かめてから、${first.name}がしるしをつける。パスキーは友だちのパソコンに<コピーされない>。`;
  }
}

export const SyncLab = clientEntry(
  import.meta.url,
  function SyncLab(handle: Handle) {
    let keeper: Keeper = "apple";
    let event: Event = "start";

    const choose = (k: Keeper) => {
      keeper = k;
      event = "start";
      handle.update();
    };
    const happen = (e: Event) => {
      event = e;
      handle.update();
    };

    return () => {
      const info = keepers[keeper];
      const synced = info.cloud !== null;
      const lost = event === "lost" || event === "restored";
      const [first, ...rest] = info.devices;
      return (
        <div>
          <div
            mix={chooserStyle}
            role="group"
            aria-label="パスキーのしまい場所"
          >
            {(["apple", "google", "key"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={keeper === k ? "true" : "false"}
                mix={[
                  buttonStyle,
                  smallStyle,
                  keeper === k ? primaryStyle : null,
                  on("click", () => choose(k)),
                ]}
              >
                {keepers[k].label}
              </button>
            ))}
          </div>

          <div mix={sceneStyle} key={`${keeper}-${event}`}>
            {synced
              ? (
                <div mix={cloudRowStyle}>
                  <Actor
                    tone="cloud"
                    name={info.cloud!}
                    note="暗号化したまま保存。中身は Apple や Google にも読めない"
                  >
                    <Token kind="secret">パスキー（暗号化ずみ）</Token>
                  </Actor>
                </div>
              )
              : null}

            <div mix={devicesStyle}>
              <Actor
                tone={lost ? "bad" : "device"}
                name={lost ? `${first.name}（なくした）` : first.name}
                icon={first.icon}
                dim={lost}
              >
                {lost
                  ? <Token kind="ng" struck>パスキー</Token>
                  : <Token kind="secret">パスキー</Token>}
              </Actor>
              {rest.map((d) => (
                <Actor
                  key={d.name}
                  tone="device"
                  name={d.name}
                  icon={d.icon}
                  active={event === "lost"}
                >
                  <Token kind="secret">パスキー（同期）</Token>
                </Actor>
              ))}
              {event === "restored"
                ? (
                  <Actor
                    tone={synced ? "device" : "you"}
                    name={info.replacement}
                    icon={first.icon}
                    active
                  >
                    {synced
                      ? (
                        <Token kind="secret" fresh>
                          パスキー（同期でもどった）
                        </Token>
                      )
                      : (
                        <Verdict ok={false}>
                          前のパスキーは入っていない
                        </Verdict>
                      )}
                  </Actor>
                )
                : null}
              {event === "borrow"
                ? (
                  <Actor
                    tone="you"
                    name="友だちのパソコン"
                    icon="monitor"
                    active
                  >
                    <Token kind="challenge">QRコードを表示</Token>
                    <Token kind="ng">パスキーは入らない</Token>
                    <Verdict ok>{first.name}のしるしでログイン</Verdict>
                  </Actor>
                )
                : null}
            </div>
          </div>

          <p mix={captionStyle} key={`c-${keeper}-${event}`} aria-live="polite">
            {emphasize(caption(keeper, event))}
          </p>

          <div mix={chooserStyle}>
            <button
              type="button"
              mix={[
                buttonStyle,
                dangerStyle,
                on("click", () => happen("lost")),
              ]}
              disabled={lost}
            >
              <Icon name="alert" /> {first.name}をなくす
            </button>
            <button
              type="button"
              mix={[buttonStyle, on("click", () => happen("restored"))]}
              disabled={event !== "lost"}
            >
              <Icon name={first.icon} /> {info.replacement}を用意する
            </button>
            {synced
              ? (
                <button
                  type="button"
                  mix={[buttonStyle, on("click", () => happen("borrow"))]}
                >
                  <Icon name="qr" /> 友だちのパソコンでログイン
                </button>
              )
              : null}
            <button
              type="button"
              mix={[buttonStyle, on("click", () => happen("start"))]}
            >
              <Icon name="restart" /> さいしょから
            </button>
          </div>
        </div>
      );
    };
  },
);

const smallStyle = css({
  minHeight: "2.5rem",
  padding: "0.3rem 0.9rem",
  fontSize: "0.9rem",
});

const sceneStyle = css({ display: "grid", gap: "0.6rem" });

const cloudRowStyle = css({ display: "grid" });

const devicesStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(12rem, 100%), 1fr))",
  gap: "0.5rem",
});
