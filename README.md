# Caffe Break

## 必須要件

- Docker

or

- Node.js v18

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
```

以下のコマンドで開発サーバを起動します

```sh
docker compose exec -it web pnpm dev
```

### non Docker

以下のコマンドを実行します

```sh
corepack enable
pnpm i
```

以下のコマンドで開発サーバを起動します

```sh
pnpm dev
```

## その他

開発は `develop` ブランチで行われています
