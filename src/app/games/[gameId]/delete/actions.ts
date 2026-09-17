/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteGame(formData: FormData) {
  const gameId = Number(formData.get("gameId")); // gameId(文字列)を数値に変換し、gameIdに格納

  // Prismaを使ってGamesテーブルから該当の試合情報を取得する
  // スタッツ数も一緒に取得する
  const game = await prisma.games.findUnique({
    where: { gameId },
    // スタッツ数も一緒に取得する
    include: {
      _count: {
        select: {
          stats: true,
        },
      },
    },
  });

  // 試合が存在しない場合は処理を終了する
  if (!game) {
    return;
  }

  // 試合にスタッツが存在する場合は削除せず、削除確認画面(削除不可表示)へ戻る
  if (game._count.stats > 0) {
    redirect(`/games/${gameId}/delete`);
  }

  // Gamesテーブルから該当の試合を削除する
  await prisma.games.delete({
    where: { gameId },
  });

  // 試合削除後、試合一覧画面へ遷移する
  redirect("/games");
}