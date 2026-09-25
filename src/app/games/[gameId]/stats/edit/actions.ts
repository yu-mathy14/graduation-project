// ユーザーが編集したスタッツを実際にDBへ保存する【サーバー側の処理】
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
import type { PlayerStats } from "../types";

/* 得点計算関数の読み込み */
import { calculatePlayerPoints } from "../utils";

/* 更新するスタッツデータの型定義 */
type UpdateStatsData = {
  playerId: number;
  stats: PlayerStats;
};

/* gameIdと編集後のスタッツを受け取ってstatsテーブルで更新する関数 */
export async function updateStats(
  /* updateStats()はコンポーネントではなく
  Server Actionの普通の関数なのでPropsではなくただの引数 */
  gameId: number,
  statsData: UpdateStatsData[]
) {
  /* 試合情報を取得 */
  const game = await prisma.games.findUnique({
    where: {
      gameId,
    },
  });

  /* 指定した試合が存在しない場合 */
  if (!game) {
    throw new Error("指定された試合が存在しません");
  }

  /* スタッツ対象選手のIDを取得 */
  const playerIds = statsData.map(({ playerId }) => playerId);

  /* 選手の所属チームを取得 */
  const players = await prisma.players.findMany({
    where: {
      playerId: {
        in: playerIds,
      },
    },
    select: {
      playerId: true,
      teamId: true,
    },
  });

  /* playerStatsに含まれている選手が、
     すべて指定したチームに所属しているか確認 */
  if (players.length !== playerIds.length) {
    throw new Error("指定された選手が存在しません");
  }

  /* スタッツ対象チームを取得 */
  const teamId = players[0].teamId;

  /* すべての選手が同じチームに所属しているか確認 */
  if (players.some((player) => player.teamId !== teamId)) {
    throw new Error(
      "異なるチームの選手が含まれているため、スタッツを更新できません"
    );
  }

  /* 各選手の得点を合計する */
  const totalPoints = statsData.reduce(
    (total, { stats }) =>
      total + calculatePlayerPoints(stats),
    0
  );

  /* 対象チームの最終スコアを取得 */
  const teamScore =
    teamId === game.homeTeamId
      ? game.homeScore
      : game.awayScore;

  /* 試合に参加していないチームの場合は更新させない */
  if (
    teamId !== game.homeTeamId &&
    teamId !== game.awayTeamId
  ) {
    throw new Error(
      "このチームは指定された試合に参加していません"
    );
  }

  /* スタッツの得点合計と試合の最終スコアが一致しない場合は更新させない */
  if (totalPoints !== teamScore) {
    throw new Error(
      "選手スタッツの得点合計と試合の最終スコアが一致するように入力してください"
    );
  }
  
  /* 各選手の試合出場時間を合計する */
  const totalPlaySec = statsData.reduce(
    /* 第一引数：現在のStatsの試合出場時間(秒)を累積値に加える
      第二引数：累積値(total)の初期値は0 */
    (total, { stats }) => total + stats.playSec,
    0
  );

  /* 試合出場時間の合計が12,000秒でない場合は保存させない */
  if (totalPlaySec !== 12000) {
    throw new Error(
      "所属選手全員の試合出場時間の合計が12,000秒になるように入力してください"
    );
  }

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