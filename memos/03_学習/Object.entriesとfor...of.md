# Object.entriesとfor...ofによるスタッツ検証

## 1. 今回の処理
所属選手全員のスタッツを1人ずつYupで検証する。
```tsx
for (const [playerId, stats] of Object.entries(allPlayerStats)) {
  await playerStatsSchema.validate(stats);
}
```
---

## 2. `allPlayerStats` の構造
`allPlayerStats` は、選手IDをキーとして、その選手のスタッツを値として持つオブジェクト。
```tsx
{
  1: { p3A: 10, p3M: 3, ... },
  2: { p3A: 5, p3M: 2, ... },
  3: { p3A: 0, p3M: 0, ... }
}
```
```text
1 → 選手ID
2 → 選手ID
3 → 選手ID

右側 → その選手のスタッツ
```
---

## 3. `Object.entries()` の役割
`Object.entries()` は、オブジェクトを**キーと値の組み合わせの配列**に変換する。
```tsx
Object.entries(allPlayerStats)
```
例えば、
```tsx
[
  [1, { p3A: 10, p3M: 3, ... }],
  [2, { p3A: 5, p3M: 2, ... }],
  [3, { p3A: 0, p3M: 0, ... }]
]
```
のようになる。<br>
各要素は、
```tsx
[playerId, stats]
```
という2つの値を持つ配列になる。

---

## 4. `for...of` の役割
`for...of` は、配列などの要素を**1つずつ順番に取り出して処理する**ために使う。
```tsx
for (const item of array) {
  // itemを処理
}
```
今回の場合は、`Object.entries(allPlayerStats)` から1件ずつ取り出している。
```tsx
for (const [playerId, stats] of Object.entries(allPlayerStats)) {
```
つまり、
```text
allPlayerStats
↓
Object.entries()
↓
[選手ID, スタッツ] の配列
↓
for...ofで1件ずつ取り出す
```
という流れになる。

---

## 5. `[playerId, stats]` は分割代入
`Object.entries()` で取得した1件は、
```tsx
[1, { p3A: 10, p3M: 3, ... }]
```
のような配列。<br>
これを、
```tsx
const [playerId, stats]
```
と書くことで、
```text
playerId = 1
stats = { p3A: 10, p3M: 3, ... }
```
のように、それぞれの変数へ分けて取得できる。<br>

**配列の分割代入**

---

## 6. `for...of` の中でYup検証
取り出した `stats` をYupへ渡す。
```tsx
for (const [playerId, stats] of Object.entries(allPlayerStats)) {
  await playerStatsSchema.validate(stats);
}
```
処理の流れは、
```text
選手AのIDとスタッツを取得
↓
選手AのスタッツをYupで検証
↓
検証完了
↓
選手BのIDとスタッツを取得
↓
選手BのスタッツをYupで検証
↓
検証完了
↓
次の選手へ
```
となる。<br>
`await` を使用することで、現在の選手の検証が完了してから次の選手へ進む。

---

## 7. `playerId` は現在の処理では使用していない
現在は、
```tsx
for (const [playerId, stats] of Object.entries(allPlayerStats)) {
  await playerStatsSchema.validate(stats);
}
```
となっているため、ループ内では `playerId` を使用していない。<br>
その場合は、
```tsx
for (const [, stats] of Object.entries(allPlayerStats)) {
  await playerStatsSchema.validate(stats);
}
```
と書くこともできる。<br>
ただし、今後「どの選手のエラーなのか」を表示する処理などで `playerId` を使用する可能性があるため、現在の実装では `playerId` も取り出している。

---

## 8. 今回の使い分け
```text
Object.entries()：オブジェクトを「キーと値」の配列に変換する
for...of：配列の要素を1つずつ順番に処理する
[playerId, stats]：配列のキーと値を分割代入する
await：1人分のYup検証が完了してから次の選手へ進む
```
今回のコードは、
```tsx
for (const [playerId, stats] of Object.entries(allPlayerStats)) {
  await playerStatsSchema.validate(stats);
}
```
によって、**所属選手全員のスタッツを1人ずつ順番に検証する処理**になっている。
