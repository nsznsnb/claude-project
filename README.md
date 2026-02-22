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

## GitHub Pagesへのデプロイ

### 自動デプロイ（推奨）

このプロジェクトはGitHub Actionsを使用した自動デプロイに対応しています。

1. GitHubリポジトリの設定で、Pages機能を有効化してください
   - Settings → Pages → Source: "GitHub Actions" を選択

2. `main`ブランチにプッシュすると、自動的にビルドとデプロイが実行されます

3. デプロイ完了後、`https://<username>.github.io/claude-project/` でアクセスできます

### 手動デプロイ

```bash
npm run deploy
```

**注意:** `vite.config.ts` の `base` 設定をあなたのリポジトリ名に合わせて変更してください。

```typescript
export default defineConfig({
  base: '/your-repository-name/',
  // ...
})
```

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
