# Next.js環境構築
## nameについて(主に3箇所)
---
### 1. docker-compose.yml
``` yaml
services:
  app:
    container_name: "XXXXXXX"
```
- 自分で決められる
- Dockerコンテナそのものの名前【Docker上】

### 2. devcontainer.json
``` JSON
{
  "name": "XXXXXX",
}
```
- 自分で決められる
- DevContainerの表示名【VS Code上】

### 3. tsconfig.json
``` JSON
{
  "compilerOptions": {
    "plugins": [
      { "name": "next"}
    ],
  },
}
```
- 自分で任意の名前をつけることはできない
- 今回の場合は"next"じゃないとだめ
- Next.jsが提供しているTypeScriptプラグインをしている識別子であるから、Next.jsの標準設定としてそのままにしておくのが無難。
