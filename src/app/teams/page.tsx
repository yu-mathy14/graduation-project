import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TeamsPage() {
  // Prismaを使ってTeamsテーブルから全件取得
  const teams = await prisma.teams.findMany({
    orderBy: {
      teamId: "asc", // チームIDの昇順
    },
  });

  return (
    <>
      <div>
        <h1>チーム一覧</h1>

        {/* チーム登録ページへのリンク */}
        <Link href="/teams/new">
          新規登録
        </Link>
      </div>

      <div>
        {/* 【三項演算子】teamsが0件かどうかで表示を切り替える */}
        {teams.length === 0 ? (
          <>
            <p>チームが登録されていません</p>

            <Link href="/teams/new">
              新規登録
            </Link>
          </>
          
        ) : (
          /* teams配列の中身が1件以上の場合、表として表示 */
          <table>
            {/* 見出しを作る */}
            <thead>
              <tr>
                <th>ID</th>
                <th>チーム名</th>
                <th></th>
              </tr>
            </thead>

            {/* 1つ1つのデータを作る */}
            <tbody>
              {teams.map((t) => (
                <tr key={t.teamId}>
                  {/* チームID */}
                  <td>{t.teamId}</td>

                  {/* チーム名
                  -> クリックでチーム詳細ページへ遷移 */}
                  <td>{t.teamName}</td>

                  {/* チーム詳細へ遷移するリンク
                  → チーム情報すべてを確認することができる */}
                  <td>
                    <Link href={`/teams/${t.teamId}`}>
                      詳しく見る
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p>合計：{teams.length}件</p>
      </div>
    </>  
  );
}