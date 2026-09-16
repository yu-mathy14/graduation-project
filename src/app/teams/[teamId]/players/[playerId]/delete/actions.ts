/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deletePlayer(formData: FormData) {
  const playerId = Number(formData.get("playerId")); // playerId(文字列)を数値に変換し、playerIdに格納
  const teamId = Number(formData.get("teamId")); // teamId(文字列)を数値に変換し、teamIdに格納

  // Prismaを使ってPlayersテーブルから該当の選手情報を取得する
  const player = await prisma.players.findUnique({
    where: { playerId },
    // スタッツ数も一緒に取得する
    include: {
      _count: {
        select: {
          stats: true,
        },
      },
    },
  });

  // 選手が存在しない場合は処理を終了する
  if (!player) {
    return;
  }

  // URLなどから渡されたteamIdと選手の実際の所属チームが一致するか確認する
  if (player.teamId !== teamId) {
    return;
  }

  // 選手にスタッツが存在する場合は削除せず、削除確認画面(削除不可表示)へ戻る
  if (player._count.stats > 0) {
    redirect(
      `/teams/${teamId}/players/${playerId}/delete`
    );
  }

  // Playersテーブルから該当の選手を削除する
  await prisma.players.delete({
    where: { playerId },
  });

  // 選手削除後、所属選手一覧画面へ遷移する
  redirect(`/teams/${teamId}/players`);
}