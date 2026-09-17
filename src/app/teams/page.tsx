import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";

export default async function TeamsPage() {
  // Prismaを使ってTeamsテーブルから全件取得
  const teams = await prisma.teams.findMany({
    orderBy: {
      teamId: "asc", // チームIDの昇順
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>チーム一覧</h1>

        {/* チーム登録ページへのリンク */}
        <Link
          href="/teams/new"
          className={styles.newLink}
        >
          新規登録
        </Link>
      </div>

      <div className={styles.content}>
        {/* 【三項演算子】teamsが0件かどうかで表示を切り替える */}
        {teams.length === 0 ? (
          <div className={styles.empty}>
            <p>チームが登録されていません</p>

            <Link
              href="/teams/new"
              className={styles.newLink}
            >
              新規登録
            </Link>
          </div>
        ) : (
          /* teams配列の中身が1件以上の場合、表として表示 */
          <table className={styles.table}>
            {/* 見出しを作る */}
            <thead>
              <tr>
                <th className={styles.th}>チーム名</th>
                <th className={styles.th}></th>
              </tr>
            </thead>

            {/* 1つ1つのデータを作る */}
            <tbody>
              {teams.map((t) => (
                <tr key={t.teamId}>
                  {/* チーム名
                  -> クリックでチーム詳細ページへ遷移 */}
                  <td className={styles.td}>{t.teamName}</td>

                  {/* チーム詳細へ遷移するリンク
                  → チーム情報すべてを確認することができる */}
                  <td className={styles.td}>
                    <Link
                      href={`/teams/${t.teamId}`}
                      className={styles.detailLink}
                    >
                      詳しく見る
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className={styles.count}>合計：{teams.length}件</p>
      </div>
    </div>
  );
}