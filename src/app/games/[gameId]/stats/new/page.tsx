// そのURLにアクセスしたときに表示するページの土台を作る
/* 1. DBから試合情報を取得
   2. ホーム・アウェイの選手を取得
   3. 取得したデータをStatsNewFormに渡す
*/
// =========================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

/* コンポーネントの読み込み */
import StatsNewForm from "./components/StatsNewForm";

/* StatsNewPageが受け取るPropsの型定義 */
type Props = {
  params: Promise<{ gameId: string }>;
};

/**
 * スタッツ登録ページ
 * `/games/[gameId]/stats/new`に対応するサーバーコンポーネント
 * 入力フォームを表示し、送信時にServerAction(`createStats`)で試合を新規作成する。
 * 登録完了後は試合詳細 + スタッツ一覧ページへリダイレクトする。
 */

export default async function StatsNewPage({ params }: Props) {
  const { gameId } = await params;
  const id = Number(gameId); // gameId(文字列)を数値に変換し、idに格納

  /* URLから受け取った[gameId]と一致する試合を取得 */
  const game = await prisma.games.findUnique({
    where: { gameId: id },
    // include：関連するテーブルを一緒に取得する
    include: {
      /* Gamesに紐づいているhomeTeam/awayTeamも取得する */
      homeTeam: true,
      awayTeam: true,
    },
  });

  /* 試合が見つからなかった場合、404ページを表示する */
  if (!game) notFound();

  /* ホーム・アウェイのチームを選択肢として使用する */
  const teams = [game.homeTeam, game.awayTeam];

  /*　ホームチームの選手のみ取得 */
  const homePlayers = await prisma.players.findMany({
    where: {
      teamId: game.homeTeamId,
    },
    orderBy: {
      jerseyNumber: "asc",
    },
  });

  /*　アウェイチームの選手のみ取得 */
  const awayPlayers = await prisma.players.findMany({
    where: {
      teamId: game.awayTeamId,
    },
    orderBy: {
      jerseyNumber: "asc",
    },
  });
  

  return (
    <div>
      {/* 試合詳細 + スタッツ一覧画面に戻るためのリンク */}
      <Link href={`/games/${id}`}>
        ←試合詳細に戻る
      </Link>

      <h1>スタッツを登録</h1>

      <StatsNewForm
      /* これは属性ではなくProps */
        gameId={game.gameId}
        homeTeamName={game.homeTeam.teamName}
        homePlayers={homePlayers}
        awayTeamName={game.awayTeam.teamName}
        awayPlayers={awayPlayers}
      />

    </div>
  )
}