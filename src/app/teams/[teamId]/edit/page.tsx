import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

// このページに拡張されるデータの型定義
/* paramsにはteamIdという文字列が入っている */
type Props = {
  /* 【Promise】∵ URLから取るまでteamIdが入ってくるか確定しないので非同期 */
  params: Promise<{ teamId: string }>;
};

export default async function TeamEditPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number(teamId); // teamId(文字列)を数値に変換し、idに格納

  // Prismaを使ってTeamテーブルから1件取得
  /* 戻り値はオブジェクト */
  const team = await prisma.teams.findUnique({
    where: { teamId: id },
  });

  /* チームが見つからなかったら404ページを表示する */
  if (!team) notFound();

  // フォームが送信された時に実行する関数
  /* <form action={updateTeam}>によってフォームに登録されている */
  /* formData フォームに入力されたデータ */
  /* FormData -> Web APIとして用意されている型
     フォーム送信時にはFormDataオブジェクトがupdateTeamに渡される */
  /* フォーム送信時の処理をサーバー側で実行するため、
     Server Actionとして定義する */
  async function updateTeam(formData: FormData) {
    /* この関数はサーバー側で実行する処理です
    とNext.jsに伝えるためのServer Actionの宣言 */
    "use server";

    // formDataの中から指定したキーの値を取り出して型アサーションし、定数に格納
    /* 【.get()】-> FormDataの中から、指定したname(キー)のデータを1つ取り出すためのメソッド */
    const teamName = formData.get("teamName") as string;
    const teamColor = formData.get("teamColor") as string;

    /* whereで指定したTeamを1件更新する */
    await prisma.teams.update({
      where: { teamId: id },
      data: {
        teamName, // フォームから受け取ったチーム名で更新
        teamColor, // フォームから受け取ったチームカラーで更新
      },
    });

    /* 編集画面から該当のチームの詳細画面へ戻す */
    redirect(`/teams/${id}`);
  }

  return (
    <div>
      {/* チーム詳細に戻るための遷移リンク */}
      <Link href={`/teams/${id}`}>
        ←チーム詳細に戻る
      </Link>

      <h1>チーム情報を編集</h1>

      {/* 編集用のフォーム */}
      {/* action={updateTeam} -> フォーム送信時に実行される関数 */}
      <form action={updateTeam}>
        <div>
          <label htmlFor="teamName">チーム名</label>
          <input 
            id="teamName" // labelと対応
            name="teamName"
            defaultValue={team.teamName}
            required // 必須入力
          />
        </div>

        <div>
          <label htmlFor="teamColor">チームカラー</label>
          <input 
            id="teamColor" // labelと対応
            name="teamColor"
            defaultValue={team.teamColor}
            required // 必須入力
          />
        </div>

        <div>
          {/* フォーム送信用ボタン */}
          <button type="submit">
            更新する
          </button>
          {/* 編集キャンセル時はチーム一覧ページに遷移 */}
          <Link href={`/teams/${id}`}>
            キャンセル
          </Link>
        </div>

      </form>
    </div>
  );
}