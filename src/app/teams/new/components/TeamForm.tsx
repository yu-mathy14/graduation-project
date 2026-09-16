// Teamsの入力フォームを表示し、React Hook FormとYupで入力値を検証する
/* フォーム部分をClient Componentに分離し、
  React Hook Form + Yup でバリデーションチェックを行う */ 
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
import { createTeam } from "../actions";
import { teamSchema, type TeamFormValues } from "../../schema";

export default function TeamForm() {
  // デフォルト値
  const teamDefaultValue: TeamFormValues = {
    teamName: "",
    teamColor: "#FFFFFF",
  };

  // フォーム初期化
  const { register, handleSubmit,formState: { errors },} = useForm<TeamFormValues>({
    // デフォルト値
    defaultValues: teamDefaultValue,
    /* バリデーションをYupに任せる */
    /* resolver -> React Hook Formと外部バリデーションライブラリを接続する仕組み */
    /* yupResolver -> Yupの検証結果をReact Hook Formで扱えるようにするアダプタ */
    resolver: yupResolver(teamSchema), // Yupに検証を委ねる
  });

  // サブミット時の処理
  /* バリデーション成功時に実行される処理 */
  const onSubmit: SubmitHandler<TeamFormValues> = async (data) => {
    await createTeam(data);
  };
  /* バリデーション失敗時に実行される処理 */
  const onError: SubmitErrorHandler<TeamFormValues> = (
    errors: FieldErrors<TeamFormValues>
    ) => {
    console.log(errors);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div>
          <label htmlFor="teamName">チーム名 *</label>
          <input
            id="teamName" // labelと対応
            type="text"
            /* teamNameをReact Hook Formに登録 */
            {...register("teamName")}
            />
          {/* teamNameのバリデーションエラーがある場合、メッセージを表示 */}
          <div>{errors.teamName?.message}</div>
        </div>

        <div>
          <label htmlFor="teamColor">チームカラー *</label>
          <input
            id="teamColor" // labelと対応
            type="text"
            placeholder="#FFFFFF"
            /* teamColorをReact Hook Formに登録 */
            {...register("teamColor")}
          />
          {/* teamColorのバリデーションエラーがある場合、メッセージを表示 */}
          <div>{errors.teamColor?.message}</div>

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
          <button type="submit">登録する</button>
        </div>
      </form>
  </>

  );
}
