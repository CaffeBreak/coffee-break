# Caffe Break

## 必須要件

- Docker

or

- Node.js v20
- Python 3.12

## 開発環境

以下のコマンドを実行します

```sh
git clone https://github.com/CaffeBreak/coffee-break.git
cd coffee-break
```

### in Docker

以下のコマンドを実行します

```sh
docker compose up -d
docker compose exec -it web pnpm i
docker compose exec -it npc bash -c "cd apps/npc && ~/.local/bin/poetry install"
```

以下のコマンドで開発サーバを起動します

```sh
docker compose exec -it web pnpm dev
```

以下のコマンドでNPCを起動します

```sh
docker compose exec -it npc bash -c "cd apps/npc && ~/.local/bin/poetry run python src/api.py"
```

### non Docker

以下のコマンドで依存関係をインストールします

```sh
corepack enable
pnpm i
```

以下のコマンドで開発サーバを起動します

```sh
pnpm dev
```

以下のコマンドでNPCを起動します

```sh
cd apps/npc
poetry install
poetry run python src/api.py
```

## その他

開発は `develop` ブランチで行われています
