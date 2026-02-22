# TODO App

個人用のタスク管理アプリケーション。React + TypeScript + Tailwind CSS + Node.js + Express + MongoDBで構築されています。

## 機能

- ✅ TODOの追加・編集・削除
- ✅ 完了/未完了の切り替え
- ✅ 期限設定と期限切れ警告
- ✅ 優先度設定（高/中/低）と色分け表示
- ✅ 期限順・優先度順のソート
- ✅ ドラッグ&ドロップによる並び替え
- ✅ スムーズなアニメーション効果
- ✅ MongoDBへのデータ永続化

## 技術スタック

### フロントエンド
- React 18.2.0
- TypeScript 5.2.2
- Tailwind CSS 3.4.1
- Vite 5.0.8
- Framer Motion 11.0.0
- @dnd-kit 6.1.0

### バックエンド
- Node.js
- Express 4.18.2
- MongoDB (Mongoose 8.1.0)
- TypeScript 5.3.3

## セットアップ

### 前提条件
- Node.js 20.x 以上
- MongoDB（ローカルまたはMongoDB Atlas）
- Make（オプション、推奨）

### クイックスタート（Makeを使用）

```bash
# リポジトリのクローン
git clone <repository-url>
cd claude-project

# 全依存パッケージをインストール
make install

# 環境変数ファイルを作成
make setup-env

# .env と server/.env を編集してMongoDB URIなどを設定

# 開発サーバーを起動（別々のターミナルで実行）
make dev-server  # ターミナル1
make dev-client  # ターミナル2
```

### 手動セットアップ

#### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd claude-project
```

#### 2. フロントエンドのセットアップ
```bash
# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してAPI URLを設定
```

#### 3. バックエンドのセットアップ
```bash
cd server

# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してMongoDB URIとポートを設定
```

### 4. MongoDBの準備

#### ローカルMongoDBを使用する場合
```bash
# MongoDBをインストールして起動
mongod
```

#### MongoDB Atlasを使用する場合
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)でアカウント作成
2. クラスターを作成
3. 接続文字列を取得
4. `server/.env`の`MONGODB_URI`に接続文字列を設定

## 実行方法

### Makeコマンド（推奨）

すべてのコマンドを確認:
```bash
make help
```

#### 開発モード
```bash
# バックエンドを起動（ターミナル1）
make dev-server

# フロントエンドを起動（ターミナル2）
make dev-client
```

#### ビルド
```bash
# 全ビルド
make build

# フロントエンドのみ
make build-client

# バックエンドのみ
make build-server
```

#### テスト・リント
```bash
make test
make lint
```

#### Docker
```bash
# Dockerイメージをビルド
make docker-build

# Dockerコンテナを起動
make docker-run
```

#### デプロイ
```bash
make deploy
```

#### クリーンアップ
```bash
make clean
```

### 手動実行

#### 開発モード

**バックエンドの起動:**
```bash
cd server
npm run dev
```

サーバーは `http://localhost:5000` で起動します。

**フロントエンドの起動:**
```bash
npm run dev
```

フロントエンドは `http://localhost:5173` で起動します。

#### プロダクションビルド

**フロントエンド:**
```bash
npm run build
npm run preview
```

**バックエンド:**
```bash
cd server
npm run build
npm start
```

#### テスト
```bash
npm test
```

## API エンドポイント

- `GET /api/todos` - 全TODO取得
- `POST /api/todos` - TODO作成
- `PUT /api/todos/:id` - TODO更新
- `DELETE /api/todos/:id` - TODO削除
- `GET /health` - ヘルスチェック

## デプロイ

### Google Cloud Run へのデプロイ

本番環境は Google Cloud Run にデプロイされます。

#### 前提条件
- Google Cloud アカウント
- gcloud CLI
- MongoDB Atlas クラスター

#### デプロイ手順

```bash
make deploy
```

詳細な手順は [DEPLOY.md](./DEPLOY.md) を参照してください。

## ライセンス

MIT

## プロジェクト構造

```
claude-project/
├── src/                    # フロントエンドソース
│   ├── components/         # Reactコンポーネント
│   │   ├── TodoForm.tsx   # TODO入力フォーム
│   │   ├── TodoItem.tsx   # 個別のTODOアイテム
│   │   └── TodoList.tsx   # TODOリスト表示
│   ├── services/           # API通信
│   │   └── api.ts         # APIクライアント
│   ├── types/              # TypeScript型定義
│   │   └── todo.ts        # Todo型
│   ├── App.tsx             # メインアプリ
│   └── main.tsx            # エントリポイント
├── server/                 # バックエンド
│   └── src/
│       ├── config/         # データベース設定
│       │   └── database.ts
│       ├── models/         # Mongooseモデル
│       │   └── Todo.ts
│       ├── routes/         # APIルート
│       │   └── todos.ts
│       └── index.ts        # サーバーエントリポイント
├── tailwind.config.js      # Tailwind設定
├── TODO.md                 # 実行計画
└── README.md               # このファイル
```
