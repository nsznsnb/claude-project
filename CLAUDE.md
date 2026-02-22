# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

個人用のタスク管理ツールとして開発されたTODOアプリケーションです。
React + TypeScript + Viteを使用し、シンプルで使いやすいインターフェースを提供します。

### 主な目的
- 個人の日常的なタスク管理
- 実用的なタスク管理ツールとしての運用

## Current Features

### 実装済み機能
- **TODOの追加**: テキスト入力フォームから新しいタスクを追加
- **完了/未完了の切り替え**: チェックボックスでタスクの状態を管理
- **TODOの削除**: ゴミ箱アイコン（react-icons）でタスクを削除
- **完了数の表示**: 「完了: X / Y」形式で進捗を表示
- **データの永続化**: 現在はlocalStorageを使用（MongoDB移行予定）

### UI/UX
- プライマリカラー（#646cff）を使用した統一されたデザイン
- react-iconsライブラリを使用したアイコン表示
- レスポンシブデザイン対応

## Planned Features

### 今後追加予定の機能

#### 優先度：高
1. **TODOの編集機能**
   - 既存タスクのテキストを後から編集
   - インライン編集またはモーダル形式での編集

2. **期限設定**
   - 各タスクに期限日時を設定
   - 期限切れタスクの警告表示
   - 期限順でのソート機能

3. **優先度設定**
   - タスクに優先度（高/中/低）を設定
   - 優先度による色分け表示
   - 優先度順でのソート機能

#### 優先度：中
4. **ドラッグ&ドロップ**
   - タスクの並び替えをドラッグ&ドロップで実現
   - react-beautiful-dnd または @dnd-kit の使用を検討

5. **アニメーション効果**
   - タスク追加/削除時のスムーズなアニメーション
   - Framer Motion または CSS Transitionsの使用を検討

## Architecture

### Technology Stack

#### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.2.2
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS
- **Icons**: react-icons 5.0.1
- **Testing**: Vitest + React Testing Library

#### Backend（計画中）
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB
- **ODM**: Mongoose（予定）

#### Deployment
- **Current**: Vercel + GitHub Pages（開発・テスト環境）
- **Production**: Google Cloud Run（本番環境）

### Project Structure

```
src/
├── components/          # Reactコンポーネント
│   ├── TodoForm.tsx    # TODO入力フォーム
│   ├── TodoItem.tsx    # 個別のTODOアイテム表示
│   └── TodoList.tsx    # TODOリスト表示
├── types/              # TypeScript型定義
│   └── todo.ts         # Todo型の定義
├── test/               # テスト設定
│   └── setup.ts        # Vitestセットアップ
├── App.tsx             # メインアプリケーション
├── main.tsx            # エントリーポイント
├── index.css           # Tailwind CSSディレクティブ
└── vite-env.d.ts       # Vite環境変数型定義
```

### Data Models

#### Todo Type
```typescript
interface Todo {
  id: string;              // UUID
  text: string;            // タスクの内容
  completed: boolean;      // 完了状態
  createdAt: Date;         // 作成日時
  // 今後追加予定
  // dueDate?: Date;       // 期限
  // priority?: 'high' | 'medium' | 'low'; // 優先度
}
```

### State Management
- 現在: React Hooks (useState) によるローカル状態管理
- 将来: バックエンド連携時にReact QueryまたはSWRの導入を検討

### Data Persistence

#### 現在（localStorage）
```typescript
// 保存
localStorage.setItem('todos', JSON.stringify(todos))

// 読み込み
const stored = localStorage.getItem('todos')
const todos = stored ? JSON.parse(stored) : []
```

#### 今後（MongoDB）
- Node.js + Express でREST APIを構築
- CRUD操作のエンドポイント実装
  - `GET /api/todos` - 全TODO取得
  - `POST /api/todos` - TODO作成
  - `PUT /api/todos/:id` - TODO更新
  - `DELETE /api/todos/:id` - TODO削除
