# ReactコンポーネントとServer Actionの役割の違い

## 0. `createStats` にPropsを使わず、引数へ直接型を指定した理由

`Props`はReactコンポーネントが親コンポーネントから受け取るデータを表すために使用している。<br>
一方、`createStats`はReactコンポーネントではなく、サーバー側で処理を行うServer Actionの関数である。<br>
そのため、Propsとしてまとめるのではなく、通常の関数の引数として型を直接指定している。<br>

`createStats`は以下の2つの引数を受け取る。
```
gameId → number型
playerStats → Record<number, PlayerStats>型
```
ReactコンポーネントとServer Actionでは役割が異なるため、それぞれに適した方法で型を指定している。


## 1. Reactコンポーネント
Reactコンポーネントは、画面を構成するための部品である。<br>
今回のスタッツ入力画面では、以下のコンポーネントを作成している。

- `StatsNewForm`
- `PlayerSelect`
- `PlayerStatsInput`

これらは画面上でユーザーが操作するため、クライアント側で実行する必要がある。<br>
そのため、必要なコンポーネントには、
```tsx
"use client";
```
を記述している。

## 2. Props
Reactコンポーネント間でデータを受け渡すためにPropsを使用する。<br>
例えば`StatsNewForm`では、
``` ts
type Props = {
  gameId: number;
  homeTeamName: string;
  homePlayers: Player[];
  awayTeamName: string;
  awayPlayers: Player[];
};
```
とPropsの型を定義している。<br>
Reactコンポーネントは複数の値を受け取るため、それらをPropsとしてまとめて管理している。

## 3. Server Action
Server Actionは、サーバー側で処理を実行するための関数である。<br>
今回のスタッツ入力画面では、`createStats`をServer Actionとして使用している。
``` ts
"use server";
```
を記述することで、サーバー側で実行する関数であることを明示している。<br>
`createStats`では、受け取ったスタッツをデータベースへ登録する。
``` ts
export async function createStats(
  gameId: number,
  playerStats: Record<number, PlayerStats>
) {
  // ...
}
```

## 4. PropsとServer Actionの引数の型指定を分けた理由
ReactコンポーネントとServer Actionでは役割が異なるため、型の定義方法も分けている。
#### Reactコンポーネント
Reactコンポーネントは複数の値をPropsとして受け取るため、
``` ts
type Props = {
  // ...
};
```
としてPropsの型をまとめて定義する。

#### Server Action
`createStats`はReactコンポーネントではなく、データベースへの登録処理を行うServer Actionである。<br>
そのためPropsではなく、通常の関数の引数として、
``` ts
gameId: number
playerStats: Record<number, PlayerStats>
```
のように直接型を指定している。

## 5. 役割の違い
```
Reactコンポーネント
    ↓
画面を表示・ユーザー操作を受け付ける
    ↓
Propsで必要なデータを受け取る

        ↓

Server Action
    ↓
サーバー側でデータ処理を行う
    ↓
データベースへ登録する
```
Reactコンポーネントは「画面を作る役割」、<br>
Server Actionは「サーバー側でデータを処理する役割」として分離している。<br>

このように役割を分けることで、画面表示・ユーザー操作とデータベースへの登録処理を分離できる。

## 6. まとめ
#### 「なぜReactコンポーネントではPropsを使うのですか？」
Reactコンポーネントは、親コンポーネントからデータを受け取って画面を構成するため、複数の値をPropsとしてまとめて受け取っている。

#### 「なぜcreateStatsにはPropsがないのですか？」
`createStats`はReactコンポーネントではなくServer Actionの関数だからである。<br>
PropsはReactコンポーネントが受け取るデータを表すものなので、Server Actionでは通常の関数の引数として型を指定している。

#### 「なぜcreateStatsの引数には直接型を指定したのですか？」
`createStats`は2つの引数を受け取る通常の関数として設計しているためである。<br>
そのため、`gameId`には`number`、`playerStats`には`Record<number, PlayerStats>`を直接指定している。