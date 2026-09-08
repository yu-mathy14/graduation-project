import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{teamId: string}>;
};

export default async function TeamDetailPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number(teamId); // teamId(文字列)を数値に変換し、idに格納

  const team = await prisma.teams.findUnique({
    where: { teamId: id },
  });

  /* チームが見つからなかった場合、404ページを表示する */
  if (!team) notFound();

  return (
    <div>

      {/* チーム一覧に戻るための遷移リンク */}
      <Link href="/teams">
      ←チーム一覧に戻る
      </Link>

      <Link href={`/players/${team.teamId}`}></Link>

      <h1>チーム詳細</h1>

      {/* チーム情報 */}
      <section>
        <h2>チーム情報</h2>
        <table>
          <tbody>

            <tr>
              <th>チームID</th>
              <td>{team.teamId}</td>
            </tr>

            <tr>
              <th>チーム名</th>
              <td>{team.teamName}</td>
            </tr>

            <tr>
              <th>チームカラー</th>
              <td>
                <div style={{
                  display: "inline-block", // 後から見た目を整える時用
                  backgroundColor: team.teamColor,
                  width: "15px",
                  height: "15px",
                }}/>
              </td>
            </tr>

            <tr>
              <th>カラーコード</th>
              <td>{team.teamColor}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <Link href={`/players/${id}`}>
        所属選手一覧へ
      </Link>

    </div>
  );
}