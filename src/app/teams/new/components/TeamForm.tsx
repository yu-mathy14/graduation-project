// Teamsの入力フォームを表示し、React Hook FormとYupで入力値を検証する
/* フォーム部分をClient Componentに分離し、
  React Hook Form + Yup でバリデーションチェックを行う */ 
// ==================================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm,
         type FieldErrors,
         type SubmitErrorHandler,
         type SubmitHandler,
       } from "react-hook-form";

/* 他ファイルから必要なものを読み込み */
import { createTeam } from "../actions";
import { teamSchema, type TeamFormValues } from "../../schema";
import common from "@/app/common.module.css";
import Link from "next/link";

export default function TeamForm() {
  // デフォルト値
  const teamDefaultValue: TeamFormValues = {
    teamName: "",
    teamColor: "#FFFFFF",
  };

  /* 確認画面に表示する入力内容を管理 */
  const [confirmData, setConfirmData] = useState<TeamFormValues | null>(null);

  // フォーム初期化
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormValues>({
    // デフォルト値
    defaultValues: teamDefaultValue,
    /* バリデーションをYupに任せる */
    /* resolver -> React Hook Formと外部バリデーションライブラリを接続する仕組み */
    /* yupResolver -> Yupの検証結果をReact Hook Formで扱えるようにするアダプタ */
    resolver: yupResolver(teamSchema), // Yupに検証を委ねる
  });

  // サブミット時の処理
  /* バリデーション成功時に実行される処理 */
  const onSubmit: SubmitHandler<TeamFormValues> = (data) => {
    setConfirmData(data);
  };
  /* バリデーション失敗時に実行される処理 */
  const onError: SubmitErrorHandler<TeamFormValues> = (
    errors: FieldErrors<TeamFormValues>
    ) => {
    console.log(errors);
  };

  /* 確認画面で登録を確定する */
  const handleConfirm = async () => {
    if (!confirmData) return;

    await createTeam(confirmData);
  };

  /* 確認画面 */
  if (confirmData) {
    return (
      <>
        <div className={common.form}>
          <p className={common.confirmItem}>
            チーム名 *：
            <span className={common.confirmValue}>
              {confirmData.teamName}
            </span>
          </p>

          <p className={common.confirmItem}>
            チームカラー *：
            <span className={common.confirmValue}>
              {confirmData.teamColor}
            </span>
          </p>

          <div className={common.navigation}>
            <button
              type="button"
              className={common.button}
              onClick={handleConfirm}
            >
              この内容で登録
            </button>

            <button
              type="button"
              className={common.button}
              onClick={() => setConfirmData(null)}
            >
              入力内容を修正
            </button>

            <Link
              href="/teams"
              className={common.buttonCancel}
            >
              キャンセル
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <form
        className={common.form}
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        <div className={common.field}>
          <label
            htmlFor="teamName"
            className={common.label}
          >
            チーム名 *
          </label>

          <input
            id="teamName" // labelと対応
            type="text"
            className={common.input}
            /* teamNameをReact Hook Formに登録 */
            {...register("teamName")}
            />
          {/* teamNameのバリデーションエラーがある場合、メッセージを表示 */}
          <div className={common.error}>
            {errors.teamName?.message}
          </div>
        </div>

        <div className={common.field}>
          <label
            htmlFor="teamColor"
            className={common.label}
          >
            チームカラー *
          </label>

          <input
            id="teamColor" // labelと対応
            type="text"
            placeholder="#FFFFFF"
            className={common.input}
            /* teamColorをReact Hook Formに登録 */
            {...register("teamColor")}
          />
          {/* teamColorのバリデーションエラーがある場合、メッセージを表示 */}
         <div className={common.error}>
          {errors.teamColor?.message}
        </div>

          <p className={common.formNote}>
            <a
              href="https://www.colordic.org"
              target="_blank" // サイトを別タブで開く
              /* target="_blank"で外部サイトを開くときによくセットで使用するもの */
              rel="noopener noreferrer"
              className={common.link}
            >
              カラーコードを選ぶ(参考サイト)
            </a>
          </p>
        </div>

        <div className={common.navigation}>
          <button
            type="submit"
            className={common.button}
          >
            登録する
          </button>

          <Link
            href="/teams"
            className={common.buttonCancel}
          >
            キャンセル
          </Link>
        </div>
      </form>
  </>

  );
}
