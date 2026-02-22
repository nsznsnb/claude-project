# マルチステージビルド: フロントエンドビルドステージ
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# フロントエンドの依存関係をインストール
COPY package*.json ./
RUN npm ci

# フロントエンドのソースコードをコピー
COPY . .

# フロントエンドをビルド
RUN npm run build

# マルチステージビルド: バックエンドビルドステージ
FROM node:20-alpine AS backend-builder

WORKDIR /app/server

# バックエンドの依存関係をインストール
COPY server/package*.json ./
RUN npm ci

# バックエンドのソースコードをコピー
COPY server/ ./

# バックエンドをビルド
RUN npm run build

# 実行ステージ
FROM node:20-alpine

WORKDIR /app

# 本番用の依存関係のみインストール
COPY server/package*.json ./
RUN npm ci --omit=dev

# ビルド済みバックエンドをコピー
COPY --from=backend-builder /app/server/dist ./dist

# ビルド済みフロントエンドをコピー（静的ファイルとして配信）
COPY --from=frontend-builder /app/dist ./public

# 環境変数
ENV NODE_ENV=production

# ポート公開（Cloud RunがPORT環境変数を自動設定）
EXPOSE 8080

# アプリケーション起動
CMD ["node", "dist/index.js"]