- 認証機能は不要（個人使用のため）

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev          # Start development server at http://localhost:5173
```

### Build
```bash
npm run build        # Build for production (runs tsc && vite build)
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run all tests with Vitest
npm test -- <file>   # Run specific test file
```

### Linting
```bash
npm run lint         # Run ESLint
```

### Deployment
```bash
npm run deploy       # Build and deploy to gh-pages (manual)
```

## Testing Guidelines

### Test Implementation Principles
- Tests must verify actual functionality, never use meaningless assertions like `expect(true).toBe(true)`
- Follow Red-Green-Refactor: start with failing tests
- Test boundary values, edge cases, and error scenarios
- Keep mocks minimal - test close to real behavior
- Test names must clearly describe what is being tested

### Strictly Forbidden
- **NO hardcoding** values in production code just to make tests pass
- **NO test mode conditionals** (e.g., `if(testMode)`) in production code
- **NO magic numbers** or special test values embedded in production code
- Use environment variables or configuration files to properly separate test and production environments

### Before Writing Tests
- Fully understand the feature specification
- Ask for clarification rather than making assumptions
- Focus on quality over coverage metrics

### Test Files
- `src/components/TodoForm.test.tsx` - フォーム入力、バリデーション、送信処理のテスト
- `src/components/TodoItem.test.tsx` - チェックボックス、削除ボタン、表示状態のテスト
- `src/components/TodoList.test.tsx` - リスト表示、空状態のテスト
- `src/App.test.tsx` - アプリ全体の統合テスト、localStorage連携のテスト

## Deployment Configuration

### Environment-Specific Base Path
```typescript
// vite.config.ts
base: process.env.GITHUB_PAGES === 'true' ? '/claude-project/' : '/'
```

- **Vercel**: base path = `/`
- **GitHub Pages**: base path = `/claude-project/`

### Build Optimization
- TypeScript strict mode有効
- テストファイルはビルド対象から除外（tsconfig.json）
- Tailwind CSSのプロダクションビルド最適化

### Google Cloud Run Deployment
- **Dockerfile**: Node.js環境でアプリケーションをビルド・実行
- **Cloud Build**: GitHubリポジトリと連携した自動ビルド
- **環境変数**: MongoDB接続文字列などの機密情報を管理
- **コンテナレジストリ**: Artifact Registryにイメージを保存
- **スケーリング**: オートスケーリング設定（最小0、最大10インスタンス）

## Migration Roadmap

### Phase 1: 機能拡張（現行のlocalStorage版）
1. TODOの編集機能実装
2. 期限設定機能追加
3. 優先度設定機能追加
4. ドラッグ&ドロップ実装
5. アニメーション追加

### Phase 2: バックエンド統合
1. Node.js + Express APIサーバー構築
2. MongoDB接続とスキーマ設計
3. CRUD API実装
4. フロントエンドとAPIの統合
5. エラーハンドリングとローディング状態の追加

### Phase 3: Tailwind CSS移行
1. Tailwind CSSのセットアップ
2. CSS Modulesからの段階的移行
3. 既存コンポーネントのスタイル書き換え
4. カスタムテーマの設定

### Phase 4: Google Cloud Run デプロイ
1. Dockerfileの作成
2. Cloud Build設定（cloudbuild.yaml）
3. 環境変数の設定
4. CI/CDパイプラインの構築
5. バックエンドAPIのデプロイ

## Development Notes

### Code Style
- Functional Components with Hooks
- TypeScript strict mode
- Tailwind CSS for component styling
- Explicit prop types with interfaces

### Naming Conventions
- Components: PascalCase (e.g., `TodoItem.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useTodos`)
- Tailwind classes: utility-first approach
- Types/Interfaces: PascalCase (e.g., `Todo`, `TodoItemProps`)

### Git Commit Message Format
```
<type>: <subject>

<body>

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

Types: feat, fix, docs, style, refactor, test, chore

## Notes
- このファイルはプロジェクトの進化に合わせて更新してください
- 新しい機能追加時は、該当セクションに詳細を追記してください
- アーキテクチャの変更があった場合は、必ずドキュメントを更新してください
