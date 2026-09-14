// フォームから受け取ったチーム情報を確認し、
// 自分自身を除いてチーム名の重複を確認したあとDBを更新する
// ==================================================

/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { TeamFormValues } from "../../schema";

/* フォームから受け取ったチーム情報を確認し、
  自分自身を除いてチーム名の重複がなければDBを更新して詳細ページへ遷移する関数 */
export async function updateTeam(
  teamId: number,
  data: TeamFormValues
  ) {
  /* 前後の空白を除去 */
  const teamName = data.teamName.trim();
  const teamColor = data.teamColor.trim();

  // チーム名重複チェック ---------------------------------
  /* 自分自身を除いて、同じチーム名のチームを検索 */
  /* findUnique()ではなくfindFirst()なのは、
    teamNameが一致し、かつteamIdが編集中のチームIDと異なる
    という複数の条件で検索するため */
  const existingTeam = await prisma.teams.findFirst({
    where: {
      teamName,
      teamId: {
        /* 編集対象のチーム自身を除外 */
        not: teamId,
      },
    },
  });

  /* 一致するチームが存在した場合は、
  Errorオブジェクトを作成して例外を投げる */
  if (existingTeam) {
    throw new Error("同じチーム名がすでに登録されています");
  }
  // ---------------------------------------------------

  /* 指定したチームを更新 */
  await prisma.teams.update({
    where: {
      teamId,
    },
    data: {
      teamName,
      teamColor,
    },
  });

  /* 更新したチームの詳細ページに遷移する */
  redirect(`/teams/${teamId}`);
}
