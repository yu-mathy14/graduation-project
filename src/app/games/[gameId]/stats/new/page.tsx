import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import StatsNewForm from "./components/StatsNewForm";

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
  // if (!game) notFound();
  if (!game) {
  return <p>試合が見つかりません。gameId: {id}</p>;
}

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
        homeTeamName={game.homeTeam.teamName}
        homePlayers={homePlayers}
        awayTeamName={game.awayTeam.teamName}
        awayPlayers={awayPlayers}
      />



    </div>
  )
}