// Gamesの入力フォームを表示し、React Hook FormとYupで入力値を検証する
/* フォーム部分をClient Componentとして実装している */
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
import { updateGame } from "../actions";
import { gameSchema, type GameFormValues,} from "../../../schema";
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
  gameId: number;
  tipoffTime: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  teams: Team[];
  hasStats: boolean;
};

export default function GameForm({
  gameId,
  tipoffTime,
  homeTeamId,
  awayTeamId,
  homeScore,
  awayScore,
  teams,
  hasStats,
}: Props) {
  // フォームの初期値
  /* 編集対象の試合の現在値を初期値として設定 */
  const gameDefaultValue: GameFormValues = {
    tipoffTime,
  /* 数値型の現在値を文字列型に変換 */
    homeTeamId: String(homeTeamId),
    awayTeamId: String(awayTeamId),
    homeScore: String(homeScore),
    awayScore: String(awayScore),
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
    await updateGame(gameId, data);
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
      {/* スタッツがある場合は変更不可、理由を画面に表示 */}
      {hasStats && (
        <p className={common.notice}>
          スタッツが登録されているため、ホームチームとアウェイチームは変更できません。
        </p>
      )}

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
          disabled={hasStats}
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
                // 所属選手5人未満は選択不可
                team._count.player < 5 ||
                // アウェイで選択中のチームは選択不可
                String(team.teamId) === selectedAwayTeamId
              }
            >
              {team.teamName}
              {/* 選択できない理由を表示 */}
              {team._count.player < 5
                ? "（所属選手5人未満）"
                : String(team.teamId) === selectedAwayTeamId
                  ? "（アウェイチーム選択中）"
                  : ""}
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
          disabled={hasStats}
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
                // 所属選手5人未満は選択不可
                team._count.player < 5 ||
                // ホームで選択中のチームは選択不可
                String(team.teamId) === selectedHomeTeamId
              }
            >
              {team.teamName}
              {/* 選択できない理由を表示 */}
              {team._count.player < 5
                ? "（所属選手5人未満）"
                : String(team.teamId) === selectedHomeTeamId
                  ? "（ホームチーム選択中）"
                  : ""}
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
          更新する
        </button>

        <Link
          href={`/games/${gameId}`}
          className={common.buttonCancel}
        >
          キャンセル
        </Link>
      </div>
    </form>

  );
}
