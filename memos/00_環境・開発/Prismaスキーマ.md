# schema.prisma
## 文法・構造上のエラー確認方法
schema.prisma完成後は以下のコマンドでマイグレーションを実行する
``` bash
pnpm exec prisma migration dev --name XXXXX
```
---
しかしPrismaSchemaに文法・構造上のエラーがあると上手くいかない。<br>
そこで、文法・構造上のエラーがないかを以下のコマンドで実行することができる。
``` bash
pnpm exec prisma validate
```
エラーがない場合は以下のようにコンソール出力される。
```
Loaded Prisma confiig from prisma7.config.ts.
Prisma Schema loaded from prisma/schema.prisma.
The Schema at prisma/schema.prisma is valid 🚀
```

---

## DB上の名前とPrisma上の名前が異なるとき
研修で扱ったサンプルコードからも分かる通り、PostgreSQLとPrismaでは慣例的な命名規則が異なる。
| 項目 | PostgreSQL | Prisma | 
| :----: | :----: | :----: | 
| 命名規則 | スネークケース | キャメルケース | 
| 具体例 | team_name | teamName | 
| 備考 |  | TSのコードから使うから|

今回は講義で学習したことをそのまま採用したいのでPostgreSQLとPrismaの命名規則を統一しないで進める。<br>
その際、@map()を使って「DBの命名規則とアプリケーションの命名規則を橋渡しする」必要がある。

| 項目 | カラム名 | テーブル名 | 
| :----: | :----: | :----: | 
| 使用するmap | @map() | @@map() |
| 例1 | teamId ... @map(team_id) | @@map(teams) |
| 例2 | stl ... // @map不要 | × |

---

## マイグレーション・シードデータ作成後にテーブル設計を変更する場合
#### まずはschema.prismaを変更する。
``` bash
pnpm exec prisma migrate dev --name update_table
```
しかしシードデータ作成後にschema.prismaの変更を行い、マイグレーションを実行しようとすると、以下のような警告がコンソールに表示されることがある。

```
⚠️ Warnings for the current datasource:
 • You are about to drop the Games table, which is not empty (7 rows). 
 • You are about to drop the Players table, which is not empty (44 rows).
 • You are about to drop the Stats table, which is not empty (36 rows).
 • You are about to drop the Teams table, which is not empty (6 rows).
```

この警告はすでに作成済みのシードデータ(DBにある初期値)を削除してから、テーブルを作り直すという意味である。<br>
<br>
すなわち、今回の変更でPrismaが「既存のテーブル構造では今回のschema変更を安全に適用できない」と判断して、テーブルをDROPして再作成しようとしている状態である。<br>
<br>
```
・既存データはseedで再作成できる
・新しい seed.ts をすでに作っている
・テーブル設計を新しくしたい
```
という状況であれば削除されても問題ないので、yを押してマイグレーションを実行して問題ない。<br>
<br>
その後、generateコマンドを実行する。
``` bash
pnpm exec prisma generate
```

---

#### 次にseed.tsを変更する。
書き換えたテーブル設計に合わせて、初期データ投入文の書き換えを行う。<br>
その後、次のコマンドを実行する。
``` bash
pnpm exec prisma db seed
```
PrismaStudioを開いて問題ないか確認をする。
``` bash
pnpm exec prisma studio
```
