import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteGame } from "./actions";

/* GameDeletePageが受け取るPropsの型定義 */
type Props = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GameDeletePage({ params }: Props) {
  const { gameId } = await params;
  const id = Number(gameId); // gameId(文字列)を数値に変換し、idに格納

  // Prismaを使ってGamesテーブルから該当の試合情報(1件)を取得する
  const game = await prisma.games.findUnique({
    where: { gameId: id },
    // スタッツ数も一緒に取得する
    include: {
      _count: {
        select: {
          stats: true,
        },
      },
      /* Gamesに紐づいているhomeTeam/awayTeamも取得する */
      homeTeam: true,
      awayTeam: true,
    },
  });

  // 試合が見つからなかった場合、404ページを表示する
  if (!game) notFound();

  /* 削除不可であっても以下のような場合は削除確認画面に遷移する可能性があるため、
  (・削除画面を直接URLから開いた場合
   ・詳細画面表示後に関連データが追加された場合など)
   この画面でも試合削除可否を確認する */
  // 試合削除可否を判定し、結果を変数に格納
  const canDeleteGame = game._count.stats === 0;

  return (
    <div>
      {/* 【三項演算子】試合削除可否によって表示内容を切り替える */}
      {canDeleteGame ? (
        /* ----- 以下、試合削除可能な場合に表示される部分 ----- */
        <>
          <h2>試合削除確認</h2>

          {/* 削除前の確認メッセージの表示 */}
          <p>
            【{game.homeTeam.teamName}】対【{game.awayTeam.teamName}】を
            本当に削除しますか？
          </p>

          {/* 削除キャンセルの場合は試合詳細ページに遷移 */}
          <Link href={`/games/${id}`}>
            キャンセル
          </Link>

          {/* ((仮ボタン))次の段階でServer Actionを設定する */}
          <form action={deleteGame}>
            <input type="hidden" name="gameId" value={id} />
            <button type="submit">
              削除
            </button>
          </form>
        </>
      ) : (
        /* ----- 以下、試合削除不可の場合に表示される部分 ----- */
        /* 直接URLからアクセスした場合などに備えた、
           通常用の操作ではほぼ表示されない削除不可時の画面 */
        <>
          <h2>試合削除不可</h2>

          {/* エラーメッセージ(削除不可理由)の表示 */}
          <p>
            この試合にはスタッツが登録されているため、削除できません。
          </p>

          {/* 削除不可理由を確認後、試合詳細ページに遷移 */}
          <Link href={`/games/${id}`}>
            了解
          </Link>
        </>
      )}
    </div>
  );
}