// 正しい入力を受け取ったあと、DB上で問題がないか確認して保存する場所
/* DB登録と重複チェックを行う
  【DBに関係するチェック】 */
// ==================================================

/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { TeamFormValues } from "../schema";

/* フォームから受け取ったチーム情報を確認し、
チーム名の重複がなければDBに登録して詳細ページへ遷移する関数 */
export async function createTeam(data: TeamFormValues) {
  /* 【.trim()】
  文字列の両端にある空白文字（スペースや改行など）を取り除き、
  新しい文字列を返す */
  const teamName = data.teamName.trim();
  const teamColor = data.teamColor.trim();
  const coach = data.coach.trim()

// チーム名重複チェック ---------------------------------
  /* 受け取ったデータのteamNameを条件にTeamsテーブルを検索、
  一致するチームがあればexistingTeamとに格納 */
  const existingTeam = await prisma.teams.findUnique({
    where: {
      teamName,
    },
  });

  /* 一致するチームが存在した場合は、
  Errorオブジェクトを作成して例外を投げる */
  if (existingTeam) {
    throw new Error("同じチーム名がすでに登録されています");
  }
// ---------------------------------------------------

/* チーム名重複チェックに問題がなければTeamを1件登録する */
  const team = await prisma.teams.create({
    data: {
      teamName,
      teamColor,
      prefecture: data.prefecture,
      coach,
      memo: data.memo,
    },
  });

  /* 登録したチームの詳細ページに遷移する */
  redirect(`/teams/${team.teamId}`);
}
