// Playersの入力フォームを表示し、React Hook FormとYupで入力値を検証する
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
import { createPlayer } from "../actions";
import { playerSchema, type PlayerFormValues } from "../../schema";
import common from "@/app/common.module.css";
import Link from "next/link";

/* PlayerFormが受け取るPropsの型定義 */
type Props = {
  teamId: number;
};

export default function PlayerForm({ teamId }: Props) {
  // フォームの初期値
  const playerDefaultValue: PlayerFormValues = {
    playerNameKanji: "",
    playerNameKana: "",
    jerseyNumber: "",
    almaMater: "未設定",
    height: "",
    weight: "",
  };

  /* 確認画面に表示する入力内容を管理 */
  const [confirmData, setConfirmData] = useState<PlayerFormValues | null>(null);

  // フォーム初期化
  const { register, handleSubmit, formState: { errors },} = useForm<PlayerFormValues>({
    defaultValues: playerDefaultValue,
    /* バリデーションをYupに任せる */
    /* resolver -> React Hook Formと外部バリデーションライブラリを接続する仕組み */
    /* yupResolver -> Yupの検証結果をReact Hook Formで扱えるようにするアダプタ */
    resolver: yupResolver(playerSchema),
  });

  // サブミット時の処理
  /* バリデーション成功時に実行される処理 */
  const onSubmit: SubmitHandler<PlayerFormValues> = (data) => {
    setConfirmData(data);
  };
  /* バリデーション失敗時に実行される処理 */
  const onError: SubmitErrorHandler<PlayerFormValues> = (
    errors: FieldErrors<PlayerFormValues>
    ) => {
    console.log(errors);
  };

  /* 確認画面で登録を確定する */
  const handleConfirm = async () => {
    if (!confirmData) return;
    await createPlayer(teamId, confirmData);
  };

  /* 確認画面 */
  if (confirmData) {
    return (
      <>
        <div className={common.form}>
          <p className={common.confirmItem}>
            氏名(漢字) *：
            <span className={common.confirmValue}>
              {confirmData.playerNameKanji}
            </span>
          </p>
          
          <p className={common.confirmItem}>
            氏名(かな) *：
            <span className={common.confirmValue}>
              {confirmData.playerNameKana}
            </span>
          </p>
          
          <p className={common.confirmItem}>
            背番号 *：
            <span className={common.confirmValue}>
              {confirmData.jerseyNumber}
            </span>
          </p>
          
          <p className={common.confirmItem}>
            出身校：
            <span className={common.confirmValue}>
              {confirmData.almaMater}
            </span>
          </p>
          
          <p className={common.confirmItem}>
            身長(cm)：
            <span className={common.confirmValue}>
              {confirmData.height}
            </span>
          </p>
          
          <p className={common.confirmItem}>
            体重(kg)：
            <span className={common.confirmValue}>
              {confirmData.weight}
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
              href={`/teams/${teamId}/players`}
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
            htmlFor="playerNameKanji"
            className={common.label}
          >
            氏名(漢字) *
          </label>

          <input
            id="playerNameKanji" // labelと対応
            type="text"
            className={common.input}
            /* playerNameKanjiをReact Hook Formに登録 */
            {...register("playerNameKanji")}
          />
          {/* playerNameKanjiのバリデーションエラーがある場合、メッセージを表示 */}
          <div className={common.error}>
            {errors.playerNameKanji?.message}
          </div>
        </div>


        <div className={common.field}>
          <label
            htmlFor="playerNameKana"
            className={common.label}
          >
            氏名(かな) *
          </label>
          <input
            id="playerNameKana" // labelと対応
            type="text"
            className={common.input}
            /* playerNameKanaをReact Hook Formに登録 */
            {...register("playerNameKana")}
          />
          {/* playerNameKanaのバリデーションエラーがある場合、メッセージを表示 */}
          <div className={common.error}>
            {errors.playerNameKana?.message}
          </div>
        </div>

        <div className={common.field}>
          <label
            htmlFor="jerseyNumber"
            className={common.label}
          >
            背番号 *
          </label>

          <input
            id="jerseyNumber" // labelと対応
            type="number" // 数値入力用の入力欄
            min={1} // ブラウザ側の最小値：1
            className={common.input}
            /* jerseyNumberをReact Hook Formに登録 */
            {...register("jerseyNumber")}
          />
          {/* jerseyNumberのバリデーションエラーがある場合、メッセージを表示 */}
          <div className={common.error}>
            {errors.jerseyNumber?.message}
          </div>
        </div>

        <div className={common.field}>
          <label
            htmlFor="almaMater"
            className={common.label}
          >
            出身校 *
          </label>
          <input
            id="almaMater" // labelと対応
            type="text"
            className={common.input}
            /* almaMaterをReact Hook Formに登録 */
            {...register("almaMater")}
          />
          {/* almaMaterのバリデーションエラーがある場合、メッセージを表示 */}
          <div className={common.error}>
            {errors.almaMater?.message}
          </div>

          <p>出身校を設定する場合は書き換えてください</p>
          <p>設定しない場合は「未設定」のままにしてください</p>
        </div>

        <div className={common.field}>
          <label
            htmlFor="height"
            className={common.label}
          >
            身長(cm)
          </label>
          <input
            id="height" // labelと対応
            type="number" // 数値入力用の入力欄
            min={51} // ブラウザ側の最小値：51
            className={common.input}
            /* heightをReact Hook Formに登録 */
            {...register("height")}
          />
           {/* heightのバリデーションエラーがある場合、メッセージを表示 */}
          <div className={common.error}>
            {errors.height?.message}
          </div>

          <p>
            身長は任意です。入力する場合は整数で入力してください。
          </p>
        </div>

        <div className={common.field}>
          <label
            htmlFor="weight"
            className={common.label}
          >
            体重(kg)
          </label>
          <input
            id="weight" // labelと対応
            type="number" // 数値入力用の入力欄
            min={4} // ブラウザ側の最小値：4
            className={common.input}
            /* weightをReact Hook Formに登録 */
            {...register("weight")}
          />
          {/* weightのバリデーションエラーがある場合、メッセージを表示 */}
          <div className={common.error}>
            {errors.weight?.message}
          </div>

          <p>
            体重は任意です。入力する場合は整数で入力してください。
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
            href={`/teams/${teamId}/players`}
            className={common.buttonCancel}
          >
            キャンセル
          </Link>
        </div>
      </form>
    </>

  );
}
