# TODO App

React + TypeScript + Viteで作成したシンプルなTODOアプリケーションです。

## 機能

- TODOアイテムの追加
- TODOアイテムの完了/未完了の切り替え
- TODOアイテムの削除
- 完了数の表示
- localStorageへの自動保存

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

## ビルド

```bash
npm run build
```

## テスト

```bash
npm test
```

## デプロイ

### Vercelへのデプロイ（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nsznsnb/claude-project)

#### 手順

1. Vercelアカウントにログイン
2. 上記ボタンをクリックするか、[Vercel Dashboard](https://vercel.com/new)からGitHubリポジトリをインポート
3. プロジェクト名とビルド設定を確認（デフォルト設定で動作します）
4. "Deploy"ボタンをクリック
5. 数分後、デプロイ完了URL（例: `https://your-project.vercel.app`）にアクセス可能

#### Vercel CLIでのデプロイ

```bash
# Vercel CLIのインストール
npm install -g vercel

# デプロイ実行
vercel
```

### GitHub Pagesへのデプロイ

このプロジェクトはGitHub Actionsを使用した自動デプロイにも対応しています。

1. GitHubリポジトリの設定で、Pages機能を有効化
   - Settings → Pages → Source: "GitHub Actions" を選択

2. `vite.config.ts` の `base` 設定を変更:
   ```typescript
   export default defineConfig({
     base: '/claude-project/',  // リポジトリ名に合わせて変更
     // ...
   })
   ```

3. `main`ブランチにプッシュすると、自動的にビルドとデプロイが実行されます

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── TodoForm.tsx    # TODO入力フォーム
│   ├── TodoItem.tsx    # 個別のTODOアイテム
│   └── TodoList.tsx    # TODOリスト表示
├── types/              # TypeScript型定義
│   └── todo.ts         # Todo型
├── App.tsx             # メインアプリケーション
└── main.tsx            # エントリーポイント
```

## 技術スタック

- React 18
- TypeScript
- Vite
- Vitest + React Testing Library (テスト)
- CSS Modules (スタイリング)
