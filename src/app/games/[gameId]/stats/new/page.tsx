// URLのteamを受け取り、対象チームの選手を取得
/* 1. DBから試合情報を取得
   2. URLのteamを確認
   3. 指定されたチームの選手を取得
   4. 取得したデータをStatsNewFormに渡す
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
  searchParams: Promise<{ team?: string }>;
};

/**
 * スタッツ登録ページ
 * `/games/[gameId]/stats/new?team=home`
 * `/games/[gameId]/stats/new?team=away`
 * に対応するサーバーコンポーネント
 */
export default async function StatsNewPage({
  params,
  searchParams,
}: Props) {
  /* URLからgameIdとteamを取得 */
  const { gameId } = await params;
  const { team } = await searchParams;

  /* gameId(文字列)を数値に変換 */
  const id = Number(gameId);

  /* gameIdが数値でない場合は404ページを表示 */
  if (Number.isNaN(id)) notFound();

  /* teamにhomeまたはaway以外が指定された場合は404ページを表示 */
  if (team !== "home" && team !== "away") {
    notFound();
  }

  /* URLから受け取ったgameIdと一致する試合を取得 */
  const game = await prisma.games.findUnique({
    where: { gameId: id },

    // include：関連するテーブルを一緒に取得する
    include: {
      /* Gamesに紐づいているhomeTeam/awayTeamも取得する */
      homeTeam: true,
      awayTeam: true,
    },
  });

  /* 試合が見つからなかった場合、404ページを表示 */
  if (!game) notFound();

  /* 登録対象のチームIDとチーム名を決める */
  const teamId =
    /* 【三項演算子】teamに"home"が指定されたか */
    team === "home"
      ? game.homeTeamId  // homeの場合
      : game.awayTeamId; // homeじゃない場合

  const teamName =
    /* 【三項演算子】teamに"home"が指定されたか */
    team === "home"
      ? game.homeTeam.teamName  // homeの場合
      : game.awayTeam.teamName; // homeじゃない場合

  /* 登録対象チームの選手のみ取得 */
  const players = await prisma.players.findMany({
    where: {
      teamId: teamId,
    },
    orderBy: {
      jerseyNumber: "asc", // 背番号の昇順
    },
  });

  return (
    <div>
      {/* 試合詳細 + スタッツ一覧画面に戻るためのリンク */}
      <Link href={`/games/${id}`}>
        ←試合詳細に戻る
      </Link>

      <h1>{teamName} スタッツを登録</h1>

      <StatsNewForm
        /* これは属性ではなくProps */
        gameId={game.gameId}
        teamName={teamName}
        players={players}
      />
    </div>
  );
}