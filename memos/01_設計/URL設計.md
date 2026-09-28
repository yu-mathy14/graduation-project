# URLまとめ

## チーム・選手関連
| URL | 画面 | 
| :---- | :---- |
| /teams | チーム一覧 |
| /teams/new |チーム登録(新規)  |
| /teams/[teamId] | チーム詳細(チーム情報・直近3試合) |
| /teams/[teamId]/edit | チーム詳細編集 |
| /teams/[teamId]/delete | チーム削除確認 |
| /teams/[teamId]/players | 所属選手一覧 |
| /teams/[teamId]/players/new | 選手登録(新規) |
| /teams/[teamId]/players/[playerId] | 選手詳細 |
| /teams/[teamId]/players/[playerId]/edit | 選手詳細編集 |
| /teams/[teamId]/players/[playerId]/delete | 選手削除確認 |

---
## 試合・スタッツ関連
| URL | 画面 | 
| :---- | :---- |
| /games | 試合一覧 |
| /games/new | 試合登録(新規) |
| /games/[gameId] | 試合詳細 + スタッツ一覧 |
| /games/[gameId]/edit | 試合詳細編集 |
| /games/[gameId]/delete | 試合削除確認 |
| /games/[gameId]/stats/new?team=home | ホームチームのスタッツ登録(新規) |
| /games/[gameId]/stats/new?team=away | アウェイチームのスタッツ登録(新規) |
| /games/[gameId]/stats/edit?team=home | ホームチームのスタッツ編集 |
| /games/[gameId]/stats/edit?team=away | アウェイチームのスタッツ編集 |

---
## チーム詳細画面からの遷移
直近3試合の表示から以下の画面へ遷移できる。<br>
from, returnTeamId, teamIdは、遷移減のチーム詳細へ戻るために使用するクエリパラメータ。
| URL | 画面 | 
| :---- | :---- |
| /teams/[opponentTeamId]?from=team&returnTeamId=[teamId] | 対戦相手チーム詳細 |
| /games/[gameId]?from=team&teamId=[teamId] | 試合詳細 |
