import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    <>
      <div>
        <h1>試合一覧</h1>

        {/* 試合登録ページへのリンク */}
        <Link href="/games/new">
          新規登録
        </Link>
      </div>

      <div>
        {/* 【三項演算子】gamesの件数が0件かどうかで表示を切り替える */}
        {games.length === 0 ? (
          <p>試合が登録されていません</p>
        ) : (
          /* games配列の中身が1件以上の場合、表として表示 */
            <table>
              {/* 見出しを作る */}
              <thead>
                <tr>
                  <th>対戦日時</th>
                  <th>スコア</th>
                  <th></th>
                </tr>
              </thead>

              {/* 1つ1つのデータを作る */}
              <tbody>
                {games.map((g) => (
                  <tr key={g.gameId}>
                    {/* 対戦日時 */}
                    <td>{g.tipoffTime.toLocaleString("ja-JP", {
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
                    <td>
                      <div>
                        {g.homeTeam.teamName} {g.homeScore}-{g.awayScore} {g.awayTeam.teamName}
                      </div>
                    </td>

                    {/* 試合詳細(実装前)へ遷移するリンク
                    → その試合のスタッツを確認することができる */}
                    <td>
                      <Link href={`/games/${g.gameId}`}>
                        詳しく見る
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
      </div>
    </>
    
  );
}