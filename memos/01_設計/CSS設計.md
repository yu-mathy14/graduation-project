# CSS設計
新しいファイルを作るたびに更新していくものとする

## 現在のCSSファイル

| 対象 | CSSファイル |
| :---- | :---- |
| アプリ全体 | src/app/globals.css | 
| src/app/teams/page.tsx | src/app/teams/page.module.css | 

---
### globals.css の役割
| 設定 | 内容 |
| :---- | :---- |
| * | box-sizing: border-boxを設定 |
| html, body | marginとpaddingを0に設定 |
| body | 背景色・文字色・フォントを設定 |
| a | リンクの文字色を継承し、下線を解除 |
| button, input, select, textarea | フォントを継承 |
