// 1チーム分のスタッツ登録フローと入力状態を管理
/* 出場選手の選択、選手ごとのスタッツ入力、
   登録までのステップと状態を管理する */
// ===========================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

/* 状態を管理するReactフックの読み込み */
import { useState } from "react";

/* 型の読み込み */
import type { Player, PlayerStats } from "../types";

/* コンポーネントの読み込み */
import PlayerStatsInput from "./PlayerStatsInput";
import PlayerSelect from "./PlayerSelect";

/* 関数の読み込み */
import { createStats } from "../actions";

/* Yupスキーマの読み込み */
import { playerStatsSchema } from "../../schema";
import * as yup from "yup";

/* StatsNewFormが受け取るPropsの型定義 */
type Props = {
  gameId: number;
  teamId: number;
  teamName: string;
  /* 複数の選手オブジェクトを格納した配列 */
  players: Player[];
};

/* 1選手分のスタッツの初期値をすべて0にする */
const initialPlayerStats: PlayerStats = {
  p3A: 0,
  p3M: 0,
  p2A: 0,
  p2M: 0,
  ftA: 0,
  ftM: 0,
  oRbd: 0,
  dRbd: 0,
  ast: 0,
  stl: 0,
  blk: 0,
  tov: 0,
  pf: 0,
  tf: 0,
  fo: 0,
  dq: 0,
  playSec: 0,
};

