// Players編集ページを表示する
/* 選手と所属チームの確認、ページ構成を担当し、
  入力フォームはPlayerForm.tsxに分離する
  URLのteamIdと選手の所属チームも確認する */
// ==================================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import PlayerForm from "./components/PlayerForm";

// このページに拡張されるデータの型定義
type Props = {
  params: Promise<{
    teamId: string;
    playerId: string;
  }>;
};

export default async function PlayerEditPage({ params }: Props) {
  const { playerId, teamId } = await params;
  const pId = Number( playerId ); // playerId(文字列)を数値に変換し、pIdに格納
  const tId = Number( teamId ); // teamId(文字列)を数値に変換し、tIdに格納

  // Prismaを使ってPlayersテーブルから該当の選手情報(1件)を取得
  const player = await prisma.players.findUnique({
    where: { playerId: pId },
  });

  /* 選手が見つからなかった場合、404ページを表示する */
  if (!player) notFound();

  /* URLのteamIdと、選手の実際の所属チームが一致するか確認 */
  if (player.teamId !== tId) {
    notFound();
  }

  // Prismaを使ってTeamsテーブルから該当のチーム情報(1件)を取得
  const team = await prisma.teams.findUnique({
    where: { teamId: tId },
  });

  /* チームが見つからなかった場合、404ページを表示する */
  if (!team) notFound();

  return (
    <div>
      {/*　選手詳細に戻るためのリンク */}
      <Link href={`/teams/${tId}/players/${pId}`}>
        ←選手詳細に戻る
      </Link>

      <h1>選手情報を編集</h1>

      <p>所属チーム：{team.teamName}</p>
      <p>※ 所属チームは登録後に変更できません。</p>

      {/* React Hook Form + Yupを使った入力フォームを表示 */}
      <PlayerForm
      /* これらはすべて属性ではなくProps */
        playerId={player.playerId}
        teamId={team.teamId}
        playerNameKanji={player.playerNameKanji}
        playerNameKana={player.playerNameKana}
        jerseyNumber={player.jerseyNumber}
        almaMater={player.almaMater}
        height={player.height}
        weight={player.weight}
      />

      {/* 更新キャンセル時は選手詳細に遷移 */}
      <Link href={`/teams/${tId}/players/${pId}`}>
        キャンセル
      </Link>
    </div>

  );
}