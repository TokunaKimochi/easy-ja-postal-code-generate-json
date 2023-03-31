# easy-ja-postal-code-generate-json [![npm version](https://img.shields.io/npm/v/easy-ja-postal-code-generate-json.svg?style=flat)](https://www.npmjs.com/package/easy-ja-postal-code-generate-json)

# Features

- 郵便局のサイトから最新の郵便番号データをダウンロード＆json に変換
- ファイルが 10MB 以上と重い為、郵便番号の上３桁ごとに json ファイルを分割しています。
- 外部データではなく、自サーバーで住所データが管理できます。

# Recommendation

**easy-ja-postal-code-search-address**<br>
こちらのパッケージと合わせて使う事をオススメします<br>
https://www.npmjs.com/package/easy-ja-postal-code-search-address

# Data

日本郵便の全国一括版住所の csv データを使用して加工します。<br>
<a href="https://www.post.japanpost.jp/zipcode/dl/oogaki-zip.html" target="_blank">https://www.post.japanpost.jp/zipcode/dl/oogaki-zip.html</a>

# Requirement

- Node.js: v18.13.0

# Usage

```bash
npx ejpc-generate-json -d "assets/json/zip" -t
```

このように index ファイルと頭３桁の数字のファイルが生成されます。

```bash

├── 001.json
├── 002.json
├── 003.json
〜
〜
├── 998.json
├── 999.json
├── _time.json
└── index.json

```

```bash

# index.json
# 頭3桁の配列

[
  "001",
  "002",
  "003",
  〜
]
```

```bash

# 001.json

[
  {
    "zip": "0010000",
    "prefectures": "北海道",
    "city": "札幌市北区",
    "other": ""
  },
  {
    "zip": "0010045",
    "prefectures": "北海道",
    "city": "札幌市北区",
    "other": "麻生町"
  },
  {
    "zip": "0010010",
    "prefectures": "北海道",
    "city": "札幌市北区",
    "other": "北十条西（１～４丁目）"
  },
  〜
  〜
]
```

# option

| パラメータ | 説明                                             | default                                           |
| ---------- | ------------------------------------------------ | ------------------------------------------------- |
| -u         | csv のダウンロード元の URL（基本変更の必要無し） | (日本郵便の公式サイトの全国版の zip ファイル URL) |
| -d         | 生成した json の出力先ディレクトリ               | json/zip                                          |
| -t         | 生成したタイムスタンプを入力した json も出力     | false                                             |

# Author

- https://twitter.com/resistance_gowy
- go.nishiduka.1985@gmail.com

# License

"easy-ja-postal-code-generate-json" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
