# Prismaが自動生成するものの確認方法

## 1. Prisma SchemaとPrisma Clientの関係
Prismaでは、schema.prismaにモデルや主キー、リレーションなどを定義する。<br>
その後、Prisma Generateを実行すると、schema.prismaの内容をもとにPrisma Clientが生成される。
```
schema.prisma
    ↓
prisma generate
    ↓
Prisma Client
    ↓
TypeScriptからPrismaを利用
```

## 2. Prisma Clientを再生成する
schema.prismaを変更した場合は、Prisma Clientを再生成する。

コマンド：
``` bash
pnpm exec prisma generate
```
生成されたPrisma Clientには、schema.prismaの定義をもとにした型やデータベース操作の情報が反映される。


## 3. schema.prismaの内容が正しいか確認する
Prisma Schema自体に問題がないかを確認する場合は、以下を実行する。

コマンド：
``` bash
pnpm exec prisma validate
```
エラーがなければ、schema.prismaの定義に問題がないことを確認できる。


## 4. Prismaが生成した型を確認する
Prisma Clientが実際にどのような型を生成しているか確認したい場合は、生成された型を検索する。

例えば、Statsモデルの一意条件を確認したい場合は、
```
StatsWhereUniqueInput
```
を検索する。<br>
これにより、Prisma Clientでwhereに指定できる項目を確認できる。


## 5. 複合主キーの確認
schema.prismaで複合主キーを、<br>
`@@id([playerId, gameId])`<br>
と定義した場合、Prisma Clientでは、この複合主キーを使って一意のレコードを指定できる。

今回のように、Prisma Clientで使用する複合キー名が分からない場合は、生成されたStatsWhereUniqueInputを確認する。<br>
今回の環境では、<br>
`playerId_gameId`<br
という名前が生成されていた。

そのため、更新処理では、
``` tsx
where: {
  playerId_gameId:
    playerId
    gameId
}
```
という形で指定した。


## 6. Prismaのフィールド名とDBのカラム名
Prisma Schemaでは、Prisma Clientから使用する名前と、実際のデータベースのカラム名を分けることができる。
例えば、<br>
`playerId Int @map("player_id")`<br>
の場合、

Prisma Clientでは、<br>
`playerId`<br
を使用する。

データベース上では、<br>
`player_id`<br
というカラム名になる。

つまり、
```
Prisma側：playerId
        ↓ @map
DB側：player_id
```
となる。


## 7. 補完機能で確認する
VS Codeでは、Prisma Clientの型定義に基づいて補完候補が表示される。

例えば、
```tsx
prisma.stats.update()
```
のwhereの中に何を指定できるか確認することで、Prisma Clientが認識している一意条件を確認できる。<br>
ただし、補完候補だけでは分かりにくい場合があるため、生成された型定義を直接確認する方法もある。

## 8. Prismaが生成したファイルを直接編集しない
Prismaが自動生成したファイルは、基本的に直接編集しない。<br>
schema.prismaを変更し、
``` bash
pnpm exec prisma generate
```
を実行して再生成する。
```
schema.prismaを変更
        ↓
prisma generate
        ↓
Prisma Clientを再生成
```

## 9. 今回のつまずき
Statsモデルでは、<br>
`@@id([playerId, gameId])`
と複合主キーを定義していた。<br>

最初、Prisma Clientで使用する複合キー名を、<br>
`gameId_playerId`<br>
と予想していた。

しかし、TypeScriptのエラーによって存在しないことが分かった。<br>
生成されたPrisma Clientの内容を確認した結果、<br>
`playerId_gameId`<br>
が正しい複合キー名だと分かった。

このことから、schema.prismaの定義だけでなく、実際に生成されたPrisma Clientの型を確認することが重要だと分かった。

## 10. Prismaの自動生成物を確認するときの基本手順
```
schema.prismaを確認
        ↓
pnpm exec prisma validate
        ↓
pnpm exec prisma generate
        ↓
VS Codeで生成された型を確認
        ↓
必要な型やプロパティ名を確認
        ↓
Prisma Clientのコードに使用
```
Prismaの動作が想定と異なる場合は、推測で名前を決めるのではなく、生成された型定義を確認してから実装する。