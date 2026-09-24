import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";
import common from "@/app/common.module.css";

export default async function GamesPage() {
  // Prismaを使ってGamesテーブルから全件取得
  const games = await prisma.games.findMany({
    orderBy: {
      gameId: "desc", // 試合IDの降順
    },
    // include：関連するテーブルを一緒に取得する
    include: {
      /* Gamesに紐づいているhomeTeam/awayTeamも取得する */
      homeTeam: true,
      awayTeam: true,
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>試合一覧</h1>

        {/* 試合登録ページへのリンク */}
        <Link
          href="/games/new"
          className={common.button}
        >
          新規登録
        </Link>
      </div>

      <div className={styles.content}>
        {/* 【三項演算子】gamesの件数が0件かどうかで表示を切り替える */}
        {games.length === 0 ? (
          <div className={common.empty}>
            <p>試合が登録されていません</p>

            <Link
              href="/games/new"
              className={common.button}
            >
              新規登録
            </Link>
          </div>
        ) : (
          /* games配列の中身が1件以上の場合、表として表示 */
          <table className={common.table}>
            {/* 見出しを作る */}
            <thead>
              <tr>
                <th className={common.th}>対戦日時</th>
                <th className={common.th}>スコア</th>
                <th className={common.th}></th>
              </tr>
            </thead>

            {/* 1つ1つのデータを作る */}
            <tbody>
              {games.map((g) => (
                <tr key={g.gameId}>
                  {/* 対戦日時 */}
                  <td className={common.td}>
                    {g.tipoffTime.toLocaleString("ja-JP", {
                      timeZone: "Asia/Tokyo",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* スコア
                  -> ホームチーム名 点 - 点 アウェイチーム名 */}
                  <td className={common.td}>
                    {g.homeTeam.teamName}{" "}
                    {g.homeScore}-{g.awayScore}{" "}
                    {g.awayTeam.teamName}
                  </td>

                  {/* 試合詳細(実装前)へ遷移するリンク
                  → その試合のスタッツを確認することができる */}
                  <td className={common.td}>
                    <Link
                      href={`/games/${g.gameId}`}
                      className={common.link}
                    >
                      詳しく見る
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}