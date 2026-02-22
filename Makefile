.PHONY: help install install-client install-server dev dev-client dev-server build build-client build-server test lint clean deploy docker-build docker-run setup-env

# デフォルトターゲット
help:
	@echo "===== TODO App - 利用可能なコマンド ====="
	@echo ""
	@echo "初期化:"
	@echo "  make install         - 全依存パッケージをインストール"
	@echo "  make install-client  - フロントエンド依存パッケージをインストール"
	@echo "  make install-server  - バックエンド依存パッケージをインストール"
	@echo "  make setup-env       - 環境変数ファイルを作成"
	@echo ""
	@echo "開発:"
	@echo "  make dev             - フロントエンドとバックエンドを同時起動"
	@echo "  make dev-client      - フロントエンド開発サーバーを起動"
	@echo "  make dev-server      - バックエンド開発サーバーを起動"
	@echo ""
	@echo "ビルド:"
	@echo "  make build           - フロントエンドとバックエンドをビルド"
	@echo "  make build-client    - フロントエンドをビルド"
	@echo "  make build-server    - バックエンドをビルド"
	@echo ""
	@echo "テスト・リント:"
	@echo "  make test            - テストを実行"
	@echo "  make lint            - リントを実行"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build    - Dockerイメージをビルド"
	@echo "  make docker-run      - Dockerコンテナを起動"
	@echo ""
	@echo "デプロイ:"
	@echo "  make deploy          - Google Cloud Runにデプロイ"
	@echo ""
	@echo "クリーンアップ:"
	@echo "  make clean           - ビルド成果物を削除"
	@echo ""

# ========================================
# 初期化
# ========================================

install: install-client install-server
	@echo "✅ 全パッケージのインストールが完了しました"

install-client:
	@echo "📦 フロントエンド依存パッケージをインストール中..."
	npm install

install-server:
	@echo "📦 バックエンド依存パッケージをインストール中..."
	cd server && npm install

setup-env:
	@echo "📝 環境変数ファイルを作成中..."
ifeq ($(OS),Windows_NT)
	@if not exist .env copy .env.example .env && echo ✅ .env ファイルを作成しました || echo ⚠️  .env ファイルは既に存在します
	@if not exist server\.env copy server\.env.example server\.env && echo ✅ server\.env ファイルを作成しました || echo ⚠️  server\.env ファイルは既に存在します
else
	@test -f .env || (cp .env.example .env && echo "✅ .env ファイルを作成しました") || echo "⚠️  .env ファイルは既に存在します"
	@test -f server/.env || (cp server/.env.example server/.env && echo "✅ server/.env ファイルを作成しました") || echo "⚠️  server/.env ファイルは既に存在します"
endif

# ========================================
# 開発
# ========================================

dev:
	@echo "🚀 開発サーバーを起動中..."
	@echo "フロントエンド: http://localhost:5173"
	@echo "バックエンド: http://localhost:5000"
	@echo ""
	@echo "注意: フロントエンドとバックエンドを別々のターミナルで起動してください"
	@echo "  ターミナル1: make dev-server"
	@echo "  ターミナル2: make dev-client"

dev-client:
	@echo "🎨 フロントエンド開発サーバーを起動中..."
	npm run dev

dev-server:
	@echo "⚙️  バックエンド開発サーバーを起動中..."
	cd server && npm run dev

# ========================================
# ビルド
# ========================================

build: build-client build-server
	@echo "✅ 全ビルドが完了しました"

build-client:
	@echo "🏗️  フロントエンドをビルド中..."
	npm run build

build-server:
	@echo "🏗️  バックエンドをビルド中..."
	cd server && npm run build

# ========================================
# テスト・リント
# ========================================

test:
	@echo "🧪 テストを実行中..."
	npm test

lint:
	@echo "🔍 リントを実行中..."
	npm run lint

# ========================================
# Docker
# ========================================

docker-build:
	@echo "🐳 Dockerイメージをビルド中..."
	docker build -t todo-app .

docker-run:
	@echo "🐳 Dockerコンテナを起動中..."
	@echo "アプリケーション: http://localhost:8080"
	docker run -p 8080:8080 --env-file server/.env todo-app

# ========================================
# デプロイ
# ========================================

PROJECT_ID = todo-app-488204
REGION = asia-northeast1
SERVICE_NAME = todo-app
REPO_NAME = todo-app-repo

deploy:
	@echo "☁️  Google Cloud Runにデプロイ中..."
	@echo "プロジェクトID: $(PROJECT_ID)"
	@echo "リージョン: $(REGION)"
	@echo ""
	@echo "📝 プロジェクトIDを設定中..."
	gcloud config set project $(PROJECT_ID)
	@echo "📦 Artifact Registry リポジトリを確認中..."
	@gcloud artifacts repositories describe $(REPO_NAME) --location=$(REGION) 2>/dev/null || ( \
		echo "リポジトリが存在しないため、作成します..." && \
		gcloud artifacts repositories create $(REPO_NAME) \
			--repository-format=docker \
			--location=$(REGION) \
			--description="Docker repository for TODO app" && \
		echo "✅ リポジトリを作成しました" \
	)
	@echo "🔐 Docker認証を設定中..."
	gcloud auth configure-docker $(REGION)-docker.pkg.dev
	@echo "🏗️  Cloud Buildでイメージをビルド中..."
	gcloud builds submit --config cloudbuild.yaml
	@echo ""
	@echo "✅ デプロイが完了しました！"
	@echo ""
	@echo "サービスURL:"
	@gcloud run services describe $(SERVICE_NAME) --region=$(REGION) --format="value(status.url)"
	@echo ""

# ========================================
# クリーンアップ
# ========================================

clean:
	@echo "🧹 ビルド成果物を削除中..."
ifeq ($(OS),Windows_NT)
	@if exist dist rmdir /s /q dist
	@if exist server\dist rmdir /s /q server\dist
	@if exist node_modules\.vite rmdir /s /q node_modules\.vite
else
	@rm -rf dist server/dist node_modules/.vite
endif
	@echo "✅ クリーンアップが完了しました"
