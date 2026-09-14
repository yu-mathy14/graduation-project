// フォームから受け取った選手情報を確認し、
/* 自分自身を除いて背番号の重複を確認したあとDBを更新する */
// ==================================================

/* この関数はサーバー側で実行する処理です
  とNext.jsに伝えるためのServer Actionの宣言 */
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { PlayerFormValues } from "../../schema";

/* フォームから受け取った選手情報を確認し、
  編集対象の選手自身を除いて指定したチームIDと背番号が一致する選手
  の重複がなければDBを更新して詳細ページへ遷移する関数 */
export async function updatePlayer(
  playerId: number,
  teamId: number,
  data: PlayerFormValues
) {
  /* 前後の空白を除去 */
  const playerNameKanji = data.playerNameKanji.trim();
  const playerNameKana = data.playerNameKana.trim();
  const almaMater = data.almaMater.trim();

  // 同じチーム内の背番号重複チェック ----------------------
  /* 編集対象の選手自身を除いて、
     指定したチームIDと背番号が一致する選手を検索 */
  /* findUnique()ではなくfindFirst()なのは、
    teamIdとjerseyNumberが一致し、かつplayerIdが編集中の選手IDと異なる
    という複数の条件で検索するため */
  const existingPlayer = await prisma.players.findFirst({
    where: {
      teamId,
      /* フォームから受け取った背番号は文字列なので、Number()で数値型に変換 */
      jerseyNumber: Number(data.jerseyNumber),
      playerId: {
        /* 編集対象の選手自身を除外 */
        not: playerId,
      },
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

  /* 指定した選手を更新 */
  await prisma.players.update({
    where: {
      playerId,
    },
    data: {
      /* teamIdは選手登録後のチーム変更不可のため更新しない */
      playerNameKanji,
      playerNameKana,
      jerseyNumber: Number(data.jerseyNumber),
      almaMater,
    /* 身長・体重が入力されていれば数値型に変換し、未入力ならnullを登録 */
      height: data.height ? Number(data.height) : null,
      weight: data.weight ? Number(data.weight) : null,
    },
  });

  /* 更新した選手の詳細ページへ遷移 */
  redirect(`/teams/${teamId}/players/${playerId}`);
}