// スタッツ編集画面
/*  */
// ===========================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

/* コンポーネントの読み込み */
import StatsEditForm from "./components/StatsEditForm";

// このページに拡張されるデータの型定義
type Props = {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ team?: string }>;
};

/* スタッツ編集画面を表示する関数 */
export default async function StatsEditPage({
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

  /* Prismaを使って指定された試合を取得 */
  const game = await prisma.games.findUnique({
    where: { gameId: id },

    // include：関連するテーブルを一緒に取得する
    include: {
      /* Gamesに紐づくhomeTeams/awayTeamを一緒に取得 */
      homeTeam: true,
      awayTeam: true,
      /* Gamesに紐づくStatsを一緒に取得 */
      stats: {
        // include：関連するテーブルを一緒に取得する
        include: {
          /* 各Statsに紐づくplayerも取得する */
          player: true,
        },
      },
    },
  });

  /* 試合が見つからなかった場合、404ページを表示 */
  if (!game) notFound();

  /* ホームまたはアウェイの対象チームのスタッツだけを取り出す */
  const stats = game.stats.filter((stat) =>
    /* 【三項演算子】teamに"home"が指定されたか */
    team === "home"
      ? stat.player.teamId === game.homeTeamId // homeの場合
      : stat.player.teamId === game.awayTeamId // homeじゃない場合
  );

  /* 編集対象のチーム名を取得 */
  const teamName =
    /* 【三項演算子】teamに"home"が指定されたか */
    team === "home"
      ? game.homeTeam.teamName  // homeの場合
      : game.awayTeam.teamName; // homeじゃない場合

  return (
    <div>
      <h2>{teamName} スタッツ編集</h2>

      <p>編集対象：{teamName}</p>
      {/* 【三項演算子】登録されているスタッツの件数が0件であるか */}
      {stats.length === 0 ? (
        <p>スタッツが登録されていません</p>
      ) : (
        
        <StatsEditForm
          /* これは属性ではなくProps */
          gameId={id}
          stats={stats}
        />
      )}
    </div>
  );
}