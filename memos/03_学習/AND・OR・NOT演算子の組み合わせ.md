# AND・OR・NOT演算子の組み合わせ

## 1. 論理演算子
条件分岐では、複数の条件を組み合わせて処理を分けることがある。
|   演算子  |   名前   | 意味                       |
| :----: | :----: | :----------------------- |
|  `&&`  | AND演算子 | 両方の条件が`true`の場合に`true`   |
| `\|\|` |  OR演算子 | どちらか一方でも`true`の場合に`true` |
|   `!`  | NOT演算子 | 条件の真偽を反転する               |

## 2. AND演算子（`&&`）
`&&`は、左辺と右辺の両方が`true`の場合に`true`になる。<br>

`A && B`
|   A   |   B   | `A && B` |
| :---: | :---: | :------: |
| false | false |   false  |
| false |  true |   false  |
|  true | false |   false  |
|  true |  true |   true   |

### 今回の例
``` ts
hasPlayers && hasGames
```
これは、「所属選手がいる かつ 試合参加歴がある」という意味になる。<br>
そのため、次のパターンでは`true`になる。<br>
`hasPlayers = true`<br>
`hasGames = true`

## 3. OR演算子（`||`）
`||`は、左辺と右辺のどちらか一方でも`true`の場合に`true`になる。
`A || B`
| A | B | `A || B` |
| :--: | :--: | :--: |
| false | false | false |
| false | true | true |
| true | false | true |
| true | true | true |

### 今回の例
``` ts
hasPlayers || hasGames
```
これは、「所属選手がいる または 試合参加歴がある」という意味になる。<br>
そのため、次のパターンでは`true`になる。<br>
`hasPlayers = true`<br>
`hasGames = false`<br>
または<br>
`hasPlayers = false`<br>
`hasGames = true`<br>
または<br>
`hasPlayers = true`<br>
`hasGames = true`

## 4. NOT演算子（`!`）
`!`は条件の真偽を反転する。<br>
`!A`
|   A   |  `!A` |
| :---: | :---: |
| false |  true |
|  true | false |

### 今回の例
`!hasPlayers`：所属選手がいない
`!hasGames`：試合参加歴がない

## 5. ANDとNOTの組み合わせ
所属選手がいる かつ 試合参加歴がない
``` ts
hasPlayers && !hasGames
```
この条件は、削除不可の理由が「所属選手だけ」の場合に使用できる。<br>
`hasPlayers = true`<br>
`hasGames = false`<br>
の場合は`true`になる。<br>
一方、<br>
`hasPlayers = true`<br>
`hasGames = true`<br>
の場合は`false`になる。

## 6. NOTとANDの組み合わせ
所属選手がいない かつ 試合参加歴がない
``` ts
!hasPlayers && !hasGames
```

これは、チームを削除できる条件として使用できる。
``` ts
const canDeleteTeam = !hasPlayers && !hasGames;
```
つまり、<br>
所属選手なし かつ 試合参加歴なし → 削除可能<br>
となる。

## 7. `!canDeleteTeam` と `hasPlayers || hasGames` の関係
所属選手がいない かつ 試合参加歴がない
``` ts
const canDeleteTeam = !hasPlayers && !hasGames;
```

この条件の反対が、`!canDeleteTeam`になる。

`canDeleteTeam`が`false`になるのは、<br>
「所属選手がいる または 試合参加歴がある」場合なので、<br>
`!canDeleteTeam`は、`hasPlayers || hasGames`と同じ意味になる。

つまり、<br>
`!canDeleteTeam === hasPlayers || hasGames`<br>
と考えることができる。

## 8. `hasPlayers && hasGames` との違い
``` ts
hasPlayers && hasGames
```
「所属選手がいる かつ 試合参加歴がある」場合だけ`true`であるため、<br>
`!canDeleteTeam`とは意味が異なる。

### 条件の比較
| hasPlayers | hasGames | `canDeleteTeam` | `!canDeleteTeam` | `hasPlayers && hasGames` |
| :----: | :----: | :----: | :----: | :----: |
| false | false | true | false | false |
| true | false | false | true | false |
| false | true | false | true | false |
| true | true | false | true | true |

この表から、<br>
 `!canDeleteTeam` は削除不可の3パターンすべてを含むのに対して、<br>
 `hasPlayers && hasGames` は「両方ある場合」だけを表していることが分かる。

## 9. 今回のチーム削除での使い分け
`&&`と`!`を組み合わせることで、条件を細かく分けることができる。
### 削除可能
`!hasPlayers && !hasGames`：所属選手なし かつ 試合参加歴なし

### 所属選手だけが理由
`hasPlayers && !hasGames`：所属選手あり かつ 試合参加歴なし

### 試合参加歴だけが理由
`!hasPlayers && hasGames`：所属選手なし かつ 試合参加歴あり

### 両方が理由
`hasPlayers && hasGames`：所属選手あり かつ 試合参加歴あり
