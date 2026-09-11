// ユーザーが入力したスタッツを受け取り、実際にDBへ保存する【サーバー側の処理】
/* StatsNewForm.tsx
    ↓
  actions.ts
    ↓
  Prisma
    ↓
  PostgreSQL
*/
// =========================================

/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/* 型の読み込み */
import type { PlayerStats } from "./types";

/* gameIdと各選手のスタッツを受け取ってstatsテーブルへ登録する関数 */
export async function createStats(
  /* createStats()はコンポーネントではなく
  Server Actionの普通の関数なのでPropsではなくただの引数 */
  gameId: number,
  playerStats: Record<number, PlayerStats>
) {
  //  バリデーションは後で追加

  /* 登録するデータを定数に格納 */
  const statsData = Object.entries(playerStats).map(
    ([playerId, stats]) => ({
      playerId: Number(playerId), // 数値型に変換
      gameId,
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
    })
  );

  await prisma.stats.createMany({
    data: statsData,
  });

  redirect(`/games/${gameId}`);
}