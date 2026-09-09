import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

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

  // Prismaを使ってGameテーブルから1件取得
  /* 戻り値はオブジェクト */
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
  });

  // フォームが送信された時に実行する関数
  /* <form action={updateGame}>によって、フォーム送信時にupdateGameが実行される */  /* formData フォームに入力されたデータ */
  /* FormData -> Web APIとして用意されている型
     フォーム送信時にはFormDataオブジェクトがupdateGameに渡される */
  /* フォーム送信時の処理をサーバー側で実行するため、
     Server Actionとして定義する */
  async function updateGame(formData: FormData) {
    /* この関数はサーバー側で実行する処理です
    とNext.jsに伝えるためのServer Actionの宣言 */
    "use server";

    // formDataの中から指定したキーの値を取り出して型アサーションし、定数に格納
    /* 【.get()】-> FormDataの中から、指定したname(キー)のデータを1つ取り出すためのメソッド */
    const tipoffTimeRaw = formData.get("tipoffTime") as string;
    const homeTeamIdRaw = formData.get("homeTeamId") as string;
    const awayTeamIdRaw = formData.get("awayTeamId") as string;
    const homeScoreRaw = formData.get("homeScore") as string;
    const awayScoreRaw = formData.get("awayScore") as string;

    /* whereで指定したGameを1件更新する */
    await prisma.games.update({
      where: { gameId: id },
      data: {
        gameId: id,
        tipoffTime: new Date(`${tipoffTimeRaw}:00+09:00`),
        homeTeamId: Number(homeTeamIdRaw),
        awayTeamId: Number(awayTeamIdRaw),
        homeScore: Number(homeScoreRaw),
        awayScore: Number(awayScoreRaw),
      },
    });

    /* 編集画面から該当の試合の詳細画面へ戻す */
    redirect(`/games/${id}`);

  }
  
  return (
    <div>
      {/* 試合詳細に戻るための遷移リンク */}
      <Link href={`/games/${id}`}>
        ←試合詳細に戻る
      </Link>

      <h1>試合情報を編集</h1>

      {/* 編集用のフォーム */}
      {/* action={updateGame} -> フォーム送信時に実行される関数 */}
      <form action={updateGame}>
        {/* 必須項目 */}
        <div>
          <label htmlFor="tipoffTime">試合開始日時 *</label>
          <input
            id="tipoffTime" // labelと対応
            name="tipoffTime"
            type="datetime-local"
            required // 必須入力
            defaultValue={tipoffTimeValue}
          />
        </div>
        
        {/* ホームチームの選択
        現時点ではアウェイチームと重複しないようなバリデーションは未実装 */}
        <div>
          <label htmlFor="homeTeamId">ホームチーム *</label>
          <select
            name="homeTeamId"
            id="homeTeamId"
            required // 必須選択
            defaultValue={game.homeTeamId}
            >
            <option value="">チームを選択してください</option>
            {/* 配列からすべての登録済みのチームをプルダウンの選択肢にする */}
            {/* 選択されたチームのteamIdがvalueになり、formDataへ送られる */}
            {teams.map((t) => (
              <option key={t.teamId} value={t.teamId}>
                {t.teamName}
              </option>
            ))}
          </select>
        </div>

        {/* アウェイチームの選択
        現時点ではホームチームと重複しないようなバリデーションは未実装 */}
        <div>
          <label htmlFor="awayTeamId">アウェイチーム *</label>
          <select
            name="awayTeamId"
            id="awayTeamId"
            required // 必須選択
            defaultValue={game.awayTeamId}
            >
            <option value="">チームを選択してください</option>
            {/* 配列からすべての登録済みのチームをプルダウンの選択肢にする */}
            {/* 選択されたチームのteamIdがvalueになり、formDataへ送られる */}
            {teams.map((t) => (
              <option key={t.teamId} value={t.teamId}>
                {t.teamName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="homeScore">ホーム最終スコア *</label>
          <input
            id="homeScore" // labelと対応
            name="homeScore"
            type="number" // 数値のみ許容
            required // 必須入力
            min="0" // 最小値のバリデーション
            defaultValue={game.homeScore}
          />
        </div>

        <div>
          <label htmlFor="awayScore">アウェイ最終スコア *</label>
          <input
            id="awayScore" // labelと対応
            name="awayScore"
            type="number" // 数値のみ許容
            required // 必須入力
            min="0" // 最小値のバリデーション
            defaultValue={game.awayScore}
          />
        </div>

        <div>
          {/* フォーム送信用ボタン */}
          <button type="submit">
            更新する
          </button>
          {/* 更新キャンセル時は試合詳細ページに遷移 */}
          <Link href={`/games/${id}`}>
            キャンセル
          </Link>
        </div>
      </form>

    </div>
  )
}