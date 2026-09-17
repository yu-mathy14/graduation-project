import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamDetailPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number( teamId ); // teamId(文字列)を数値に変換し、idに格納

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
    <div>

      {/* チーム一覧に戻るための遷移リンク */}
      <Link href="/teams">
      ←チーム一覧に戻る
      </Link>

      {/* チーム情報編集ページへの遷移リンク */}
      <Link href={`/teams/${id}/edit`}>
        編集
      </Link>

      {/* チーム削除可能な場合、削除確認ページへの遷移リンクを表示 */}
      {canDeleteTeam && (
        <Link href={`/teams/${id}/delete`}>
          削除
        </Link>
      )}

      {/* チーム削除不可の場合、理由を表示 */}
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

      <Link href={`/teams/${id}/players`}>
        所属選手一覧へ
      </Link>

    </div>
  );
}