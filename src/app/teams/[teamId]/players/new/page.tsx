import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ teamId: string }>;
};

/**
 * 選手登録ページ
 * `/teams/[teamId]/players/new`に対応するサーバーコンポーネント
 * 入力フォームを表示し、送信時にServerAction(`createPlayer`)で選手を新規作成する。
 * 登録完了後は選手詳細ページへリダイレクトする。
 */

export default async function PlayerNewPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number(teamId); // teamId(文字列)を数値に変換し、idに格納

  const team = await prisma.teams.findUnique({
    where: { teamId: id },
  });

  /* チームが見つからなかった場合、404ページを表示する */
  if (!team) notFound();


// フォームが送信された時に実行する関数
  /* <form action={createPlayer}>によってフォームに登録されている */
  /* formData フォームから送信されたデータ */
  /* FormData -> Web APIとして用意されている型
    フォーム送信時にはFormDataオブジェクトがcreatePlayerに渡される */
  async function createPlayer(formData: FormData) {
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

    const player = await prisma.players.create({
      data: {
        teamId: id,
        playerNameKanji,
        playerNameKana,
        jerseyNumber: Number(jerseyNumberRaw),
        almaMater,
        height: heightRaw ? Number(heightRaw) : null,
        weight: weightRaw ? Number(weightRaw) : null,
      },
    });
    
    /* 登録画面から該当の選手の詳細画面へ遷移 */
    redirect(`/teams/${id}/players/${player.playerId}`);
  }
  
  return (
    <div>
      {/*　選手一覧に戻るためのリンク */}
      <Link href={`/teams/${team.teamId}/players`}>
        ←チーム詳細に戻る
      </Link>

      <h1>選手を登録</h1>

      <p>所属チーム：{team.teamName}</p>
      <p>※ 所属チームは登録後に変更できません。
        <br />
        登録内容を確認してから登録してください。
        <br />
        登録後にチームを間違えた場合は、
        <br />
        スタッツが登録されていなければ選手を削除して、
        <br />
        正しいチームで再登録してください。
      </p>

      {/* 登録専用のフォーム */}
      <form action={createPlayer}>
        {/* 必須項目 */}
        <div>
          <label htmlFor="playerNameKanji">氏名(漢字) *</label>
          <input 
            id="playerNameKanji" // labelと対応
            name="playerNameKanji"
            required // 必須入力
          />
        </div>

        <div>
          <label htmlFor="playerNameKana">氏名(かな) *</label>
          <input 
            id="playerNameKana" // labelと対応
            name="playerNameKana"
            required // 必須入力
          />
        </div>

        <div>
          <label htmlFor="jerseyNumber">背番号 *</label>
          <input 
            id="jerseyNumber" // labelと対応
            name="jerseyNumber"
            required // 必須入力
          />
        </div>

        <div>
          <label htmlFor="almaMater">出身校 *</label>
          <input 
            id="almaMater" // labelと対応
            name="almaMater"
            defaultValue="未設定"
            required // 必須入力
          />

          <p>出身校を設定する場合は書き換えてください</p>
          <p>設定しない場合は「未設定」のままにしてください</p>
        </div>

        {/* 以下は任意項目 */}
        <div>
          <label htmlFor="height">身長(cm)</label>
          <input 
            id="height" // labelと対応
            name="height"
            placeholder="任意・整数で入力"
          />
        </div>

        <div>
          <label htmlFor="weight">体重(kg)</label>
          <input 
            id="weight" // labelと対応
            name="weight"
            placeholder="任意・整数で入力"
          />
        </div>

        <div>
          {/* フォーム送信用ボタン */}
          <button type="submit">
            登録する
          </button>
          {/* 登録キャンセル時は選手一覧に遷移 */}
          <Link href={`/teams/${team.teamId}/players`}>
            キャンセル
          </Link>
        </div>

      </form>
    </div>
  );
}