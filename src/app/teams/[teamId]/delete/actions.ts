/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteTeam(formData: FormData) {
  const teamId = Number(formData.get("teamId")); // teamId(文字列)を数値に変換し、teamIdに格納

  // Prismaを使ってTeamsテーブルから該当のチーム情報(1件)を取得
  const team = await prisma.teams.findUnique({
    where: { teamId: teamId },
    // 件数も一緒に取得
    include: {
      _count: {
        /* 取得する件数の項目 */
        select: {
          player: true, // 所属選手
          homeGames: true, // ホームチームとして参加した試合
          awayGames: true, // アウェイチームとして参加した試合
        }
      }
    }
  });

  // チームが存在しない場合は処理を終了する
  if (!team) {
    return;
  }

  /* 理由毎に削除可否を判定する */
  // 理由1：所属選手がいる
  const hasPlayers = team._count.player > 0;
  // 理由2：試合参加歴がある(仕様上単体では通常発生しない)
  const hasGames =
    team._count.homeGames > 0 || // ホームチームとして
    team._count.awayGames > 0;   // アウェイチームとして

  // 以下のいずれかに該当する場合は削除せず、削除確認画面(削除不可表示)へ戻る
  /* ・チームに所属選手が存在する
     ・チームに試合参加歴が存在する */
  if (hasPlayers || hasGames) {
    redirect(`/teams/${teamId}/delete`);
  }

  // Teamsテーブルから該当のチームを削除する
  await prisma.teams.delete({
    where: { teamId },
  });

  // チーム削除直後、チーム一覧画面へ遷移する
  redirect("/teams");
}