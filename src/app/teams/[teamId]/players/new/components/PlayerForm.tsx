// Playersの入力フォームを表示し、React Hook FormとYupで入力値を検証する
/* フォーム部分をClient Componentに分離している */
// ==================================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm,
         type FieldErrors,
         type SubmitErrorHandler,
         type SubmitHandler,
       } from "react-hook-form";

/* 他ファイルから必要なものを読み込み */
import { createPlayer } from "../actions";
import { playerSchema, type PlayerFormValues } from "../schema";

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
  const onSubmit: SubmitHandler<PlayerFormValues> = async (data) => {
    await createPlayer(teamId, data);
  };
  /* バリデーション失敗時に実行される処理 */
  const onError: SubmitErrorHandler<PlayerFormValues> = (
    errors: FieldErrors<PlayerFormValues>
    ) => {
    console.log(errors);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div>
          <label htmlFor="playerNameKanji">氏名(漢字) * </label>
          <input
            id="playerNameKanji" // labelと対応
            type="text"
            /* playerNameKanjiをReact Hook Formに登録 */
            {...register("playerNameKanji")}
          />
          {/* playerNameKanjiのバリデーションエラーがある場合、メッセージを表示 */}
          <div>{errors.playerNameKanji?.message}</div>
        </div>


        <div>
          <label htmlFor="playerNameKana">
            氏名(かな) *
          </label>
          <input
            id="playerNameKana" // labelと対応
            type="text"
            /* playerNameKanaをReact Hook Formに登録 */
            {...register("playerNameKana")}
          />
          {/* playerNameKanaのバリデーションエラーがある場合、メッセージを表示 */}
          <div>{errors.playerNameKana?.message}</div>
        </div>

        <div>
          <label htmlFor="jerseyNumber">
            背番号 *
          </label>
          <input
            id="jerseyNumber" // labelと対応
            type="number" // 数値入力用の入力欄
            min={1} // ブラウザ側の最小値：1
            /* jerseyNumberをReact Hook Formに登録 */
            {...register("jerseyNumber")}
          />
          {/* jerseyNumberのバリデーションエラーがある場合、メッセージを表示 */}
          <div>{errors.jerseyNumber?.message}</div>
        </div>

        <div>
          <label htmlFor="almaMater">
            出身校 *
          </label>
          <input
            id="almaMater" // labelと対応
            type="text"
            /* almaMaterをReact Hook Formに登録 */
            {...register("almaMater")}
          />
          {/* almaMaterのバリデーションエラーがある場合、メッセージを表示 */}
          <div>{errors.almaMater?.message}</div>

          <p>出身校を設定する場合は書き換えてください</p>
          <p>設定しない場合は「未設定」のままにしてください</p>
        </div>

        <div>
          <label htmlFor="height">
            身長(cm)
          </label>
          <input
            id="height" // labelと対応
            type="number" // 数値入力用の入力欄
            min={51} // ブラウザ側の最小値：51
            /* heightをReact Hook Formに登録 */
            {...register("height")}
          />
           {/* heightのバリデーションエラーがある場合、メッセージを表示 */}
          <div>{errors.height?.message}</div>
        </div>

        <div>
          <label htmlFor="weight">
            体重(kg)
          </label>
          <input
            id="weight" // labelと対応
            type="number" // 数値入力用の入力欄
            min={4} // ブラウザ側の最小値：4
            /* weightをReact Hook Formに登録 */
            {...register("weight")}
          />
          {/* weightのバリデーションエラーがある場合、メッセージを表示 */}
          <div>{errors.weight?.message}</div>
        </div>

        <div>
          <button type="submit">
            登録する
          </button>
        </div>
      </form>
    </>

  );
}
