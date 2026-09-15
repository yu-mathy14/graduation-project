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
  const { register, handleSubmit, formState: { errors },} = useForm<GameFormValues>({
    // デフォルト値
    defaultValues: gameDefaultValue,
    /* バリデーションをYupに任せる */
    /* resolver -> React Hook Formと外部バリデーションライブラリを接続する仕組み */
    /* yupResolver -> Yupの検証結果をReact Hook Formで扱えるようにするアダプタ */
    resolver: yupResolver(gameSchema),
  });

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
  <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
    <div>
      <label htmlFor="tipoffTime">試合開始日時 * </label>
      <input
        id="tipoffTime" // labelと対応
        type="datetime-local" // 日時入力用の入力欄
        /* tipoffTimeをReact Hook Formに登録 */
        {...register("tipoffTime")}
      />
      {/* tipoffTimeのバリデーションエラーがある場合、メッセージを表示 */}
      <div>{errors.tipoffTime?.message}</div>
    </div>

    <div>
      <label htmlFor="homeTeamId">
        ホームチーム *
      </label>
      <select
        id="homeTeamId" // labelと対応
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
            disabled={team._count.player < 5} // 所属選手5人未満は選択不可
          >
            {team.teamName}
            {/* 所属選手5人未満の場合は画面上に表示 */}
            {team._count.player < 5 ? "（所属選手5人未満）" : ""}
          </option>
        ))}
      </select>
      {/* homeTeamIdのバリデーションエラーがある場合、メッセージを表示 */}
      <div>{errors.homeTeamId?.message}</div>
    </div>

    <div>
      <label htmlFor="awayTeamId">
        アウェイチーム *
      </label>
      <select
        id="awayTeamId" // labelと対応
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
            disabled={team._count.player < 5} // 所属選手5人未満は選択不可
          >
            {team.teamName}
            {/* 所属選手5人未満の場合は画面上に表示 */}
            {team._count.player < 5 ? "（所属選手5人未満）" : ""}
          </option>
        ))}
      </select>

      {/* awayTeamIdのバリデーションエラーがある場合、メッセージを表示 */}
      <div>{errors.awayTeamId?.message}</div>
    </div>

    <div>
      <label htmlFor="homeScore">
        ホーム最終スコア *
      </label>
      <input
        id="homeScore" // labelと対応
        type="number" // 数値入力用の入力欄
        min={0} // ブラウザ側の最小値：0
        /* homeScoreをReact Hook Formに登録 */
        {...register("homeScore")}
      />
      {/* homeScoreのバリデーションエラーがある場合、メッセージを表示 */}
      <div>{errors.homeScore?.message}</div>
    </div>

    <div>
      <label htmlFor="awayScore">
        アウェイ最終スコア *
      </label>
      <input
        id="awayScore" // labelと対応
        type="number" // 数値入力用の入力欄
        min={0} // ブラウザ側の最小値：0
        /* awayScoreをReact Hook Formに登録 */
        {...register("awayScore")}
      />
      {/* awayScoreのバリデーションエラーがある場合、メッセージを表示 */}
      <div>{errors.awayScore?.message}</div>
    </div>

    <div>
      <button type="submit">
        登録する
      </button>
    </div>
  </form>

  );
}
