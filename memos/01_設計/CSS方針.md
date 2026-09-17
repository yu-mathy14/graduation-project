# CSS方針

## 1. CSSの適用方法
本アプリのCSSは、CSS Modulesを使用して実装する。<br>
Tailwind CSSではなくCSS Modulesを採用する。

## 2. CSS Modulesを採用する理由
既存のJSXは、機能や処理を実装するためのコードやコメントが多いため、<br>
Tailwind CSSのクラスを`className`に大量に記述すると、JSXが長くなり読みにくくなる可能性がある。<br>
CSS Modulesを使用することで、見た目に関する記述をCSSファイルへ分離できる。

JSXでは、<br>
`className={styles.title}`<br>
のようにクラス名を指定し、実際のデザインは`.module.css`ファイルへ記述する。

これにより、
```text
JSX：何を表示するか・どの処理を行うか
CSS Modules：どのように表示するか
```
という役割分担ができる。

## 3. CSS Modulesの基本方針
ページやコンポーネントごとに`.module.css`ファイルを作成し、その画面やコンポーネント固有のスタイルを管理する。

例：
``` text
TeamForm.tsx
TeamForm.module.css

GameForm.tsx
GameForm.module.css

StatsEditTable.tsx
StatsEditTable.module.css
```
のように、コンポーネントとCSSファイルを対応させる。<br>
これにより、コンポーネントの見た目を変更するときに、対応するCSSファイルを見つけやすくする。

## 4. 共通スタイル
複数の画面やコンポーネントで同じスタイルを使用する場合は、共通CSSとしてまとめる。

例えば、
- button
- primaryButton
- dangerButton
- errorMessage
- pageTitle<br>
など、複数の場所で使用するものは共通化を検討する。

共通スタイルをまとめる場合は、`common.module.css`などのファイルを使用する。

## 5. CSSのコピペについて
CSSを別のCSS Modulesへそのままコピーして再利用する方法は、開発初期の作業速度を優先する場合には使用してよい。<br>
ただし、同じCSSが複数のファイルに存在すると、後からデザインを変更するときに複数箇所を修正する必要がある<br>
そのため、同じスタイルが複数の場所で使用されることが分かった場合は、共通CSSへの切り出しを検討する。
```text
同じCSSを発見
↓
共通化できるか検討
↓
共通化する
または
その画面専用として残す
```

## 6. classNameの付け方
すべてのHTMLタグに個別の`className`を付ける必要はない。<br>
必要な部分だけに`className`を指定し、親要素を起点として子要素をまとめてスタイリングする方法も使用する。

例えば、`section`にクラスを付け、
``` text
section h2
section table
section th
```
などをまとめてスタイリングする。

これにより、JSX内に`className={styles.XXXX}`が大量に並ぶことを防ぐ。

## 7. 実装の進め方
CSSは最初から完璧な共通化を目指さず、画面を完成させながら整理する。
```text
1. 全体の基本スタイルを設定
2. 各ページ・コンポーネントにCSS Modulesを追加
3. 共通するスタイルが出てきたら共通化を検討
4. 最後に重複しているCSSを整理
```
まずはすべての画面に必要なCSSを適用し、アプリ全体の見た目を完成させることを優先する。

## 8. リファクタリング
CSSについても機能完成を優先し、最初から完全な共通化を目指さない。<br>
CSSの重複や共通化できる部分は、画面の実装が一通り完了した後、時間に余裕がある場合にリファクタリングする。
```text
機能完成
↓
CSS適用
↓
動作確認
↓
時間に余裕があればCSSをリファクタリング
```

## 9. CSS方針のまとめ
本アプリでは、CSS Modulesを基本とする。

JSXには必要最小限の`className`を指定し、見た目に関する記述はCSS Modulesへ分離する。

複数の画面やコンポーネントで共通して使用するスタイルは、必要に応じて共通CSSへ切り出す。

CSSの重複については、まず画面を完成させることを優先し、余裕がある段階でリファクタリングする。
