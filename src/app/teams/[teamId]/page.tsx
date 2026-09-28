import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import common from "@/app/common.module.css";

type Props = {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{
    from?: string;
    returnTeamId?: string;
  }>;
};

export default async function TeamDetailPage({
  params,
  searchParams,
}: Props) {
  const { teamId } = await params;
  const id = Number( teamId ); // teamId(文字列)を数値に変換し、idに格納
  const { from, returnTeamId } = await searchParams;
  const returnId = Number(returnTeamId);

  // 遷移元のチーム情報を取得
  const returnTeam =
    from === "team" && Number.isInteger(returnId)
      /* 他チームの詳細ページからきた場合 */
      ? await prisma.teams.findUnique({
          where: { teamId: returnId },
        })
      : null

  // Prismaを使ってTeamsテーブルから該当のチーム情報(1件)を取得
  const team = await prisma.teams.findUnique({
    where: { teamId: id },
    // 件数も一緒に取得
    include: {
      _count: {
        /* 取得する件数の項目 */
        select: {
          player: true, // 所属選手
          homeGames: true, // ホームチームとして参加した試合
          awayGames: true, // アウェイチームとして参加した試合
        }
      }
    }
  });

  /* チームが見つからなかった場合、404ページを表示する */
  if (!team) notFound();

  // チームが出場した直近3試合を取得
  const recentGames = await prisma.games.findMany({
    where: {
      /* idと下記いずれかが一致する試合を取得 */
      OR: [
        { homeTeamId: id },
        { awayTeamId: id },
      ],
    },
    // include：関連するテーブルを一緒に取得する
    include: {
      /* Gamesに紐づいているhomeTeam/awayTeamも取得する */
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      tipoffTime: "desc", // 試合開始日時が新しい順
    },
    take: 3, // 最大3件取得
  });

  /* 削除不可理由特定のために理由毎に削除可否を判定する */
  // 理由1：所属選手がいる
  const hasPlayers = team._count.player > 0;
  // 理由2：試合参加歴がある(仕様上単体では通常発生しない)
  const hasGames =
    team._count.homeGames > 0 || // ホームチームとして
    team._count.awayGames > 0;   // アウェイチームとして

  /* 2つの理由をもとにチーム削除可否を判定し、結果を定数に格納 */
  const canDeleteTeam = !hasPlayers && !hasGames;

  return (
    <div className={styles.container}>

      {/* 戻るリンクを条件分岐 */}
        {from === "team" && returnTeamId ? (
          /* 他チームから来た場合 */
          <div>
            <Link
              href={`/teams/${returnId}`}
              className={common.link}
            >
              【{returnTeam?.teamName}】チーム情報に戻る
            </Link>

            <br />

            <Link
              href={`/teams/${id}/players`}
              className={common.link}
            >
              【{team.teamName}】所属選手一覧へ
            </Link>
          </div>
        ) : (
          /* チーム一覧から来た場合 */
          <div>
            <Link
              href="/teams"
              className={common.link}
            >
              チーム一覧に戻る
            </Link>
            <br />
            <Link
              href={`/teams/${id}/players`}
              className={common.link}
            >
              所属選手一覧へ
            </Link>
          </div>
        )}

      {/* チーム操作用リンク */}
      <div className={styles.actions}>

        {/* チーム情報編集ページへの遷移リンク */}
        <Link
          href={`/teams/${id}/edit`}
          className={common.button}
        >
          編集する
        </Link>

        {/* チーム削除可能な場合、削除確認ページへの遷移リンクを表示 */}
        {canDeleteTeam && (
          <Link
            href={`/teams/${id}/delete`}
            className={common.button}
          >
            削除
          </Link>
        )}
      </div>

      {/* 削除不可の場合、理由を表示 */}
      {(hasPlayers || hasGames) && (
        <div className={common.notice}>
          {/* パターン1：所属選手がいるのみ */}
          {hasPlayers && !hasGames && (
            <p>
              このチームには所属選手がいるため、削除できません。
            </p>
          )}

          {/* パターン2：試合参加歴があるのみ */}
          {/* 通常操作では発生しない想定だが、安全性のために作成 */}
          {!hasPlayers && hasGames && (
            <p>
              このチームは試合に参加した記録があるため、削除できません。
            </p>
          )}

          {/* パターン3：理由1 かつ 理由2 */}
          {hasPlayers && hasGames && (
            <p>
              このチームは以下の理由で削除できません。<br />
              ・所属選手がいる<br />
              ・試合に参加した記録がある
            </p>
          )}
        </div>
      )}

      {/* チーム情報 */}
      <section className={styles.teamInfo}>
        <h1 className={styles.title}>チーム情報</h1>

        <table className={common.table}>
          <tbody>

            <tr>
              <th className={common.th}>チーム名</th>
              <td className={common.td}>
                <span
                  className={styles.teamColor}
                  style={{
                    backgroundColor: team.teamColor,
                  }}
                />
                {team.teamName}
              </td>
            </tr>

            <tr>
              <th className={common.th}>都道府県</th>
              <td className={common.td}>
                {team.prefecture}
              </td>
            </tr>

            <tr>
              <th className={common.th}>監督</th>
              <td className={common.td}>
                {team.coach}
              </td>
            </tr>

            <tr>
              <th className={common.th}>メモ</th>
              <td className={`${common.td} ${styles.memo}`}>
                {team.memo}
              </td>
            </tr>

          </tbody>
        </table>
      </section>

      {/* 直近3試合の成績 */}
      <section className={styles.recentGames}>
        <h2 className={styles.title}>直近3試合</h2>

        {recentGames.length === 0 ? (
          <p>試合記録がありません。</p>
        ) : (
          <table className={common.table}>
            {/* 見出しを作る */}
            <thead>
              <tr>
                <th className={common.th}>対戦日時</th>
                <th className={common.th}>対戦相手</th>
                <th className={common.th}>スコア</th>
                <th className={common.th}>結果</th>
                <th className={common.th}></th>
              </tr>
            </thead>

            {/* データの値の表示部分 */}
            <tbody>
              {recentGames.map((game) => {
                /* ホームチームとして参加したか判定し定数に格納 */
                const isHome = game.homeTeamId === id;

                /* 対戦相手のチーム名を定数に格納 */
                const opponent = isHome
                  ? game.awayTeam.teamName
                  : game.homeTeam.teamName;
                
                /* 対戦相手のチームIDを定数に格納 */
                const opponentTeamId = isHome
                  ? game.awayTeamId
                  : game.homeTeamId;

                /* 自チームの最終スコアを定数に格納 */
                const myScore = isHome
                  ? game.homeScore
                  : game.awayScore;

                /* 相手チームの最終スコアを定数に格納 */
                const opponentScore = isHome
                  ? game.awayScore
                  : game.homeScore;

                /* 勝敗引分判定をし、結果を定数に格納 */
                const result =
                  myScore > opponentScore
                    ? "勝"
                    : myScore < opponentScore
                      ? "負"
                      : "引分";

                return (
                  <tr key={game.gameId}>
                    <td className={common.td}>
                      {/* 対戦日時を見やすい形式に変更 */}
                      {game.tipoffTime.toLocaleString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* 対戦相手 */}
                    <td className={common.td}>
                      {/* 該当のチームの詳細ページに遷移 */}
                      <Link
                        href={`/teams/${opponentTeamId}?from=team&returnTeamId=${id}`}
                        className={common.subLink}
                      >
                        {opponent}
                      </Link>
                    </td>

                    {/* スコア */}
                    <td className={common.td}>
                      {myScore}-{opponentScore}
                    </td>

                    {/* 結果 */}
                    <td className={common.td}>
                      {result}
                    </td>

                    {/* 該当の試合の詳細ページに遷移 */}
                    <td className={common.td}>
                      <Link
                        href={`/games/${game.gameId}?from=team&teamId=${id}`}
                        className={common.link}
                      >
                        試合詳細へ
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

    </div>
  );
}