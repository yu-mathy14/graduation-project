import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TeamsPage() {
  // Prismaを使ってTeamsテーブルから全件取得
  const teams = await prisma.teams.findMany({
    orderBy: {
      teamId: "asc", // チームIDの昇順
    }
  });

  return (
    <div>
      <h1>チーム一覧</h1>

      {/* 【三項演算子】条件式：teams配列の中身が0件 */}
      {teams.length === 0 ? (
        <p>チームが登録されていません</p>
      ) : (
        /* teams配列の中身が1件以上の場合、表として表示 */
        <table>
          {/* 見出しを作る */}
          <thead>
            <tr>
              <th>ID</th>
              <th>チーム名</th>
              <th>チームカラー</th>
              <th>カラーコード</th>
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
                <td>
                  <Link href={`/teams/${t.teamId}`}>
                    {t.teamName}
                  </Link>
                </td>

                {/* DBのカラーコードを実際の色として表示 */}
                <td>
                  <div
                    style={{
                      backgroundColor: t.teamColor,
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </td>
                {/* カラーコードの表示 */}
                <td>{t.teamColor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>合計：{teams.length}件</p>
    </div>
  );
}