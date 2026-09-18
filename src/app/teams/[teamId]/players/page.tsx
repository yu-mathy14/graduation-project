import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamPlayersPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number(teamId); // teamId(文字列)を数値に変換し、idに格納

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
    <div className={styles.container}>

      {/* チーム情報へ戻るための遷移リンク */}
      <Link
        href={`/teams/${id}`}
        className={styles.backLink}
      >
        ←チーム情報へ戻る
      </Link>

      <section className={styles.playerList}>
        <h1 className={styles.title}>
          【{team.teamName}】所属選手一覧
        </h1>

        {/* 【三項演算子】条件式：players配列の中身が0件かどうか */}
        {players.length === 0 ? (
          <div className={styles.empty}>
            <p>選手が登録されていません</p>

            <Link
              href={`/teams/${id}/players/new`}
              className={styles.newLink}
            >
              選手の登録
            </Link>
          </div>

        ) : (
          /* 選手登録画面へ遷移するリンク */
          <>
          <Link
            href={`/teams/${id}/players/new`}
            className={styles.newLink}
          >
            選手の登録
          </Link>
          {/* players配列の中身が1件以上の場合、表として表示 */}
          <table className={styles.table}>

            {/* 見出しを作る */}
            <thead>
              <tr>
                <th className={styles.th}>背番号</th>
                <th className={styles.th}>氏名</th>
                <th className={styles.th}></th>
              </tr>
            </thead>

            {/* 1つ1つのデータを作る */}
            <tbody>
              {players.map((p) => (
                <tr key={p.playerId}>
                  {/* 背番号 */}
                  <td className={styles.td}>{p.jerseyNumber}</td>

                  {/* 氏名 */}
                  <td className={styles.td}>{p.playerNameKanji}</td>

                  {/* 選手詳細画面へ遷移するリンク */}
                  <td className={styles.td}>
                    <Link
                      href={`/teams/${id}/players/${p.playerId}`}
                      className={styles.detailLink}
                    >
                      選手情報を見る
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}

        <p className={styles.count}>
          登録済選手：{players.length}人
        </p>
      </section>

    </div>
  );

}