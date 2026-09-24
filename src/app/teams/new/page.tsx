// Teams新規登録ページを表示する
/* フォーム本体はTeamForm.tsxに分離し、
  このファイルではページの構成と画面遷移を担当する */
// ==================================================

import Link from "next/link";
import TeamForm from "./components/TeamForm";
import styles from "./page.module.css";
import common from "@/app/common.module.css";

/**
 * チーム登録ページ
 * `/teams/new`に対応するサーバーコンポーネント
 * ページの構成と画面遷移を担当し、入力フォームはTeamForm.tsxに分離している。
 * 登録完了後はチーム詳細ページへリダイレクトする。
 */

export default function TeamNewPage() {
  return (
    <div className={styles.container}>
      {/* チーム一覧に戻るためのリンク */}
      <Link
        href="/teams"
        className={common.link}
      >
        ←チーム一覧に戻る
      </Link>

      <h1 className={styles.title}>チームを登録</h1>

      {/* React Hook Form + Yupを使った入力フォームを表示 */}
      <TeamForm />

      {/* 登録キャンセル時はチーム一覧ページに遷移 */}
      <Link
        href="/teams"
        className={common.link}
      >
        キャンセル
      </Link>
    </div>
  );



}