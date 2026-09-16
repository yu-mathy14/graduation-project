# mapとfor...ofの使い分け

## 1. 今回やりたい処理
スタッツの登録時に、選択した全選手についてYupのバリデーションを実行する。
```tsx
for (const playerId of selectedPlayerIds) {
  await playerStatsSchema.validate(playerStats[playerId]);
}
```
処理の流れは以下のとおり。
```text
選手Aを検証
↓
検証完了
↓
選手Bを検証
↓
検証完了
↓
選手Cを検証
```
1人ずつ順番に検証し、検証中にエラーが発生した場合は、その時点で処理を中断して`catch`に移る。

---

## 2. for...ofを採用した理由
今回の処理では、配列の各要素から新しい配列を作りたいのではなく、<br>
**選択した選手を1人ずつ順番に処理したい。**<br>
そのため、配列の要素を順番に処理できる`for...of`が適している。
```tsx
for (const playerId of selectedPlayerIds) {
  await playerStatsSchema.validate(playerStats[playerId]);
}
```
`await`を使うことで、現在の選手のYup検証が完了してから次の選手の検証へ進む。<br>
また、Yupの検証でエラーが発生すると、その時点でループを抜けて`catch`の処理へ進む。

---

## 3. mapメソッドとの違い
`map()`は、配列の各要素を処理して**新しい配列を作る**ために使用する。<br>
例えば、
```tsx
const newArray = array.map((value) => value * 2);
```
のように、元の配列から別の配列を作る処理に向いている。<br>

一方、今回の処理では新しい配列を作る必要はない。<br>
そのため、
```tsx
selectedPlayerIds.map(async (playerId) => {
  await playerStatsSchema.validate(playerStats[playerId]);
});
```
とするより、
```tsx
for (const playerId of selectedPlayerIds) {
  await playerStatsSchema.validate(playerStats[playerId]);
}
```
とした方が、処理の目的に合っている。

---

## 4. mapとasync/awaitを組み合わせる場合の注意点
`map()`のコールバック関数に`async`を指定すると、それぞれの要素について`Promise`が返される。
```tsx
const results = selectedPlayerIds.map(async (playerId) => {
  await playerStatsSchema.validate(playerStats[playerId]);
});
```
この場合、`results`は検証結果そのものではなく、複数の`Promise`を持つ配列になる。
```text
Promise[]
```
そのため、単純に`map()`を使うだけでは、非同期処理の完了を待つことができない。<br>
複数の非同期処理をまとめて待つ場合は、`Promise.all()`と組み合わせる。
```tsx
await Promise.all(
  selectedPlayerIds.map((playerId) =>
    playerStatsSchema.validate(playerStats[playerId])
  )
);
```
---

## 5. 今回の使い分け
今回のスタッツ登録では、
```text
選択した選手を1人ずつ検証する
↓
1人でもエラーがあれば処理を止める
```
という処理なので、`for...of`を採用した。
```tsx
for (const playerId of selectedPlayerIds) {
  await playerStatsSchema.validate(playerStats[playerId]);
}
```
`map()`は「各要素を変換して新しい配列を作る」処理に適しており、<br>
今回のような**順番に非同期処理を実行する処理**には`for...of`が分かりやすい。

---

## 6. 覚えておくポイント
```text
map：各要素を処理して新しい配列を作る
for...of：配列の要素を順番に処理する
map + async：Promise[]になる
map + asyncを待つ：Promise.all()を使う
順番にawaitして、エラー発生時に止めたい：for...ofが分かりやすい
```