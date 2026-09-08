import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * チーム登録ページ
 * `/teams/new`に対応するサーバーコンポーネント
 * 入力フォームを表示し、送信時にServerAction(`createTeam`)でチームを新規作成する。
 * 登録完了後はチーム詳細ページへリダイレクトする。
 */

export default function TeamNewPage() {
// フォームが送信された時に実行する関数
  /* <form action={createTeam}>によってフォームに登録されている */
  /* formData フォームから送信されたデータ */
  /* FormData -> Web APIとして用意されている型
    フォーム送信時にはFormDataオブジェクトがcreateTeamに渡される */
  async function createTeam(formData: FormData) {
    /* この関数はサーバー側で実行する処理です
    とNext.jsに伝えるためのServer Actionの宣言 */
    "use server";

    // formDataの中から指定したキーの値を取り出して型アサーションし、定数に格納
    /* 【.get()】-> FormDataの中から、指定したname(キー)のデータを1つ取り出すためのメソッド */
    const teamName = formData.get("teamName") as string;
    const teamColor = formData.get("teamColor") as string;

    /* Teamを1件登録する */
    const team = await prisma.teams.create({
      data: {
        teamName,
        teamColor,
      },
    });

    /* 登録画面から該当のチームの詳細画面へ遷移 */
    redirect(`/teams/${team.teamId}`);
  }

  return (
    <div>
      {/* チーム一覧に戻るためのリンク */}
      <Link href="/teams">
        ←チーム一覧に戻る
      </Link>

      <h1>チームを登録</h1>

      {/* 登録専用のフォーム */}
      <form action={createTeam}>
        {/* 必須項目 */}
        <div>
          <label htmlFor="teamName">チーム名 *</label>
          <input
            id="teamName" // labelと対応
            name="teamName"
            required // 必須入力
          />
        </div>

        <div>
          <label htmlFor="teamColor">チームカラー *</label>
          <input
            id="teamColor" // labelと対応
            name="teamColor"
            required // 必須入力
            placeholder=" 例：#FFFFFF"
          />

          <p>
            <a 
              href="https://www.colordic.org"
              target="_blank" // サイトを別タブで開く
              /* target="_blank"で外部サイトを開くときによくセットで使用するもの */
              rel="noopener noreferrer"
            >
              カラーコードを選ぶ(参考サイト)
            </a>
          </p>
        </div>

        <div>
          {/* フォーム送信用ボタン */}
          <button type="submit">
            登録する
          </button>
          {/* 登録キャンセル時はチーム一覧ページに遷移 */}
          <Link href="/teams">
            キャンセル
          </Link>
        </div>

      </form>
    </div>
  );



}