// Gamesの入力フォームを表示し、React Hook FormとYupで入力値を検証する
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
import { createGame } from "../actions";
import { gameSchema, type GameFormValues,} from "../../schema";
import common from "@/app/common.module.css";
import Link from "next/link";

/* チームの型定義 */
type Team = {
  teamId: number;
  teamName: string;
  /* 所属選手数を管理 */
  _count: {
    player: number;
  };
};

/* GameFormが受け取るPropsの型定義 */
type Props = {
  teams: Team[];
};

export default function GameForm({ teams }: Props) {
  // フォームの初期値
  const gameDefaultValue: GameFormValues = {
    tipoffTime: "",
    homeTeamId: "",
    awayTeamId: "",
    homeScore: "0",
    awayScore: "0",
  };

  // フォーム初期化
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GameFormValues>({
    // デフォルト値
    defaultValues: gameDefaultValue,
    /* バリデーションをYupに任せる */
    /* resolver -> React Hook Formと外部バリデーションライブラリを接続する仕組み */
    /* yupResolver -> Yupの検証結果をReact Hook Formで扱えるようにするアダプタ */
    resolver: yupResolver(gameSchema),
  });

  /* 現在選択されているホーム・アウェイチームを取得 */
  const selectedHomeTeamId = watch("homeTeamId");
  const selectedAwayTeamId = watch("awayTeamId");

  // サブミット時の処理
  /* バリデーション成功時に実行される処理 */
  const onSubmit: SubmitHandler<GameFormValues> = async (
    data
    ) => {
    await createGame(data);
  };
  /* バリデーション失敗時に実行される処理 */
  const onError: SubmitErrorHandler<GameFormValues> = (
    errors: FieldErrors<GameFormValues>
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
        htmlFor="tipoffTime"
        className={common.label}
      >
        試合開始日時 *
      </label>

      <input
        id="tipoffTime" // labelと対応
        type="datetime-local" // 日時入力用の入力欄
        className={common.input}
        /* tipoffTimeをReact Hook Formに登録 */
        {...register("tipoffTime")}
      />
      {/* tipoffTimeのバリデーションエラーがある場合、メッセージを表示 */}
      <div className={common.error}>
        {errors.tipoffTime?.message}
      </div>
    </div>

    <div className={common.field}>
      <label
        htmlFor="homeTeamId"
        className={common.label}
      >
        ホームチーム *
      </label>

      <select
        id="homeTeamId" // labelと対応
        className={common.select}
        /* homeTeamIdをReact Hook Formに登録 */
        {...register("homeTeamId")}
      >
        <option value="">
          チームを選択してください
        </option>

        {/* 配列からすべての登録済みのチームをプルダウンの選択肢にする */}
        {/* 選択したチームのteamIdがvalueとして設定され、
        　　React Hook Formで取得する値になる */}
        {teams.map((team) => (
          <option
            key={team.teamId} // チームを一意に識別するためのキー
            value={team.teamId}
            disabled={
              team._count.player < 5 || // 所属選手5人未満は選択不可
              String(team.teamId) === selectedAwayTeamId // アウェイで選択中のチームは選択不可
            } 
          >
            {team.teamName}
            {/* 所属選手5人未満の場合は画面上に表示 */}
            {team._count.player < 5
              ? "（所属選手5人未満）"
              /* アウェイで選択中の場合は画面上に表示 */
              : String(team.teamId) === selectedAwayTeamId
                ? "（アウェイチーム選択中）"
                : ""
            }
          </option>
        ))}
      </select>
      {/* homeTeamIdのバリデーションエラーがある場合、メッセージを表示 */}
      <div className={common.error}>
        {errors.homeTeamId?.message}
      </div>
    </div>

    <div className={common.field}>
      <label
        htmlFor="awayTeamId"
        className={common.label}
      >
        アウェイチーム *
      </label>

      <select
        id="awayTeamId" // labelと対応
        className={common.select}
        /* awayTeamIdをReact Hook Formに登録 */
        {...register("awayTeamId")}
      >
        <option value="">
          チームを選択してください
        </option>

        {/* 配列からすべての登録済みのチームをプルダウンの選択肢にする */}
        {/* 選択したチームのteamIdがvalueとして設定され、
        　　React Hook Formで取得する値になる */}
        {teams.map((team) => (
          <option
            key={team.teamId} // チームを一意に識別するためのキー
            value={team.teamId}
            disabled={
              team._count.player < 5 || // 所属選手5人未満は選択不可
              String(team.teamId) === selectedHomeTeamId // ホームで選択中のチームは選択不可
            } 
          >
            {team.teamName}
            {/* 所属選手5人未満の場合は画面上に表示 */}
            {team._count.player < 5
              ? "（所属選手5人未満）"
              /* ホームで選択中の場合は画面上に表示 */
              : String(team.teamId) === selectedHomeTeamId
                ? "（ホームチーム選択中）"
                : ""
            }
          </option>
        ))}
      </select>

      {/* awayTeamIdのバリデーションエラーがある場合、メッセージを表示 */}
      <div className={common.error}>
        {errors.awayTeamId?.message}
      </div>
    </div>

    <div className={common.field}>
      <label
        htmlFor="homeScore"
        className={common.label}
      >
        ホーム最終スコア *
      </label>

      <input
        id="homeScore" // labelと対応
        type="number" // 数値入力用の入力欄
        min={0} // ブラウザ側の最小値：0
        className={common.input}
        /* homeScoreをReact Hook Formに登録 */
        {...register("homeScore")}
      />
      {/* homeScoreのバリデーションエラーがある場合、メッセージを表示 */}
      <div className={common.error}>
        {errors.homeScore?.message}
      </div>
    </div>

    <div className={common.field}>
      <label
        htmlFor="awayScore"
        className={common.label}
      >
        アウェイ最終スコア *
      </label>

      <input
        id="awayScore" // labelと対応
        type="number" // 数値入力用の入力欄
        min={0} // ブラウザ側の最小値：0
        className={common.input}
        /* awayScoreをReact Hook Formに登録 */
        {...register("awayScore")}
      />
      {/* awayScoreのバリデーションエラーがある場合、メッセージを表示 */}
      <div className={common.error}>
        {errors.awayScore?.message}
      </div>
    </div>

    <div className={common.navigation}>
      <button
        type="submit"
        className={common.button}
      >
        登録する
      </button>

      <Link
        href="/games"
        className={common.buttonCancel}
      >
        キャンセル
      </Link>
    </div>
  </form>

  );
}
