# TODO.md - 実行計画

このファイルは、TODOアプリケーションの開発・移行タスクを管理します。

## Phase 1: 機能拡張（現行のlocalStorage版）

### 1.1 TODOの編集機能実装
- [x] 編集モードの状態管理を追加
- [x] インライン編集UIの実装
- [x] 編集時のバリデーション追加
- [ ] 編集機能のテスト作成
- [x] Todo型に更新日時（updatedAt）フィールドを追加

### 1.2 期限設定機能追加
- [x] Todo型にdueDate（期限）フィールドを追加
- [x] 日付入力UIコンポーネントの作成
- [x] 期限切れタスクの警告表示機能
- [x] 期限順ソート機能の実装
- [ ] 期限設定のテスト作成

### 1.3 優先度設定機能追加
- [x] Todo型にpriorityフィールドを追加（'high' | 'medium' | 'low'）
- [x] 優先度選択UIの実装
- [x] 優先度による色分け表示
- [x] 優先度順ソート機能の実装
- [ ] 優先度設定のテスト作成

### 1.4 ドラッグ&ドロップ実装
- [x] @dnd-kit または react-beautiful-dnd のインストール
- [x] ドラッグ可能なTodoItemの実装
- [x] ドロップ時の並び替えロジック実装
- [x] 並び順の永続化（localStorage）
- [ ] ドラッグ&ドロップのテスト作成

### 1.5 アニメーション追加
- [x] アニメーションライブラリの選定（Framer Motion or CSS Transitions）
- [x] タスク追加時のアニメーション実装
- [x] タスク削除時のアニメーション実装
- [x] 完了/未完了切り替え時のアニメーション
- [ ] パフォーマンステスト

---

## Phase 2: Tailwind CSS移行

### 2.1 Tailwind CSSセットアップ
- [x] tailwindcss、postcss、autoprefixerのインストール
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [x] tailwind.config.jsの設定
  ```js
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
  ```
- [x] src/index.cssにTailwindディレクティブを追加
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- [x] カスタムカラー設定（primary: #646cff）

### 2.2 既存CSS Modulesの移行
- [x] TodoForm.module.css → Tailwindクラスに変換
- [x] TodoItem.module.css → Tailwindクラスに変換
- [x] TodoList.module.css → Tailwindクラスに変換
- [x] App.css → Tailwindクラスに変換

### 2.3 不要ファイルの削除
- [x] src/components/TodoForm.module.css の削除
- [x] src/components/TodoItem.module.css の削除
- [x] src/components/TodoList.module.css の削除
- [x] src/App.css の削除（必要に応じて）
- [x] CSS Modules関連のimport文の削除

### 2.4 テストの更新
- [ ] スタイルクラス名のテストを更新
- [ ] Tailwindクラスの存在確認テストに変更
- [ ] 全テストの動作確認

---

## Phase 3: バックエンド統合（Node.js + Express + MongoDB）

### 3.1 バックエンドプロジェクトのセットアップ
- [x] server/ ディレクトリの作成
- [x] package.json の作成（バックエンド用）
- [x] 必要なパッケージのインストール
  ```bash
  npm install express mongoose cors dotenv
  npm install -D @types/express @types/cors nodemon typescript
  ```
- [x] TypeScript設定（tsconfig.json for server）
- [x] .env ファイルの作成（MONGODB_URI, PORT）

### 3.2 MongoDB接続とスキーマ設計
- [ ] MongoDB Atlasアカウント作成 or ローカルMongoDB起動
- [x] Mongoose接続設定
- [x] Todoスキーマの定義
  ```typescript
  {
    text: String,
    completed: Boolean,
    createdAt: Date,
    updatedAt: Date,
    dueDate: Date (optional),
    priority: String (optional)
  }
  ```
- [ ] データベース接続テスト

### 3.3 REST API実装
- [x] `GET /api/todos` - 全TODO取得
- [x] `POST /api/todos` - TODO作成
- [x] `PUT /api/todos/:id` - TODO更新
- [x] `DELETE /api/todos/:id` - TODO削除
- [x] CORS設定
- [x] エラーハンドリングミドルウェア
- [x] バリデーションミドルウェア

### 3.4 API統合テスト
- [ ] Postman or Insomnia でAPIテスト
- [ ] エラーケースのテスト
- [ ] バリデーションのテスト

### 3.5 フロントエンドとの統合
- [x] axios or fetch でのAPI通信設定
- [x] 環境変数でAPI URLを管理（.env）
- [x] CRUD操作をAPI呼び出しに変更
- [x] ローディング状態の追加
- [x] エラーハンドリングの追加
- [ ] React Query or SWR の導入検討

### 3.6 localStorage移行
- [x] localStorage読み込みロジックの削除
- [x] localStorage保存ロジックの削除
- [ ] データ移行スクリプトの作成（必要に応じて）
- [x] localStorage関連コードの完全削除

