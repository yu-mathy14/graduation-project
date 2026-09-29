// Teamsの入力フォームを表示し、React Hook FormとYupで入力値を検証する
/* フォーム部分をClient Componentに分離している */ 
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
import { updateTeam } from "../actions";
import { teamSchema, prefectures, type TeamFormValues, teamColors } from "../../../schema";
import common from "@/app/common.module.css";
import Link from "next/link";

/* TeamFormが受け取るPropsの型定義 */
type Props = {
  teamId: number;
  teamName: string;
  teamColor: string;
  customColor: string;
  prefecture: string;
  coach: string;
  memo?: string;
};

export default function TeamForm({
  teamId,
  teamName,
  teamColor,
  customColor,
  prefecture,
  coach,
  memo,
}: Props) {
  /* DBに保存済みのカラーコードが、候補色なのか『その他』なのかを判定 */
  const isOtherColor = teamColor === "other";

  // フォームの初期値
  /* 編集対象のチームの現在値を初期値として設定 */
  const teamDefaultValue: TeamFormValues = {
    teamName,
    teamColor: isOtherColor ? "other" : teamColor,
    customColor: isOtherColor ? customColor : "",
    prefecture,
    coach,
    memo: memo ?? "",
  };

  /* 確認画面に表示する入力内容を管理 */
  const [confirmData, setConfirmData] = useState<TeamFormValues | null>(null);

  // フォーム初期化
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },} = useForm<TeamFormValues>({
  // デフォルト値
  defaultValues: teamDefaultValue,
  /* バリデーションをYupに任せる */
  /* resolver -> React Hook Formと外部バリデーションライブラリを接続する仕組み */
  /* yupResolver -> Yupの検証結果をReact Hook Formで扱えるようにするアダプタ */
  resolver: yupResolver(teamSchema),
  });

  const selectedColor = watch("teamColor");

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

  /* 確認画面で更新を確定する */
  const handleConfirm = async () => {
    if (!confirmData) return;
    
    await updateTeam(teamId, confirmData);
  };

  /* 確認画面 */
  if (confirmData) {
    /* 選択済みのチームカラー名を格納 */
    const selectedColor = teamColors.find(
      (color) => color.value === confirmData.teamColor
    );

    return (
      <>
        <div className={common.form}>
          <p className={common.confirmItem}>
            チーム名 *：
            <span className={common.confirmValue}>
              {confirmData.teamName}
            </span>
          </p>

          {/* チームカラーを色見本+色名で表示 */}
          <p className={common.confirmItem}>
            チームカラー *：
            <span
              className={common.confirmColor}
              style={{
                backgroundColor:
                  confirmData.teamColor === "other"
                    ? confirmData.customColor
                    : confirmData.teamColor,
              }}
            />
            <span className={common.confirmValue}>
              {selectedColor?.name}
            </span>
          </p>

          <p className={common.confirmItem}>
            都道府県 *：
            <span className={common.confirmValue}>
              {confirmData.prefecture}
            </span>
          </p>

          <p className={common.confirmItem}>
            監督 *：
            <span className={common.confirmValue}>
              {confirmData.coach}
            </span>
          </p>

          <div className={common.confirmItem}>
            <div>メモ：</div>

            <div className={common.confirmMemo}>
              {confirmData.memo}
            </div>
          </div>
          
          <div className={common.navigation}>
            <button 
              type="button"
              className={common.button}
              onClick={handleConfirm}
            > 
              この内容で更新
            </button>
            
            <button
              type="button"
              className={common.button}
              onClick={() => setConfirmData(null)}
            > 
              入力内容を修正
            </button>
            
            <Link
              href={`/teams/${teamId}`}
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

          <select
            id="teamColor" // labelと対応
            className={common.select}
            /* teamColorをReact Hook Formに登録 */
            {...register("teamColor")}
          >
            <option value="">
              チームカラーを選択してください
            </option>

            {teamColors.map((color) => (
              <option
                key={color.value}
                value={color.value}
              >
                {color.name}
              </option>
            ))}
          </select>
          
          {/* "その他"を選択した場合はカラーコード入力欄を表示する */}
          {selectedColor === "other" && (
          <>
            <input
              type="text"
              className={common.input}
              placeholder="#FFFFFF"
              {...register("customColor")}
            />

            <div className={common.error}>
              {errors.customColor?.message}
            </div>

            {/* カラーコード参考サイトを別タブで開く用のリンク */}
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
          </>
        )}
          
          {/* teamColorのバリデーションエラーがある場合、メッセージを表示 */}
          <div className={common.error}>
            {errors.teamColor?.message}
          </div>

        </div>

        {/* 都道府県 */}
        <div className={common.field}>
          <label
            htmlFor="prefecture"
            className={common.label}
          >
            都道府県 *
          </label>

          <select
            id="prefecture"
            className={common.select}
            {...register("prefecture")}
          >
            <option value="">
              都道府県を選択してください
            </option>

            {prefectures.map((prefecture) => (
              <option
                key={prefecture}
                value={prefecture}
              >
                {prefecture}
              </option>
            ))}
          </select>

          <div className={common.error}>
            {errors.prefecture?.message}
          </div>
        </div>

        {/* 監督 */}
        <div className={common.field}>
          <label
            htmlFor="coach"
            className={common.label}
          >
            監督 *
          </label>

          <input
            id="coach"
            type="text"
            className={common.input}
            {...register("coach")}
          />

          <div className={common.error}>
            {errors.coach?.message}
          </div>
        </div>

        {/* メモ */}
        <div className={common.field}>
          <label
            htmlFor="memo"
            className={common.label}
          >
            メモ
          </label>

          <textarea
            id="memo"
            className={common.input}
            rows={6}
            {...register("memo")}
          />

          <div className={common.error}>
            {errors.memo?.message}
          </div>
        </div>

        {/* ボタン等 */}
        <div className={common.navigation}>
          <button
            type="submit"
            className={common.button}
          >
            更新する
          </button>

          <Link
            href={`/teams/${teamId}`}
            className={common.buttonCancel}
          >
            キャンセル
          </Link>
        </div>
      </form>
    </>

  );
}
