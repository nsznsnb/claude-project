# Google Cloud Run デプロイガイド

このドキュメントでは、TODO アプリケーションを Google Cloud Run にデプロイする手順を説明します。

## 前提条件

1. Google Cloud アカウント
2. プロジェクトID: `todo-app-488204`
3. gcloud CLI がインストールされていること
4. MongoDB Atlas のクラスター（または他のMongoDB接続先）

## セットアップ手順

### 1. Google Cloud プロジェクトの設定

#### 1.1 課金の有効化
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクト `todo-app-488204` を選択
3. 「お支払い」→「請求先アカウントをリンク」から課金を有効化

#### 1.2 必要なAPIの有効化
```bash
gcloud config set project todo-app-488204

# Cloud Run API を有効化
gcloud services enable run.googleapis.com

# Artifact Registry API を有効化
gcloud services enable artifactregistry.googleapis.com

# Cloud Build API を有効化
gcloud services enable cloudbuild.googleapis.com
```

### 2. MongoDB の準備

#### MongoDB Atlas を使用する場合

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) でアカウント作成
2. クラスターを作成
3. Database Access で管理ユーザーを作成
4. Network Access で接続元IPを許可（`0.0.0.0/0` で全IP許可、または Cloud Run の IP範囲を指定）
5. 接続文字列を取得:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/todo-app
   ```

### 3. Secret Manager に MongoDB URI を保存（推奨）

```bash
# Secret を作成
echo -n "mongodb+srv://username:password@cluster.mongodb.net/todo-app" | \
  gcloud secrets create mongodb-uri --data-file=-

# Cloud Run サービスアカウントに権限を付与
gcloud secrets add-iam-policy-binding mongodb-uri \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 4. デプロイの実行

#### Makeコマンドを使用（推奨）

```bash
make deploy
```

このコマンドは以下を自動的に実行します：
- プロジェクトIDの設定
- Artifact Registry リポジトリの作成（存在しない場合）
- Docker認証の設定
- Cloud Build でのビルド＆デプロイ

#### 手動デプロイ

```bash
# プロジェクトIDを設定
gcloud config set project todo-app-488204

# Artifact Registry リポジトリを作成
gcloud artifacts repositories create todo-app-repo \
  --repository-format=docker \
  --location=asia-northeast1 \
  --description="Docker repository for TODO app"

# Docker認証を設定
gcloud auth configure-docker asia-northeast1-docker.pkg.dev

# Cloud Build でビルド&デプロイ
gcloud builds submit --config cloudbuild.yaml
```

### 5. 環境変数の設定

Secret Manager を使用する場合、cloudbuild.yaml を編集して環境変数を追加:

```yaml
- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  entrypoint: gcloud
  args:
    - 'run'
    - 'deploy'
    - 'todo-app'
    # ... 他の引数
    - '--set-secrets'
    - 'MONGODB_URI=mongodb-uri:latest'
```

または、直接環境変数を設定:

```bash
gcloud run services update todo-app \
  --region=asia-northeast1 \
  --set-env-vars="MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app"
```

### 6. デプロイ確認

```bash
# サービスURLを取得
gcloud run services describe todo-app \
  --region=asia-northeast1 \
  --format="value(status.url)"

# ヘルスチェック
curl https://YOUR-SERVICE-URL/health
```

## CI/CD の設定（オプション）

### Cloud Build トリガーの作成

1. Cloud Console で「Cloud Build」→「トリガー」を開く
2. 「トリガーを作成」をクリック
3. 以下の設定を行う:
   - **名前**: `deploy-todo-app`
   - **イベント**: `ブランチにプッシュ`
   - **ソース**: GitHub リポジトリを接続
   - **ブランチ**: `^main$`
   - **構成**: `Cloud Build 構成ファイル（yaml または json）`
   - **場所**: `cloudbuild.yaml`

これで、main ブランチへのプッシュ時に自動デプロイされます。

## トラブルシューティング

### ビルドエラー

```bash
# ログを確認
gcloud builds list --limit=5
gcloud builds log [BUILD_ID]
```

### ランタイムエラー

```bash
# Cloud Run のログを確認
gcloud run services logs read todo-app --region=asia-northeast1
```

### MongoDB 接続エラー

1. MongoDB Atlas のNetwork Accessで `0.0.0.0/0` が許可されているか確認
2. 接続文字列が正しいか確認
3. ユーザー名とパスワードに特殊文字が含まれている場合はURLエンコード

## コスト管理

- **無料枠**: Cloud Run は月に 200 万リクエストまで無料
- **最小インスタンス**: 0 に設定されているため、アクセスがない時は課金されません
- **最大インススタンス**: 10 に制限されています

## セキュリティ

- MongoDB の接続文字列は Secret Manager で管理することを推奨
- 本番環境では `--allow-unauthenticated` を外して認証を追加することを検討
- 定期的に依存パッケージを更新

## 参考リンク

- [Cloud Run ドキュメント](https://cloud.google.com/run/docs)
- [Cloud Build ドキュメント](https://cloud.google.com/build/docs)
- [Secret Manager ドキュメント](https://cloud.google.com/secret-manager/docs)
