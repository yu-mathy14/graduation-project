import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

// このページに拡張されるデータの型定義
type Props = {
  params: Promise<{
    teamId: string;
    playerId: string;
  }>;
};

export default async function PlayerEditPage({ params }: Props) {
  const { playerId, teamId } = await params;
  const pId = Number( playerId ); // playerId(文字列)を数値に変換し、pIdに格納
  const tId = Number( teamId ); // teamId(文字列)を数値に変換し、tIdに格納

  // Prismaを使ってPlayersテーブルから該当の選手情報(1件)を取得
  const player = await prisma.players.findUnique({
    where: { playerId: pId },
  });

  /* 選手が見つからなかった場合、404ページを表示する */
  if (!player) notFound();

  /* URLのteamIdと、選手の実際の所属チームが一致するか確認 */
  if (player.teamId !== tId) {
    notFound();
  }

  // Prismaを使ってTeamsテーブルから該当のチーム情報(1件)を取得
  const team = await prisma.teams.findUnique({
    where: { teamId: tId },
  });

  /* チームが見つからなかった場合、404ページを表示する */
  if (!team) notFound();


// フォームが送信された時に実行する関数
  /* <form action={updatePlayer}>によってフォームに登録されている */
  /* formData フォームから送信されたデータ */
  /* FormData -> Web APIとして用意されている型
    フォーム送信時にはFormDataオブジェクトがupdatePlayerに渡される */
  async function updatePlayer(formData: FormData) {
    /* この関数はサーバー側で実行する処理です
    とNext.jsに伝えるためのServer Actionの宣言 */
    "use server";

    // formDataの中から指定したキーの値を取り出して型アサーションし、定数に格納
    /* 【.get()】-> FormDataの中から、指定したname(キー)のデータを1つ取り出すためのメソッド */
    const playerNameKanji = formData.get("playerNameKanji") as string;
    const playerNameKana = formData.get("playerNameKana") as string;
    const jerseyNumberRaw = formData.get("jerseyNumber") as string;
    const almaMater = formData.get("almaMater") as string;
    const heightRaw = formData.get("height") as string | null;
    const weightRaw = formData.get("weight") as string | null;

    await prisma.players.update({
      where: { playerId: pId },
      data: {
        // teamId: tId, 選手登録後のチーム変更不可により不要
        playerNameKanji,
        playerNameKana,
        jerseyNumber: Number(jerseyNumberRaw),
        almaMater,
        height: heightRaw ? Number(heightRaw) : null,
        weight: weightRaw ? Number(weightRaw) : null,
      },
    });
    
    /* 編集画面から該当の選手の詳細画面へ遷移 */
    redirect(`/teams/${tId}/players/${pId}`);
  }
  
  return (
    <div>
      {/*　選手詳細に戻るためのリンク */}
      <Link href={`/teams/${tId}/players/${pId}`}>
        ←選手詳細に戻る
      </Link>

      <h1>選手情報を編集</h1>

      <p>所属チーム：{team.teamName}</p>
      <p>※ 所属チームは登録後に変更できません。</p>

      {/* 編集専用のフォーム */}
      {/* action={updatePlayer} -> フォーム送信時に実行される関数 */}
      <form action={updatePlayer}>
        {/* 必須項目 */}
        <div>
          <label htmlFor="playerNameKanji">氏名(漢字) *</label>
          <input 
            id="playerNameKanji" // labelと対応
            name="playerNameKanji"
            defaultValue={player.playerNameKanji}
            required // 必須入力
          />
        </div>

        <div>
          <label htmlFor="playerNameKana">氏名(かな) *</label>
          <input 
            id="playerNameKana" // labelと対応
            name="playerNameKana"
            defaultValue={player.playerNameKana}
            required // 必須入力
          />
        </div>

        <div>
          <label htmlFor="jerseyNumber">背番号 *</label>
          <input 
            id="jerseyNumber" // labelと対応
            name="jerseyNumber"
            defaultValue={player.jerseyNumber}
            required // 必須入力
          />
        </div>

        <div>
          <label htmlFor="almaMater">出身校 *</label>
          <input 
            id="almaMater" // labelと対応
            name="almaMater"
            defaultValue={player.almaMater}
            required // 必須入力
          />

          <p>出身校を設定しない場合は「未設定」にしてください</p>
        </div>

        {/* 以下は任意項目 */}
        <div>
          <label htmlFor="height">身長(cm)</label>
          <input 
            id="height" // labelと対応
            name="height"
            defaultValue={player.height ?? ""}
          />

          <p>身長は任意です。入力する場合は整数で入力してください。</p>
        </div>

        <div>
          <label htmlFor="weight">体重(kg)</label>
          <input 
            id="weight" // labelと対応
            name="weight"
            defaultValue={player.weight ?? ""}
          />

          <p>体重は任意です。入力する場合は整数で入力してください。</p>
        </div>

        <div>
          {/* フォーム送信用ボタン */}
          <button type="submit">
            更新する
          </button>
          {/* 更新キャンセル時は選手詳細に遷移 */}
          <Link href={`/teams/${tId}/players/${pId}`}>
            キャンセル
          </Link>
        </div>

      </form>
    </div>
  );
}