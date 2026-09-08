import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    teamId: string;
    playerId: string;
  }>;
};

export default async function PlayerDetailPage({ params }: Props) {
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
      {/* 所属選手一覧に戻るための遷移リンク */}
      <Link href={`/teams/${team.teamId}/players`}>
        ←所属選手一覧へ戻る
      </Link>

      <section>
        <h2>【{team.teamName}】選手情報</h2>
        <table>
          <tbody>
            <tr>
              <th>背番号</th>
              <td>{player.jerseyNumber}</td>
            </tr>

            <tr>
              <th>氏名</th>
              <td>{player.playerNameKanji}</td>
            </tr>

            <tr>
              <th>かな</th>
              <td>{player.playerNameKana}</td>
            </tr>

            <tr>
              <th>身長(cm)</th>
              <td>{player.height}</td>
            </tr>

            <tr>
              <th>体重(kg)</th>
              <td>{player.weight}</td>
            </tr>

            <tr>
              <th>出身校</th>
              <td>{player.almaMater}</td>
            </tr>

          </tbody>
        </table>
      </section>


    </div>
  );
}