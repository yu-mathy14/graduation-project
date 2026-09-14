// フォームから受け取った試合情報を確認し、
// チームの存在とホーム・アウェイの重複を確認してDBを更新する
// ==================================================

/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { GameFormValues } from "../../schema";

/* フォームから受け取った試合情報を確認し、
  チームの存在とホーム・アウェイの重複に問題がなければ
  DBを更新して詳細ページへ遷移する関数 */
export async function updateGame(
  gameId: number,
  data: GameFormValues
) {
  /* フォームから受け取ったIDとスコアは文字列なので数値型に変換 */
  const homeTeamId = Number(data.homeTeamId);
  const awayTeamId = Number(data.awayTeamId);
  const homeScore = Number(data.homeScore);
  const awayScore = Number(data.awayScore);

  // 試合存在確認 -----------------------------------------
  /* 指定したGameが存在するか確認 */
  const existingGame = await prisma.games.findUnique({
    where: {
      gameId,
    },
  });

  /* 試合が存在しない場合は更新しない */
  if (!existingGame) {
    throw new Error("指定された試合が存在しません");
  }
  // ---------------------------------------------------

  // ホーム・アウェイチーム重複チェック -------------------
  /* ホームチームとアウェイチームが同じ場合は更新しない */
  if (homeTeamId === awayTeamId) {
    throw new Error(
      "ホームチームとアウェイチームには別のチームを選択してください"
    );
  }
  // ---------------------------------------------------

  // チーム存在確認 ---------------------------------------
  /* ホームチームが存在するか確認 */
  const homeTeam = await prisma.teams.findUnique({
    where: {
      teamId: homeTeamId,
    },
  });

  /* アウェイチームが存在するか確認 */
  const awayTeam = await prisma.teams.findUnique({
    where: {
      teamId: awayTeamId,
    },
  });

  /* どちらかのチームが存在しない場合は更新しない */
  if (!homeTeam || !awayTeam) {
    throw new Error("指定されたチームが存在しません");
  }
  // ---------------------------------------------------

  /* 指定した試合を更新 */
  await prisma.games.update({
    where: {
      gameId,
    },
    data: {
      /* +09:00を付けて、入力値を日本時間として解釈する */
      tipoffTime: new Date(`${data.tipoffTime}:00+09:00`),
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
    },
  });

  /* 更新した試合の詳細ページへ遷移 */
  redirect(`/games/${gameId}`);
}