/* スタッツ入力画面の状態と処理を管理する関数 */
export default function StatsNewForm({
  gameId,
  teamId,
  teamName,
  players,
}: Props) {
/* 画面の状態を管理するuseStateの定義 */
  // 現在どのステップを表示しているかを管理
  const [step, setStep] = useState(1);

  // 現在スタッツを入力している選手の位置を管理
  const [currentPlayerIndex, setCurrentPlayerIndex] =
    useState(0); // 型推論によりnumber型になる

  // 出場選手のIDを管理
  const [selectedPlayerIds, setSelectedPlayerIds] =
    useState<number[]>([]); // number型の配列

  // 選手ごとのスタッツを管理
  const [playerStats, setPlayerStats] =
    /* 選手IDをキーとして、PlayerStats型のスタッツを管理 */
    /* キーがnumber型、値がPlayerStats型のオブジェクト */
    useState<Record<number, PlayerStats>>({});

  // Yup検証で発生したエラーメッセージを管理
  const [statsError, setStatsError] = useState("");

/* イベントハンドラー */
  // 出場選手のチェックを変更する
  const handlePlayerChange = (playerId: number) => {
    setSelectedPlayerIds((currentIds) => {
      /* チェックが変更された選手のID(playerId)が
      現在の選択中のID(currentIds)に含まれている場合は、そのIDを削除 */
      if (currentIds.includes(playerId)) {
        return currentIds.filter((id) => id !== playerId);
      }
      
      // 選択した選手のスタッツを初期化
      setPlayerStats((currentStats) => ({
        /* 【オブジェクトのスプレッド構文】
        -> 現在のスタッツをコピー */
        ...currentStats,
        /* 初期化する選手を受け取ったplayerIdで指定し、
          1選手分のスタッツを初期値に設定 */
        [playerId]: { ...initialPlayerStats },
      }));

      /* 現在の選択中のID(currentIds)の最後に
      チェックが変更された選手のID(playerId)を追加 */
      return [...currentIds, playerId];
    });
  };

  // 指定した選手の指定したスタッツを変更する
  const handleStatsChange = (
    playerId: number,
    field: keyof PlayerStats,  // 変更するスタッツの項目名
    value: number
  ) => {
    /* 選手ごとのスタッツを更新する */
    setPlayerStats((currentStats) => ({
      /* 【オブジェクトのスプレッド構文】
      -> 現在のスタッツをコピー */
      ...currentStats,

      /* 更新するスタッツの対象(選手)を
      受け取ったplayerIdで指定 */
      [playerId]: {
        /* playerIdの選手の現在保存されているスタッツをコピー */
        ...currentStats[playerId],

        /* 更新するスタッツ項目の対象(キー)を
        受け取ったfieldで指定 */
        /* 受け取った値(value)を、指定したスタッツ項目に設定 */
        [field]: value,
      },
    }));
  };  

  // [次の選手へ]ボタンクリック時、現在の選手のスタッツをYupで検証
  const handleNextPlayer = async () => {
    /* 現在の選手IDを取得し、定数に格納 */
    const currentPlayerId = selectedPlayerIds[currentPlayerIndex];
    /* 現在の選手のスタッツを取得し、定数に格納 */
    const currentStats = playerStats[currentPlayerId];

    /* 【try-catch構文】
    tryはエラーが発生する可能性のある処理、
    try実行中にエラーが起きたらcatch以降の処理を実行する */
    try {
      /* 【await】Yupの検証処理が終わるまで次の処理に進まないために使用 */
      /* currentStatsをplayerStatsSchemaに渡して、Yupで検証 */
      await playerStatsSchema.validate(currentStats);
      /* Yupの検証に成功時、以前表示されていたエラーメッセージがあれば消す */
      setStatsError("");
      /* 現在の選手インデックスに+1して次の選手に進む */
      setCurrentPlayerIndex((currentIndex) => currentIndex + 1);
    } catch (error) {
      /* Yup検証失敗時、発生したerrorがYupのValidationErrorかどうかを確認
      -> 今回のようなYupによる検証エラーならこの条件はtrueになる */
      if (error instanceof yup.ValidationError) {
        /* Yupが作成したエラーメッセージをstatsErrorに保存 */
        setStatsError(error.message);
      }
    }
  };

  // [登録]ボタンクリック時、選択した全選手のスタッツをYupで検証し、成功したらDBへ登録する
  const handleRegister = async () => {
    /* 現在選択されている選手のスタッツだけを登録対象として取得 */
    const selectedPlayerStats = Object.fromEntries(
      selectedPlayerIds.map((playerId) => [
        playerId,
        playerStats[playerId],
      ])
    );

    try {
      // 選択した全選手のスタッツを1人ずつ検証
      /* 配列の加工は不要なので.map()ではなく【for...of】を使う
      -> 選択した各選手についてYupの非同期検証を順番に実行 */
      /* Yupの検証でエラーが発生すると、その時点でfor...ofを抜けてcatchに進む */
      for (const playerId of selectedPlayerIds) {
        /* 【await】Yupの検証処理が完了するまで次の処理に進まないようにする */
        /* 選択されている選手のスタッツをplayerStatsSchemaに渡して、Yupで検証 */
        await playerStatsSchema.validate(selectedPlayerStats[playerId]);
      }

      /* Yupの検証に成功時、以前表示されていたエラーメッセージがあれば消す */
      setStatsError("");

      /* 検証に成功した選手のスタッツだけをDBへ登録 */
      await createStats(gameId, teamId, selectedPlayerStats);
    } catch (error) {
      /* Yup検証失敗時、発生したerrorがYupのValidationErrorかどうかを確認
      -> 今回のようなYupによる検証エラーならこの条件はtrueになる */
      if (error instanceof yup.ValidationError) {
        /* Yupが作成したエラーメッセージをstatsErrorに保存 */
        setStatsError(error.message);
      }
    }
  };

  return (
    <section>
      {/* ステップ1：出場選手を選択 */}
      {step === 1 && (
        <>
          <h3>【{teamName}】</h3>

          <p>出場選手を選択してください</p>

          <PlayerSelect
            /* これは属性ではなくProps */
            players={players}
            selectedPlayerIds={selectedPlayerIds}
            onChange={handlePlayerChange}
          />

          <button
            type="button"
            /* ボタンクリックでstepを2に更新 */
            onClick={() => setStep(2)}
            /* 現在選択中の選手が0人の場合は押せない */
            disabled={selectedPlayerIds.length === 0}
          >
            スタッツ入力に進む
          </button>
        </>
      )}

      {/* ステップ2：スタッツを入力 */}
      {step === 2 && (
        <>
          <h3>【{teamName}】のスタッツ</h3>

          {players
            /* すべての所属選手の中から
            選択された選手のplayerIdが含まれるもののみを取り出す */
            .filter((player) =>
              selectedPlayerIds.includes(player.playerId)
            )

            /* 選択された選手を1人ずつ処理する */
            .map((player, index) =>
              /* 現在入力する選手の位置と一致した場合だけ表示 */
              index === currentPlayerIndex ? (
                <PlayerStatsInput
                  key={player.playerId}  // 選手を一意に識別するためのキー

                /*　これは属性ではなくProps */
                  /* 選手 */
                  player={player}
                  /* 現在の選手のスタッツ */
                  stats={playerStats[player.playerId]}
                  /* スタッツ変更時の処理 */
                  onChange={handleStatsChange}
                />
              ) : null
            )}

          {/* Yup検証でエラーがある場合、メッセージを表示 */}
          {statsError && <p>{statsError}</p>}
          
          {/* 現在の選手が最初の選手ではない場合は前の選手へ戻れる */}
          <button
            type="button"
            /* ボタンクリックでインデックス番号を1減らし、
            前の選手のスタッツ入力へ切り替える */
            onClick={() =>
              setCurrentPlayerIndex(
                (currentIndex) => currentIndex - 1
              )
            }
            /* 現在の選手が最初の選手の場合は押せない */
            disabled={currentPlayerIndex === 0}
          >
            前の選手へ
          </button>

          {/* 次の選手がいる場合は次の選手の入力に切り替える */}
          {/* currentPlayerIndex：現在入力している選手の位置
              selectedPlayerIds.length：選択した選手の人数 */}
          {
            /* 現在の選手が最後の選手より前にいるか確認 */
            currentPlayerIndex < selectedPlayerIds.length - 1 ? (
              <button
                type="button"
                /* ボタンクリック時の処理 */
                onClick={handleNextPlayer}
              >
                次の選手へ
              </button>
            ) : (
              <button
                type="button"
                /* ボタンクリック時の処理 */
                onClick={handleRegister}
              >
                登録
              </button>
            )
          }

          {/* 選手選択画面へ戻る */}
          <button
            type="button"
            onClick={() => {
              /* currentPlayerIndexを0に更新 */
              setCurrentPlayerIndex(0);
              /* stepを1に更新 */
              setStep(1);
              /* 表示中のYupエラーメッセージを消す */
              setStatsError("");
            }}
          >
            選手選択に戻る
          </button>
        </>
      )}
    </section>
  );
}