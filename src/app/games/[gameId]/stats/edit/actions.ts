// ユーザーが編集手たスタッツを実際にDBへ保存する【サーバー側の処理】
/* StatsEditForm.tsx
    ↓
  actions.ts
    ↓
  Prisma
    ↓
  PostgreSQL
 */
// ========================================================

/* この関数はサーバー側で実行する処理です
   とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/* 型の読み込み */
import type { PlayerStats } from "../new/types";

/* 更新するスタッツデータの型定義 */
type UpdateStatsData = {
  playerId: number;
  stats: PlayerStats;
};

/* gameIdと編集後のスタッツを受け取ってstatsテーブルで更新する関数 */
export async function updateStats(
  /* createStats()はコンポーネントではなく
  Server Actionの普通の関数なのでPropsではなくただの引数 */
  gameId: number,
  statsData: UpdateStatsData[]
) {
  console.log("updateStats gameId:", gameId);
  await prisma.$transaction(
    /* 変更されたスタッツの変更を1スタッツずつ更新 */
    statsData.map(({ playerId, stats }) =>
      prisma.stats.update({
        where: {
          /* playerId_gameIdはPrismaが生成した複合主キーの名前 */
          playerId_gameId: {
            gameId,
            playerId,
          },
        },
        data: {
          p3A: stats.p3A,
          p3M: stats.p3M,
          p2A: stats.p2A,
          p2M: stats.p2M,
          ftA: stats.ftA,
          ftM: stats.ftM,
          oRbd: stats.oRbd,
          dRbd: stats.dRbd,
          ast: stats.ast,
          stl: stats.stl,
          blk: stats.blk,
          tov: stats.tov,
          pf: stats.pf,
          tf: stats.tf,
          fo: stats.fo,
          dq: stats.dq,
          playSec: stats.playSec,
        },
      })
    )
  );

  /* 更新完了後、試合詳細＋スタッツ一覧画面へ戻る */
  redirect(`/games/${gameId}`);
}