# PrintTools

ブラウザだけで完結する印刷支援ツール集です。最新のフロントエンドスタックで構築しており、現時点では単一画像を用紙いっぱいにタイル配置して印刷する機能を提供しています。

## セットアップ

```bash
npm install
npm run dev
```

## 利用できる機能

- **画像タイル印刷**: 画像を読み込み、用紙サイズ、向き、余白、タイルサイズ、タイル間の余白をブラウザ上で調整し、そのまま印刷できます。トップページ (`/`) と別ルート (`/image-tiler`) で提供されます。

## プライバシー

- 選択した画像はすべてブラウザ内で処理され、サーバーや外部サービスへ送信されることはありません。

## プロジェクト構成

- `src/pages/ImageTilingPrint.tsx` – タイル印刷ページのロジックと UI
- `src/App.tsx` – 画面全体のルーティングとレイアウト
- `src/App.css` – 全体スタイル

## ビルドと検証

```bash
npm run build
npm run lint
```

## デプロイ

- `main` ブランチに push すると GitHub Actions (`.github/workflows/deploy.yml`) が自動でビルドし、GitHub Pages に公開されます。
- 公開 URL: [https://kododake.github.io/PrintTools/](https://kododake.github.io/PrintTools/)
- ローカル開発時のベースパスは `/` のままですが、デプロイ時は `DEPLOY_TARGET=github-pages` を指定してビルドすることで `/PrintTools/` に自動切り替えされます。

## 印刷のヒント

- ブラウザの印刷ダイアログでは「実際のサイズ」(100%) を選択してください。
- 倍率は「規定」または「100%」に設定し、拡大・縮小が掛からないようにしてください。
- プリンターやブラウザ側の余白設定を「なし」にすると紙いっぱいに並べやすくなります。
- プリンターの余白設定によって、縁なし印刷ができない場合があります。
- 用紙を変更する際は、ブラウザ・プリンター双方で同じ用紙サイズを設定してください。

## Donation 寄付

If you like the application, please consider making a donation:  
寄付してくれるとうれしいお(=^・・^=)  
bitcoin: 
`
bc1qnpqpfq7e8pjtlqj7aa6x2y2c9ctnpts5u9lx7v
`
