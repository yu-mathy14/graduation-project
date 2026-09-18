import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

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
    // スタッツ数も一緒に取得する
    include: {
      _count: {
        select: {
          stats: true,
        },
      },
    },
  });

  /* 選手が見つからなかった場合、404ページを表示する */
  if (!player) notFound();

  /* URLのteamIdと、選手の実際の所属チームが一致するか確認 */
  if (player.teamId !== tId) {
    notFound();
  }

  /* 選手削除可否を判定し、結果を定数に格納 */
  const canDeletePlayer = player._count.stats === 0;
  

  // Prismaを使ってTeamsテーブルから該当のチーム情報(1件)を取得
  const team = await prisma.teams.findUnique({
    where: { teamId: tId },
  });

  /* チームが見つからなかった場合、404ページを表示する */
  if (!team) notFound();

  return (
    <div className={styles.container}>

      {/* 所属選手一覧に戻るための遷移リンク */}
      <Link
        href={`/teams/${team.teamId}/players`}
        className={styles.backLink}
      >
        ←所属選手一覧へ戻る
      </Link>

      {/* 選手操作用リンク */}
      <div className={styles.actions}>
        {/* 選手情報編集ページへの遷移リンク */}
        <Link
          href={`/teams/${tId}/players/${pId}/edit`}
          className={styles.editLink}
        >
          編集
        </Link>

        {/* 選手削除可能な場合、削除確認ページへの遷移リンクを表示 */}
        {canDeletePlayer && (
          <Link
            href={`/teams/${tId}/players/${pId}/delete`}
            className={styles.deleteLink}
          >
            削除
          </Link>
        )}
      </div>

      {/* 選手削除不可の場合、理由を表示 */}
      {!canDeletePlayer && (
        <div className={styles.errorArea}>
          <p>
            この選手には試合スタッツが登録されているため、削除できません。
          </p>
        </div>
      )}

      {/* 選手情報 */}
      <section className={styles.playerInfo}>
        <h1 className={styles.title}>
          【{team.teamName}】選手情報
        </h1>

        <table className={styles.table}>
          <tbody>
            <tr>
              <th className={styles.th}>背番号</th>
              <td className={styles.td}>{player.jerseyNumber}</td>
            </tr>

            <tr>
              <th className={styles.th}>氏名</th>
              <td className={styles.td}>{player.playerNameKanji}</td>
            </tr>

            <tr>
              <th className={styles.th}>かな</th>
              <td className={styles.td}>{player.playerNameKana}</td>
            </tr>

            <tr>
              <th className={styles.th}>身長(cm)</th>
              <td className={styles.td}>{player.height}</td>
            </tr>

            <tr>
              <th className={styles.th}>体重(kg)</th>
              <td className={styles.td}>{player.weight}</td>
            </tr>

            <tr>
              <th className={styles.th}>出身校</th>
              <td className={styles.td}>{player.almaMater}</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}