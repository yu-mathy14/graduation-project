import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamPlayersPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number( teamId ); // teamId(文字列)を数値に変換し、idに格納

  // Prismaを使ってTeamsテーブルから該当のチーム情報(1件)を取得
  const team = await prisma.teams.findUnique({
    where: { 
      teamId: id
    },
  });

  // Prismaを使ってPlayersテーブルから該当チームの選手を全件取得
  const players = await prisma.players.findMany({
    where: { 
      teamId: id
    },
    orderBy: {
      jerseyNumber: "asc", // 背番号の昇順
    },
  });

  /* チームが見つからなかった場合、404ページを表示する */
  if (!team) notFound();

  return (
    <div>
      <Link href={`/teams/${id}`}>
        ←チーム情報へ戻る
      </Link>

      <section>
        <h1>【{team.teamName}】所属選手一覧</h1>

        {/* 【三項演算子】条件式：players配列の中身が0件 */}
        {players.length === 0 ? (
          <p>選手が登録されていません</p>
        ) : (
          /* players配列の中身が1件以上の場合、表として表示 */
          <table>
            {/* 見出しを作る */}
            <thead>
              <tr>
                <th>背番号</th>
                <th>氏名</th>
              </tr>
            </thead>

            {/* 1つ1つのデータを作る */}
            <tbody>
              {players.map((p) => (
                <tr key={p.playerId}>
                  {/* 背番号 */}
                  <td>{p.jerseyNumber}</td>

                  {/* 氏名 */}
                  <td>{p.playerNameKanji}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p>登録済選手：{players.length}人</p>
      </section>
      

    </div>
  );

}