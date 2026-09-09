import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * 試合登録ページ
 * `/games/new`に対応するサーバーコンポーネント
 * 入力フォームを表示し、送信時にServerAction(`createGame`)で試合を新規作成する。
 * 登録完了後は試合詳細ページへリダイレクトする。
 */

export default async function GameNewPage() {
  // Prismaを使ってTeamsテーブルから全件取得
  const teams = await prisma.teams.findMany({
    orderBy: {
      teamId: "asc", // チームIDの昇順
    },
  });

// フォームが送信された時に実行する関数
  /* <form action={createGame}>で、このServer Actionをフォームに設定している */
  /* formData フォームから送信されたデータ */
  /* FormData -> Web APIとして用意されている型
    フォーム送信時にはFormDataオブジェクトがcreateGameに渡される */
  async function createGame(formData: FormData){
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

    /* Gameを1件登録する */
    const game = await prisma.games.create({
      data: {
        tipoffTime: new Date(`${tipoffTimeRaw}:00+09:00`),
        homeTeamId: Number(homeTeamIdRaw),
        awayTeamId: Number(awayTeamIdRaw),
        homeScore: Number(homeScoreRaw),
        awayScore: Number(awayScoreRaw),
      },
    });

    /* 登録画面から該当の試合の詳細画面へ遷移 */
    redirect(`/games/${game.gameId}`);
  }

  return (
    <div>
      {/*　試合一覧に戻るためのリンク */}
      <Link href="/games">
        ←試合一覧に戻る
      </Link>

      <h1>試合を登録</h1>

      {/* 登録専用のフォーム */}
      <form action={createGame}>
        {/* 必須項目 */}
        <div>
          <label htmlFor="tipoffTime">試合開始日時 *</label>
          <input
            id="tipoffTime" // labelと対応
            name="tipoffTime"
            type="datetime-local"
            required // 必須入力
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
            placeholder="整数で入力してください"
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
            placeholder="整数で入力してください"
          />
        </div>

        <div>
          {/* フォーム送信用ボタン */}
          <button type="submit">
            登録する
          </button>
          {/* 登録キャンセル時は試合一覧ページに遷移 */}
          <Link href="/games">
            キャンセル
          </Link>
        </div>

      </form>

    </div>
  )

}