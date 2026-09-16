// フォームから受け取った試合情報を確認し、
// チームの存在とホーム・アウェイの重複を確認してDBに登録する
// ==================================================

/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { GameFormValues } from "../schema";

/* フォームから受け取った試合情報を確認し、
  チームの存在とホーム・アウェイの重複に問題がなければ
  DBに登録して詳細ページへ遷移する関数 */
export async function createGame(data: GameFormValues) {
  /* フォームから受け取ったIDとスコアは文字列なので数値型に変換 */
  const homeTeamId = Number(data.homeTeamId);
  const awayTeamId = Number(data.awayTeamId);
  const homeScore = Number(data.homeScore);
  const awayScore = Number(data.awayScore);

  // ホーム・アウェイチーム重複チェック -------------------
  /* ホームチームとアウェイチームが同じ場合は登録しない */
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

  /* どちらかのチームが存在しない場合は登録しない */
  if (!homeTeam || !awayTeam) {
    throw new Error("指定されたチームが存在しません");
  }
  // ---------------------------------------------------

  // 所属選手数チェック -----------------------------------
  /* ホームチームの所属選手数を取得 */
  /* 【.count()】条件に合うデータの件数を取得 */
  const homePlayerCount = await prisma.players.count({
    where: {
      teamId: homeTeamId,
    },
  });

  /* アウェイチームの所属選手数を取得 */
  const awayPlayerCount = await prisma.players.count({
    where: {
      teamId: awayTeamId,
    },
  });

  /* どちらかのチームの所属選手が5人未満の場合は登録しない */
  if (homePlayerCount < 5 || awayPlayerCount < 5) {
    throw new Error(
      "ホームチームとアウェイチームには所属選手が5人以上いる必要があります"
    );
  }
  // ---------------------------------------------------

  /* Gameを1件登録する */
  const game = await prisma.games.create({
    data: {
      /* +09:00を付けて、入力値を日本時間として解釈する */
      tipoffTime: new Date(`${data.tipoffTime}:00+09:00`),
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
    },
  });

  /* 登録した試合の詳細ページへ遷移 */
  redirect(`/games/${game.gameId}`);
}
