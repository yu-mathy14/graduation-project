// Teams編集ページを表示する
/* 現在のチーム情報を取得し、
入力フォームはTeamForm.tsxに分離する */
// ==================================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import TeamForm from "./components/TeamForm";
import styles from "./page.module.css";
import common from "@/app/common.module.css";

// このページに拡張されるデータの型定義
/* paramsにはteamIdという文字列が入っている */
type Props = {
  /* 【Promise】∵ URLから取るまでteamIdが入ってくるか確定しないので非同期 */
  params: Promise<{ teamId: string }>;
};

export default async function TeamEditPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number(teamId); // teamId(文字列)を数値に変換し、idに格納

  // Prismaを使ってTeamテーブルから対象のチームを1件取得
  /* 該当するチームがあればチームオブジェクト、なければnullが返る */
  const team = await prisma.teams.findUnique({
    where: { teamId: id },
  });

  /* チームが見つからなかったら404ページを表示する */
  if (!team) notFound();

  return (
    <div className={styles.container}>
      {/* チーム詳細に戻るための遷移リンク */}
      <Link
        href={`/teams/${id}`}
        className={common.link}
      >
        ←チーム詳細に戻る
      </Link>

      <h1 className={styles.title}>チーム情報を編集</h1>

      {/* React Hook Form + Yupを使った入力フォームを表示 */}
      <TeamForm
        teamId={team.teamId}
        teamName={team.teamName}
        teamColor={team.teamColor}
      />
    </div>
  );
}