// Games編集ページを表示する
/* 試合情報とチーム情報を取得し、
入力フォームはGameForm.tsxに分離する */
// ==================================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import GameForm from "./components/GameForm";
import styles from "./page.module.css";
import common from "@/app/common.module.css";

// このページに拡張されるデータの型定義
/* paramsにはgameIdという文字列が入っている */
type Props = {
  /* 【Promise】∵ paramsはPromiseとして渡されるため、awaitしてgameIdを取得する */
  params: Promise<{ gameId: string }>;
};

export default async function GameEditPage({ params }: Props) {
  /* paramsはPromiseとして渡されるため、awaitしてgameIdを取得する */
  const { gameId } = await params;
  const id = Number(gameId); // gameId(文字列)を数値に変換し、idに格納

  // Prismaを使ってGamesテーブルから1件取得
  /* 該当する試合があれば試合オブジェクト、なければnullが返る */
  const game = await prisma.games.findUnique({
    where: { gameId: id },
  });

  /* 試合が見つからなかったら404ページを表示する */
  if (!game) notFound();

  /* Prismaから取得したDate型のgame.tipoffTimeを、
     日本時間のdatetime-local用文字列に変換して定数に格納する
    -> inputでのdefaultValueに渡す */
  const tipoffTimeValue = game.tipoffTime.toLocaleString("sv-SE", {
    timeZone: "Asia/Tokyo",
    /* .replace(" ", "T")->空白をTに置き換え */
    /* .slice(0, 16)->先頭16文字を取得
      ∵ `datetime-local` では秒を表示する必要がないため */
  }).replace(" ", "T").slice(0, 16);

  // Prismaを使ってTeamsテーブルから全件取得
  const teams = await prisma.teams.findMany({
    orderBy: {
      teamId: "asc", // チームIDの昇順
    },
    // 所属選手数も一緒に取得する
    include: {
      _count: {
        select: {
          player: true,
        },
      },
    },
  });

  /* チームが2チーム未満の場合、試合を編集できないため404ページを表示 */
  if (teams.length < 2) notFound();
  
  return (
    <div className={styles.container}>
      {/* 試合詳細に戻るための遷移リンク */}
      <Link
        href={`/games/${id}`}
        className={common.link}
      >
        ←試合詳細に戻る
      </Link>

      <h1 className={styles.title}>
        試合情報を編集
      </h1>

      {/* React Hook Form + Yupを使った入力フォームを表示 */}
      <GameForm
        gameId={game.gameId}
        tipoffTime={tipoffTimeValue}
        homeTeamId={game.homeTeamId}
        awayTeamId={game.awayTeamId}
        homeScore={game.homeScore}
        awayScore={game.awayScore}
        teams={teams}
      />

      {/* 更新キャンセル時は試合詳細ページに遷移 */}
      <Link
        href={`/games/${id}`}
        className={common.link}
      >
        キャンセル
      </Link>
    </div>

  );
}