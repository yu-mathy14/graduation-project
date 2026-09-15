# Prisma環境構築
## 発生したエラーについて
---
``` bash
pnpm exec prisma init --datasource-provider postgresql
```
上記コマンドを実行しようとしたら以下のエラーが表示された。
```
✖︎[CLI.INVALID_ARGUMENTS] No flag registered for --datasource-provider
```

### 原因
これはPrismaCLIのバージョンが新しくなって--datasource-providerオプションが使えなくなったことが原因である。

### 対処
まずは現在のプロジェクトのPrismaのバージョンを以下のコマンドで確認
``` bash
pnpm exec prisma --version
```

#### 解決策1
最新のバージョンに合わせて開発をする

#### 解決策2
前のバージョンの環境にして開発をする(今回はこれ)
``` bash
pnpm add -D prisma@7.10.0
```