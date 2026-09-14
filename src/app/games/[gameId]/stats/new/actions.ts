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
  teamId: number,
  playerStats: Record<number, PlayerStats>
) {
  /* 試合情報を取得 */
  const game = await prisma.games.findUnique({
    where: {
      gameId,
    },
  });

  /* 試合が存在しない場合 */
  if (!game) {
    throw new Error("指定された試合が存在しません");
  }

  /* teamIdが、その試合のホーム・アウェイのどちらにも
     該当しない場合は登録させない */
  if (
    teamId !== game.homeTeamId &&
    teamId !== game.awayTeamId
  ) {
    throw new Error("このチームは指定された試合に参加していません");
  }

  /* playerStatsに含まれている選手IDを配列にする */
  const playerIds = Object.keys(playerStats).map(Number);

  /* 登録対象の選手をDBから取得 */
  const players = await prisma.players.findMany({
    where: {
      playerId: {
        in: playerIds,
      },
      teamId,
    },
  });

  /* playerStatsに含まれている選手が、
     すべて指定したチームに所属しているか確認 */
  if (players.length !== playerIds.length) {
    throw new Error(
      "試合に参加していないチームの選手が含まれています"
    );
  }

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