# DB制約の確認方法

## 目的
設計書で定義した制約が、実際のPostgreSQLに反映されているか確認する。

確認対象：
- PRIMARY KEY
- UNIQUE
- FOREIGN KEY
- CHECK
- NOT NULL

## 1. PostgreSQLへ接続する
今回の開発環境ではDocker Composeを使用している。
プロジェクトのルートディレクトリから、以下のコマンドでPostgreSQLへ接続する。
``` SQL
docker compose exec db psql -U gp02_user -d gp02_db
```
接続すると、
```
gp02_db=#
```
というプロンプトが表示される。
この状態でSQLを実行できる。

## 2. pg_constraintで制約を確認する
テーブルの制約を確認する場合は、PostgreSQLのpg_constraintを使用する。

例：
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
ORDER BY conrelid::regclass::text, contype, conname;
```

## 3. contypeの意味
pg_constraintのcontypeには制約の種類が入る。
- p → PRIMARY KEY
- u → UNIQUE
- f → FOREIGN KEY
- c → CHECK
- n → NOT NULL

## 4. CHECK制約だけを確認する
CHECK制約だけを確認する場合：
```SQL
SELECT
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'stats'::regclass
  AND contype = 'c';
```

## 5. UNIQUE INDEXを確認する
UNIQUE制約に関連する一意インデックスを確認する場合は、pg_indexesを使用する。
``` SQL
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('teams', 'players');
```

## 6. 設計書と実DBを比較する
制約の確認では、次の3つを比較する。
```
設計書
↓
migration.sql
↓
実DB
```
確認することで、
- 設計書にはあるがmigrationにない
- migrationにはあるが実DBにない
- 実DBにはあるが設計書に記録されていない

といった差分を発見できる。

## 7. 今回確認した内容
teams
- PRIMARY KEY (team_id)
- UNIQUE (team_name)

players
- PRIMARY KEY (player_id)
- FOREIGN KEY (team_id)
- UNIQUE (team_id, jersey_number)
- CHECK (jersey_number > 0)
- CHECK (height > 50)
- CHECK (weight > 3)

games
- PRIMARY KEY (game_id)
- FOREIGN KEY (home_team_id)
- FOREIGN KEY (away_team_id)
- CHECK (home_team_id <> away_team_id)

stats
- PRIMARY KEY (player_id, game_id)
- FOREIGN KEY (player_id)
- FOREIGN KEY (game_id)
- CHECK制約一式

## 8. 注意点

UNIQUEについては、pg_constraintだけでは確認しにくい場合がある。

そのため、
```
pg_constraint
↓
PRIMARY KEY、FOREIGN KEY、CHECKなどを確認

pg_indexes
↓
UNIQUE INDEXなどを確認
```
というように使い分ける。