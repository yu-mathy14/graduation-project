import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteTeam } from "./actions"; 
import styles from "./page.module.css";
import common from "@/app/common.module.css";

/* TeamDeletePageが受け取るPropsの型定義 */
type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function TeamDeletePage({ params }: Props) {
  const { teamId } = await params;
  const id = Number(teamId); // teamId(文字列)を数値に変換し、idに格納

  // Prismaを使ってTeamsテーブルから該当のチーム情報(1件)を取得する
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
    <div className={styles.container}>

      {/* 【三項演算子】チーム削除可否によって表示内容を切り替える */}
      {canDeleteTeam ? (
        /* ----- 以下、チーム削除可能な場合に表示される部分 ----- */
        <section className={styles.deleteArea}>
          <h1 className={styles.title}>チーム削除確認</h1>

          {/* 削除前の確認メッセージの表示 */}
          <p className={styles.message}>
            【{team.teamName}】を本当に削除しますか？
          </p>

          <div className={styles.actions}>
            {/* 削除キャンセルの場合はチーム詳細ページに遷移 */}
            <Link
              href={`/teams/${id}`}
              className={common.link}
            >
              キャンセル
            </Link>

            {/* Server Actionを実行 */}
            <form action={deleteTeam}>
              <input
                type="hidden"
                name="teamId"
                value={id}
              />

              <button
                type="submit"
                className={common.button}
              >
                削除
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* ----- 以下、チーム削除不可の場合に表示される部分 ----- */
        /* 直接URLからアクセスした場合などに備えた、
           通常用の操作ではほぼ表示されない削除不可時の画面 */
        <section className={styles.deleteArea}>
          <h1 className={styles.title}>チーム削除不可</h1>

          {/* エラーメッセージ(削除不可理由)の表示 */}
          <div className={common.notice}>
            {/* パターン1：所属選手がいるのみ */}
            {hasPlayers && !hasGames && (
              <p>
                このチームには所属選手がいるため、削除できません。
              </p>
            )}

            {/* パターン2：試合参加歴があるのみ */}
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

          {/* 削除不可理由を確認後、チーム詳細ページに遷移 */}
          <Link
            href={`/teams/${id}`}
            className={common.link}
          >
            了解
          </Link>
        </section>
      )}

    </div>
  )
}