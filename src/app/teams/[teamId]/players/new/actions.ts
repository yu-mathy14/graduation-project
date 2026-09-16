// フォームから受け取った選手情報を確認し、
/* 同じチーム内の背番号重複がなければDBに登録して詳細ページへ遷移する */
// ==================================================

/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { PlayerFormValues } from "../schema";

export async function createPlayer(
  teamId: number,
  data: PlayerFormValues
) {
  /* 前後の空白を除去 */
  const playerNameKanji = data.playerNameKanji.trim();
  const playerNameKana = data.playerNameKana.trim();
  const almaMater = data.almaMater.trim();

  // 同じチーム内の背番号重複チェック ----------------------
  /* 指定したチームIDと背番号が一致する選手を検索 */
  const existingPlayer = await prisma.players.findFirst({
    where: {
      teamId,
      /* フォームから受け取った背番号は文字列なので、Number()で数値型に変換 */
      jerseyNumber: Number(data.jerseyNumber),
    },
  });

  /* 一致する選手が存在した場合は、
  Errorオブジェクトを作成して例外を投げる */
  if (existingPlayer) {
    throw new Error(
    "このチームには同じ背番号の選手がすでに登録されています"
    );
  }
  // ---------------------------------------------------

  /* 背番号重複チェックに問題がなければPlayerを1件登録する */
  const player = await prisma.players.create({
    data: {
      teamId,
      playerNameKanji,
      playerNameKana,
      jerseyNumber: Number(data.jerseyNumber),
      almaMater,
    /* 身長・体重が入力されていれば数値型に変換し、未入力ならnullを登録 */
      height: data.height ? Number(data.height) : null,
      weight: data.weight ? Number(data.weight) : null,
    },
  });

  /* 登録した選手の詳細ページへ遷移 */
  redirect(`/teams/${teamId}/players/${player.playerId}`);
}
