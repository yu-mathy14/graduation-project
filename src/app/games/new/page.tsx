// Games新規登録ページを表示する
/* 登録に必要なチーム情報を取得し、
入力フォームはGameForm.tsxに分離する */
// ==================================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import GameForm from "./components/GameForm";

/**
 * 試合登録ページ
 * `/games/new`に対応するサーバーコンポーネント
 * 登録に必要なチーム情報を取得し、入力フォームを表示する。
 */

export default async function GameNewPage() {
  // Prismaを使ってTeamsテーブルから全件取得
  const teams = await prisma.teams.findMany({
    orderBy: {
      teamId: "asc", // チームIDの昇順
    },
    // 所属選手数も一緒に取得する
    include: {
      _count: {
        select: {
          player: true,
        },
      },
    },
  });

  /* チームが2チーム未満の場合、試合を登録できないため404ページを表示 */
  if (teams.length < 2) notFound();


  return (
    <div>
      {/*　試合一覧に戻るためのリンク */}
      <Link href="/games">
        ←試合一覧に戻る
      </Link>

      <h1>試合を登録</h1>

      {/* React Hook Form + Yupを使った入力フォームを表示 */}
      <GameForm teams={teams} />

      {/* 登録キャンセル時は試合一覧ページに遷移 */}
      <Link href="/games">
        キャンセル
      </Link>

    </div>

  );

}