import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deletePlayer } from "./actions";
import common from "@/app/common.module.css";

/* PlayerDeletePageが受け取るPropsの型定義 */
type Props = {
  params: Promise<{
    teamId: string;
    playerId: string;
  }>;
};

export default async function PlayerDeletePage({ params }: Props) {
  const { teamId, playerId } = await params;
  const tId = Number(teamId); // teamId(文字列)を数値に変換し、tIdに格納
  const pId = Number(playerId); // playerId(文字列)を数値に変換し、pIdに格納

  // Prismaを使ってPlayersテーブルから該当の選手情報(1件)を取得する
  const player = await prisma.players.findUnique({
    where: { playerId: pId },
    // スタッツ数も一緒に取得する
    include: {
      _count: {
        select: {
          stats: true,
        },
      },
    },
  });

  // 選手が見つからなかった場合、404ページを表示する
  if (!player) notFound();

  // URLのteamIdと選手の実際の所属チームが一致するか確認
  if (player.teamId !== tId) notFound();

  /* 削除不可であっても以下のような場合は削除確認画面に遷移する可能性があるため、
  (・削除画面を直接URLから開いた場合
   ・詳細画面表示後に関連データが追加された場合など)
   　この画面でも選手削除可否を確認する */
  // 選手削除可否を判定し、結果を変数に格納
  const canDeletePlayer = player._count.stats === 0;

  return (
    <div className={common.deleteContainer}>
      {/* 【三項演算子】選手削除可否によって表示内容を切り替える */}
      {canDeletePlayer ? (
        /* ----- 以下、選手削除可能な場合に表示される部分 ----- */
        <section className={common.deleteArea}>
          <h1 className={common.deleteTitle}>選手削除確認</h1>

          {/* 削除前の確認メッセージの表示 */}
          <p className={common.deleteMessage}>
            【{player.playerNameKanji}】を本当に削除しますか？
          </p>

          <div className={common.deleteActions}>
            {/* 削除キャンセルの場合は選手詳細ページに遷移 */}
            <Link
              href={`/teams/${tId}/players/${pId}`}
              className={common.link}
            >
              キャンセル
            </Link>

            {/* Server Actionを実行 */}
            <form action={deletePlayer}>
              <input
                type="hidden"
                name="playerId"
                value={pId}
              />
              <input
                type="hidden"
                name="teamId"
                value={tId}
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
      /* ----- 以下、選手削除不可の場合に表示される部分 ----- */
      /* 直接URLからアクセスした場合などに備えた、
         通常用の操作ではほぼ表示されない削除不可時の画面 */
        <section className={common.deleteArea}>
          <h1 className={common.deleteTitle}>選手削除不可</h1>

          {/* エラーメッセージ(削除不可理由)の表示 */}
          <div className={common.notice}>
            <p>
              この選手には試合スタッツが登録されているため、削除できません。
            </p>
          </div>

          {/* 削除不可理由を確認後、選手詳細ページに遷移 */}
          <Link
            href={`/teams/${tId}/players/${pId}`}
            className={common.link}
          >
            了解
          </Link>
        </section>
      )}
    </div>
  );
}