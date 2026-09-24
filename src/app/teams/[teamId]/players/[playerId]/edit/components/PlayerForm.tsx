// Playersの入力フォームを表示し、React Hook FormとYupで入力値を検証する
/* フォーム部分をClient Componentに分離している */
// ==================================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

import Link from "next/link";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm,
         type FieldErrors,
         type SubmitErrorHandler,
         type SubmitHandler,
       } from "react-hook-form";

/* 他ファイルから必要なものを読み込み */
import { updatePlayer } from "../actions";
import { playerSchema, type PlayerFormValues,} from "../../../schema";
import common from "@/app/common.module.css";

/* PlayerFormが受け取るPropsの型定義 */
type Props = {
  playerId: number;
  teamId: number;
  playerNameKanji: string;
  playerNameKana: string;
  jerseyNumber: number;
  almaMater: string;
  height: number | null;
  weight: number | null;
};

export default function PlayerForm({
  playerId,
  teamId,
  playerNameKanji,
  playerNameKana,
  jerseyNumber,
  almaMater,
  height,
  weight,
}: Props) {
  // フォームの初期値
  /* 編集対象の選手の現在値を初期値として設定 */
  const playerDefaultValue: PlayerFormValues = {
    playerNameKanji,
    playerNameKana,
    /* 背番号の現在値を文字列型に変換 */
    jerseyNumber: String(jerseyNumber),
    almaMater,
  /* 【三項演算子】身長や体重がnullなら空文字、
  それ以外は現在の値を文字列型に変換 */
    height: height === null ? "" : String(height),
    weight: weight === null ? "" : String(weight),
  };

  // フォーム初期化
  const { register, handleSubmit, formState: { errors },} = useForm<PlayerFormValues>({
    // デフォルト値
    defaultValues: playerDefaultValue,
    /* バリデーションをYupに任せる */
    /* resolver -> React Hook Formと外部バリデーションライブラリを接続する仕組み */
    /* yupResolver -> Yupの検証結果をReact Hook Formで扱えるようにするアダプタ */
    resolver: yupResolver(playerSchema),
  });

  // サブミット時の処理
  /* バリデーション成功時に実行される処理 */
  const onSubmit: SubmitHandler<PlayerFormValues> = async (
    data
  ) => {
    await updatePlayer(playerId, teamId, data);
  };
  /* バリデーション失敗時に実行される処理 */
  const onError: SubmitErrorHandler<PlayerFormValues> = (
    errors: FieldErrors<PlayerFormValues>
  ) => {
    console.log(errors);
  };

  return (
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
        <p>設定しない場合は「未設定」にしてください</p>
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
          更新する
        </button>

        <Link
          href={`/teams/${teamId}/players/${playerId}`}
          className={common.buttonCancel}
        >
          キャンセル
        </Link>
      </div>
    </form>
  );
}