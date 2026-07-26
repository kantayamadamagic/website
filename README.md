# website

山田寛太のポートフォリオサイト。ビルドツールを使わない素の HTML / CSS / JavaScript で作っています。

公開URL: https://kantayamadamagic.github.io/website/

## ページ構成

| パス | 内容 |
| --- | --- |
| `index.html` | トップページ。プロフィールと各ページへの導線、News 一覧 |
| `pages/art.html` | 好きな絵画の紹介 |
| `pages/music.html` | 好きなミュージシャンの紹介。アルバム名をクリックすると曲目が開く |
| `chess/index.html` | コンピュータと対戦できるチェス |

## ディレクトリ

```
css/style_home.css   共通スタイル（body・ナビ・ダークモード・カードなど）
js/theme.js          テーマの復元。ちらつき防止のため各ページの <head> で同期読み込み
js/script_home.js    ダークモード切替・ハンバーガーメニュー・アルバムの開閉
images/              画像とファビコン
chess/               チェス専用の HTML / CSS / JS
```

## ローカルでの確認

`chess/js/script.js` が ES モジュールなので、`file://` で直接開くと動きません。簡易サーバ経由で開いてください。

```bash
python3 -m http.server 8000
# http://localhost:8000/ をブラウザで開く
```

## ダークモード

各ページ右上のボタンで切り替えます。選択は `localStorage` の `theme` に保存され、ページを移動しても維持されます。未設定の場合は OS の設定（`prefers-color-scheme`）に従います。

実装上は `<html>` に `dark-mode` クラスを付け外しし、CSS 側は `.dark-mode ...` で色を上書きしています。

## チェス

- 盤面UI: [cm-chessboard](https://github.com/shaack/cm-chessboard)、合法手判定と棋譜: [chess.js](https://github.com/jhlywa/chess.js)（どちらも CDN から読み込み）
- コンピュータの手は [chess-api.com](https://chess-api.com/) に現在の FEN を送って取得
- 難易度は探索深さ（Easy=1 / Normal=4 / Hard=9 / Expert=15）で調整。Easy と Normal では一定確率で API を使わずランダムな合法手を指す

## デプロイ

`main` に push すると `.github/workflows/deploy-pages.yml` が GitHub Pages へ自動デプロイします。
