// Players新規登録ページを表示する
/* 所属チームの確認とページ構成を担当し、
入力フォームはPlayerForm.tsxに分離する */
// ==================================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import PlayerForm from "./components/PlayerForm";

type Props = {
  params: Promise<{ teamId: string }>;
};

/**
 * 選手登録ページ
 * `/teams/[teamId]/players/new`に対応するサーバーコンポーネント
 * ページの構成と画面遷移を担当し、入力フォームはPlayerForm.tsxに分離している。
 */

export default async function PlayerNewPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number(teamId); // teamId(文字列)を数値に変換し、idに格納

  // Teamテーブルから所属先のチームを取得
  const team = await prisma.teams.findUnique({
    where: { teamId: id },
  });

  /* チームが見つからなかった場合、404ページを表示する */
  if (!team) notFound();

  return (
    <div>
      {/*　選手一覧に戻るためのリンク */}
      <Link href={`/teams/${team.teamId}/players`}>
        ←選手一覧に戻る
      </Link>

      <h1>選手を登録</h1>

      <p>所属チーム：{team.teamName}</p>
      <p>※ 所属チームは登録後に変更できません。
        <br />
        登録内容を確認してから登録してください。
        <br />
        登録後にチームを間違えた場合は、
        <br />
        スタッツが登録されていなければ選手を削除して、
        <br />
        正しいチームで再登録してください。
      </p>

      {/* React Hook Form + Yupを使った入力フォームを表示 */}
      <PlayerForm teamId={team.teamId} />

      {/* 登録キャンセル時は選手一覧に遷移 */}
      <Link href={`/teams/${team.teamId}/players`}>
        キャンセル
      </Link>

    </div>
  );
}