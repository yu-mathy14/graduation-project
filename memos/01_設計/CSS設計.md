# CSS設計
新しいファイルを作るたびに更新していくものとする

## 現在のCSSファイル

| 対象 | CSSファイル |
| :---- | :---- |
| アプリ全体 | src/app/globals.css <br> src/app/layout.module.css | 
| アプリ共通のUI | src/app/common.module.css |
| src/app/page.tsx | src/app/page.module.css |
| src/app/teams/page.tsx | src/app/teams/page.module.css | 
| src/app/teams/new/page.tsx | src/app/teams/new/page.module.css | 
| src/app/teams/new/components/TeamForm.tsx | src/app/common.module.css | 
| src/app/teams/[teamId]/page.tsx | src/app/teams/[teamId]/page.module.css |
| src/app/teams/[teamId]/edit/page.tsx | src/app/teams/[teamId]/edit/page.module.css |
| src/app/teams/[teamId]/edit/components/TeamForm.tsx | src/app/common.module.css |
| src/app/teams/[teamId]/delete/page.tsx | src/app/teams/[teamId]/delete/page.module.css |
| src/app/teams/[teamId]/players/page.tsx | src/app/teams/[teamId]/players/page.module.css |
| src/app/teams/[teamId]/players/new/page.tsx | src/app/teams/[teamId]/players/new/page.module.css |
| src/app/teams/[teamId]/players/new/components/PlayerForm.tsx | src/app/common.module.css |
| src/app/teams/[teamId]/players/[playerId]/page.tsx | src/app/teams/[teamId]/players/[playerId]/page.module.css |
| src/app/teams/[teamId]/players/[playerId]/edit/page.tsx | src/app/teams/[teamId]/players/[playerId]/edit/page.module.css |
| src/app/teams/[teamId]/players/[playerId]/edit/components/PlayerFOrm.tsx | src/app/common.module.css |

---
### globals.css の役割
| 設定 | 内容 |
| :---- | :---- |
| * | box-sizing: border-boxを設定 |
| html, body | marginとpaddingを0に設定 |
| body | 背景色・文字色・フォントを設定 |
| a | リンクの文字色を継承し、下線を解除 |
| button, input, select, textarea | フォントを継承 |