---

## Phase 4: Google Cloud Run デプロイ

### 4.1 Dockerfileの作成
- [x] マルチステージビルドのDockerfile作成
  - ビルドステージ（npm run build）
  - 実行ステージ（Node.js + 静的ファイル配信）
- [x] .dockerignore の作成
- [ ] ローカルでDockerイメージのビルド・テスト
  ```bash
  docker build -t todo-app .
  docker run -p 8080:8080 todo-app
  ```

### 4.2 Google Cloud プロジェクト設定
- [x] Google Cloud プロジェクトの作成（todo-app-488204）
- [ ] Billing（課金）の有効化
- [ ] Cloud Run API の有効化
- [ ] Artifact Registry API の有効化
- [ ] Cloud Build API の有効化
- [ ] gcloud CLI のインストール・認証
  ```bash
  gcloud auth login
  gcloud config set project todo-app-488204
  ```

### 4.3 Artifact Registryの設定
- [x] Docker リポジトリの作成（デプロイスクリプトに含む）
  ```bash
  gcloud artifacts repositories create todo-app-repo \
    --repository-format=docker \
    --location=asia-northeast1
  ```
- [x] Docker認証設定（デプロイスクリプトに含む）
  ```bash
  gcloud auth configure-docker asia-northeast1-docker.pkg.dev
  ```

### 4.4 Cloud Build設定
- [x] cloudbuild.yaml の作成
  ```yaml
  steps:
    - name: 'gcr.io/cloud-builders/docker'
      args: ['build', '-t', 'asia-northeast1-docker.pkg.dev/$PROJECT_ID/todo-app-repo/todo-app:$COMMIT_SHA', '.']
    - name: 'gcr.io/cloud-builders/docker'
      args: ['push', 'asia-northeast1-docker.pkg.dev/$PROJECT_ID/todo-app-repo/todo-app:$COMMIT_SHA']
  ```
- [ ] GitHub リポジトリとの連携設定
- [ ] トリガーの作成（main ブランチへのpush時）

### 4.5 環境変数・シークレット管理
- [ ] Secret Manager の設定
- [ ] MongoDB接続文字列の登録
- [x] Cloud Run での環境変数設定（cloudbuild.yamlに含む）

### 4.6 Cloud Run デプロイ
- [x] Makefileにデプロイコマンドを統合
  ```bash
  make deploy
  ```
- [x] オートスケーリング設定（min: 0, max: 10）
- [x] メモリ・CPU設定の最適化
- [ ] カスタムドメインの設定（必要に応じて）

### 4.7 CI/CDパイプライン構築
- [ ] GitHub Actions または Cloud Build トリガーの設定
- [ ] 自動テスト → ビルド → デプロイのフロー構築
- [ ] デプロイ通知の設定

### 4.8 不要な設定・ファイルの削除
- [x] .github/workflows/deploy.yml の削除（GitHub Pages用）
- [x] vercel.json の削除
- [x] package.json の "deploy" スクリプト削除
- [x] gh-pages パッケージの削除
  ```bash
  npm uninstall gh-pages
  ```
- [x] vite.config.ts の base path 設定を '/' に固定
- [x] GITHUB_PAGES環境変数の条件分岐削除

---

## Phase 5: 監視・運用

### 5.1 ログとモニタリング
- [ ] Cloud Logging の設定
- [ ] エラーログの確認・アラート設定
- [ ] パフォーマンスモニタリング

### 5.2 バックアップ
- [ ] MongoDB Atlas の自動バックアップ設定
- [ ] リストア手順のドキュメント化

### 5.3 ドキュメント更新
- [ ] CLAUDE.md の最終更新（本番環境情報を反映）
- [ ] README.md の更新（デプロイURL、使い方など）
- [ ] API ドキュメントの作成（必要に応じて）

---

## 完了基準

各フェーズ完了時のチェックリスト：

### Phase 1 完了基準
- [ ] 全機能が動作し、テストが通過
- [ ] localStorageに全データが正しく保存される
- [ ] UI/UXが直感的で使いやすい

### Phase 2 完了基準
- [ ] 全コンポーネントがTailwind CSSで実装
- [ ] CSS Modulesファイルが完全削除
- [ ] ビルドサイズが最適化されている
- [ ] 全テストが通過

### Phase 3 完了基準
- [ ] バックエンドAPIが正常動作
- [ ] フロントエンドがAPIと統合
- [ ] エラーハンドリングが適切
- [ ] localStorage依存が完全削除

### Phase 4 完了基準
- [ ] Google Cloud Run で本番稼働
- [ ] CI/CDが自動化
- [ ] 不要な設定ファイルが削除
- [ ] Vercel/GitHub Pages設定が削除

### Phase 5 完了基準
- [ ] ログとモニタリングが稼働
- [ ] バックアップが設定済み
- [ ] ドキュメントが最新
