# Present Compass

友達・親友との思い出や特徴を入力すると、AI（Gemini API）が文脈を分析して
プレゼント案と推薦理由を提案するWebツールのMVPです。

## セットアップ

1. 依存関係をインストール

```bash
npm install
```

2. Gemini APIキーを設定

[Google AI Studio](https://aistudio.google.com/apikey) でAPIキーを取得し、
`.env.local.example` を `.env.local` にコピーして値を設定してください。

```bash
cp .env.local.example .env.local
```

```
GEMINI_API_KEY=あなたのAPIキー
```

Amazonアソシエイト・楽天アフィリエイトのIDをお持ちの場合は、同じ`.env.local`に
`AMAZON_ASSOCIATE_TAG` / `RAKUTEN_AFFILIATE_ID` を追加すると、各プレゼント案の
「Amazonで探す」「楽天で探す」リンクにアフィリエイトタグが自動で付与されます。
未設定の場合も通常の検索リンクとして機能します。

3. 開発サーバーを起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) にアクセスして確認できます。

## ディレクトリ構成

- `app/page.tsx` … 画面フロー（入力→生成中→結果／エラー）を管理するメインページ
- `app/api/generate-gifts/route.ts` … AIへの提案生成リクエストを処理するAPI Route
- `lib/relationships/` … 関係性（友達・親友など）ごとの入力項目・プロンプト設定。
  将来「恋人向け」等を追加する場合は、ここに設定ファイルを追加するだけで拡張できます。
- `lib/ai/` … Gemini APIクライアント、プロンプト構築、出力スキーマ定義
- `lib/validation/` … 関係性設定から動的に入力検証スキーマを組み立てるロジック
- `components/` … フォーム・カード・ローディング・エラー表示のUIコンポーネント

## 主な仕様

- エピソード入力は10〜500文字
- プレゼント提案はAIが3〜5件を生成し、JSON Schemaで出力形式を強制
- 「別の案をもらう」ボタンは1セッションあたり3回まで
- API応答が30秒を超えるとタイムアウトしエラー表示
