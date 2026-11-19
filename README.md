# zukai.kbn.one

身のまわりのしくみを、さわって動かせる図で説明する図解集。
1つのリポジトリに、図解ごとのサブディレクトリで並べる。

| 図解                       | パス     | 内容                                                                                                                     |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| 図解AI                     | `/ai/`   | チャットAIの中身（モデル・推論エンジン・ハーネス）、話がまざらないしくみ、ローカルLLM                                    |
| マイナンバーカードのひみつ | `/myna/` | マイナンバーカードのしくみを、小学生にもわかる言葉で（[kuboon/myna-how](https://github.com/kuboon/myna-how) から移した） |

Remix v3 + Deno の静的サイト。GitHub Pages に出す。
[kuboon/deno-remix-tmpl](https://github.com/kuboon/deno-remix-tmpl) から作り、
章の部品は [kuboon/myna-how](https://github.com/kuboon/myna-how) にならった。
開発のルールは [CLAUDE.md](./CLAUDE.md)。
