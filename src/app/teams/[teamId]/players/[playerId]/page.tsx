import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import common from "@/app/common.module.css";
import { calculatePlayerPoints } from "@/app/games/[gameId]/stats/utils";

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

  // 選手が出場した直近3試合のスタッツを取得
  const recentStats = await prisma.stats.findMany({
    where: {
      playerId: pId, // 該当の選手IDと一致
    },
    // include：関連するテーブルを一緒に取得する
    include: {
      /* Statsに紐づくGamesも取得する */
      game: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: {
      /* 試合テーブルの試合開始日時が新しい順に */
      game: {
        tipoffTime: "desc",
      },
    },
    take: 3, // 最大3件まで取得する
  });
  

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
        className={common.link}
      >
        ←所属選手一覧へ戻る
      </Link>

      {/* 選手操作用リンク */}
      <div className={styles.actions}>
        {/* 選手情報編集ページへの遷移リンク */}
        <Link
          href={`/teams/${tId}/players/${pId}/edit`}
          className={common.button}
        >
          編集
        </Link>

        {/* 選手削除可能な場合、削除確認ページへの遷移リンクを表示 */}
        {canDeletePlayer && (
          <Link
            href={`/teams/${tId}/players/${pId}/delete`}
            className={common.button}
          >
            削除
          </Link>
        )}
      </div>

      {/* 選手削除不可の場合、理由を表示 */}
      {!canDeletePlayer && (
        <div className={common.notice}>
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

        <table className={common.table}>
          <tbody>
            <tr>
              <th className={common.th}>背番号</th>
              <td className={common.td}>{player.jerseyNumber}</td>
            </tr>

            <tr>
              <th className={common.th}>氏名</th>
              <td className={common.td}>{player.playerNameKanji}</td>
            </tr>

            <tr>
              <th className={common.th}>かな</th>
              <td className={common.td}>{player.playerNameKana}</td>
            </tr>

            <tr>
              <th className={common.th}>身長(cm)</th>
              <td className={common.td}>{player.height}</td>
            </tr>

            <tr>
              <th className={common.th}>体重(kg)</th>
              <td className={common.td}>{player.weight}</td>
            </tr>

            <tr>
              <th className={common.th}>出身校</th>
              <td className={common.td}>{player.almaMater}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 直近3試合のスタッツ */}
      <section className={styles.recentStats}>
        <h2 className={styles.title}>直近の試合のスタッツ</h2>

        {recentStats.length === 0 ? (
          <p>スタッツ記録がありません。</p>
        ) : (
          <div className={styles.recentStatsTable}>
            <table className={common.table}>
              {/* 見出し部分 */}
              <thead>
                <tr>
                  <th className={`${common.th} ${styles.stickyDate}`}>
                    対戦日時
                  </th>
                  <th className={`${common.th} ${styles.stickyOpponent}`}>
                    対戦相手
                  </th>
                  <th className={common.th}>PTS</th>
                  <th className={common.th}>3P</th>
                  <th className={common.th}>2P</th>
                  <th className={common.th}>FT</th>
                  <th className={common.th}>RBD</th>
                  <th className={common.th}>AST</th>
                  <th className={common.th}>BLK</th>
                  <th className={common.th}>出場時間</th>
                  <th className={`${common.th} ${styles.detailLink}`}></th>
                </tr>
              </thead>

              {/* 実際のデータ部分 */}
              <tbody>
                {recentStats.map((stat) => {
                  /* ホームチームかアウェイチームかを判定 */
                  const isHome = stat.game.homeTeamId === tId;

                  /* 対戦相手のチーム名を取得 */
                  const opponent = isHome
                    ? stat.game.awayTeam.teamName
                    : stat.game.homeTeam.teamName;

                  /* リバウンド合計 */
                  const rbd = stat.oRbd + stat.dRbd;

                  /* 得点 */
                  const pts = calculatePlayerPoints(stat);

                  /* 出場時間を「分:秒」に変換 */
                  const minutes = Math.floor(stat.playSec / 60);
                  const seconds = stat.playSec % 60;
                  const playTime =
                    `${minutes}:${String(seconds).padStart(2, "0")}`;

                  return (
                    <tr key={stat.gameId}>
                      <td className={`${common.td} ${styles.stickyDate}`}>
                        {/* 見やすい日時表示に変換 */}
                        {stat.game.tipoffTime.toLocaleString("ja-JP", {
                          timeZone: "Asia/Tokyo",
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className={`${common.td} ${styles.stickyOpponent}`}>
                        {opponent}
                      </td>

                      <td className={common.td}>
                        {pts}
                      </td>

                      <td className={common.td}>
                        {stat.p3M}/{stat.p3A}
                      </td>

                      <td className={common.td}>
                        {stat.p2M}/{stat.p2A}
                      </td>

                      <td className={common.td}>
                        {stat.ftM}/{stat.ftA}
                      </td>

                      <td className={common.td}>
                        {rbd}
                      </td>

                      <td className={common.td}>
                        {stat.ast}
                      </td>

                      <td className={common.td}>
                        {stat.blk}
                      </td>

                      <td className={common.td}>
                        {playTime}
                      </td>

                      <td className={`${common.td} ${styles.detailLink}`}>
                        <Link
                          href={`/games/${stat.gameId}?from=player&teamId=${tId}&playerId=${pId}`}
                          className={common.link}
                        >
                          詳しく見る
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}