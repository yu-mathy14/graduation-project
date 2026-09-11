# migrationへの制約追加手順

## 目的
Prisma Schemaだけでは直接表現しにくいCHECK制約などを、migration.sqlへSQLとして手動で追加する手順を記録する。

## 1. 既存のmigrationを直接変更しない
すでに適用済みのmigrationは変更しない。<br>
新しいmigrationを作成し、そのmigrationで追加・変更を行う。<br>
これにより、データベースの変更履歴を保つ。

## 2. 既存データを確認する
CHECK制約を追加する前に、既存データが制約に違反していないか確認する。<br>
違反データが存在すると、migrationの適用に失敗する可能性がある。<br>
また、UNIQUE制約を追加する場合は既存データに重複がないか確認する。

## 3. 空のmigrationを作成する
以下のコマンドでmigrationを作成する。
``` bash
pnpm exec prisma migrate dev --create-only --name add_check_constraints
```
migrationが生成されるが、--create-onlyを使用しているため、この時点ではDBへ適用されない。

## 4. migration.sqlを確認する
生成されたmigration.sqlを確認する。<br>
Prisma Schemaから自動的に認識できる変更がない場合、
``` SQL
-- This is an empty migration.
```
となる場合がある。<br>
その場合はmigration.sqlを手動で編集する。


## 5. CHECK制約を手動で追加する
ALTER TABLEを使用してCHECK制約を追加する。<br>
例：
``` SQL
ALTER TABLE "players"
ADD CONSTRAINT "players_jersey_number_check"
CHECK ("jersey_number" > 0);
```
複数のCHECK制約を追加することもできる。<br>
例：
``` SQL
ALTER TABLE "players"
ADD CONSTRAINT "players_jersey_number_check"
CHECK ("jersey_number" > 0);

ALTER TABLE "players"
ADD CONSTRAINT "players_height_check"
CHECK ("height" > 50);

ALTER TABLE "players"
ADD CONSTRAINT "players_weight_check"
CHECK ("weight" > 3);
```

## 6. 複数カラムを使うCHECK制約
複数のカラム間の関係もCHECK制約で表現できる。<br>
例：
``` SQL
ALTER TABLE "games"
ADD CONSTRAINT "games_home_away_team_check"
CHECK ("home_team_id" <> "away_team_id");
```
statsの例：
``` SQL
ALTER TABLE "stats"
ADD CONSTRAINT "stats_p3_m_le_p3_a_check"
CHECK ("p3_m" <= "p3_a");

ALTER TABLE "stats"
ADD CONSTRAINT "stats_p2_m_le_p2_a_check"
CHECK ("p2_m" <= "p2_a");

ALTER TABLE "stats"
ADD CONSTRAINT "stats_ft_m_le_ft_a_check"
CHECK ("ft_m" <= "ft_a");
```

## 7. migrationを適用する
migration.sqlの内容を確認した後、以下を実行する。
``` bash
pnpm exec prisma migrate dev
```

## 8. migrationの状態を確認する
適用後、以下を実行する。
``` bash
pnpm exec prisma migrate status
```
以下の表示になれば、migration履歴とDBが一致している。
``` bash
Database schema is up to date!
```

## 9. 実DBで反映結果を確認する
migration適用後、PostgreSQLで制約を確認する。
``` SQL
SELECT
    conname,
    contype,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid IN (
    'teams'::regclass,
    'players'::regclass,
    'games'::regclass,
    'stats'::regclass
)
AND contype IN ('p', 'u', 'f', 'c')
ORDER BY conrelid::regclass::text, contype, conname;
```

## 10. 設計書との一致を確認する
最終的に、
```
設計書
↓
migration.sql
↓
実DB
```
が一致していることを確認する。

## 11. Prisma Schemaとの関係
Prisma Schemaで直接表現しにくいCHECK制約は、migration.sqlへ手動で追加する。<br>
一方、PostgreSQL固有の型指定など、Prisma Schema側で表現できるものはSchemaにも正しく記述する。<br>
今回、試合開始日時はTIMESTAMPTZを使用するため、
``` prisma
tipoffTime DateTime @db.Timestamptz(3) @default(now()) @map("tipoff_time")
```
としてPrisma Schema側にも型を明示した。