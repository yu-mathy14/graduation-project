// 1チーム分のスタッツ登録フローと入力状態を管理
/* 出場選手の選択、選手ごとのスタッツ入力、
   登録までのステップと状態を管理する */
// ===========================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

import Link from "next/link";

/* 状態を管理するReactフックの読み込み */
import { useState } from "react";

/* 型の読み込み */
import type { Player, PlayerStats, StatsError } from "../../types";

/* コンポーネントの読み込み */
import PlayerStatsInput from "./PlayerStatsInput";
import PlayerSelect from "./PlayerSelect";

/* 関数の読み込み */
import { createStats } from "../actions";

/* Yupスキーマの読み込み */
import { playerStatsSchema } from "../../schema";
import * as yup from "yup";

/* CSSファイルの読み込み */
import styles from "../../stats.module.css";
import common from "@/app/common.module.css";

/* 得点計算関数の読み込み */
import { calculatePlayerPoints } from "../../utils";

/* StatsNewFormが受け取るPropsの型定義 */
type Props = {
  gameId: number;
  teamId: number;
  teamName: string;
  teamScore: number;
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
  teamScore,
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

  // 発生したエラーメッセージを管理
  const [statsErrors, setStatsErrors] = useState<StatsError[]>([]);

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

    const player = players.find(
      (player) => player.playerId === currentPlayerId
    );

    /* 【try-catch構文】
    tryはエラーが発生する可能性のある処理、
    try実行中にエラーが起きたらcatch以降の処理を実行する */
    try {
      /* 【await】Yupの検証処理が終わるまで次の処理に進まないために使用 */
      /* currentStatsをplayerStatsSchemaに渡して、Yupで検証 */
      await playerStatsSchema.validate(
        currentStats,
        {
          abortEarly: false,
        }
      );

      /* Yupの検証に成功時、以前表示されていたエラーメッセージがあれば消す */
      setStatsErrors([]);

      /* 現在の選手インデックスに+1して次の選手に進む */
      setCurrentPlayerIndex((currentIndex) => currentIndex + 1);

    } catch (error) {
      /* Yup検証失敗時、発生したerrorがYupのValidationErrorかどうかを確認
      -> 今回のようなYupによる検証エラーならこの条件はtrueになる */
      if (
        error instanceof yup.ValidationError &&
        player
      ) {
        const errors: StatsError[] = [];

        /* Yupが作成したエラーメッセージをstatsErrorsに保存 */
        error.errors.forEach((message) => {
          errors.push({
            playerId: player.playerId,
            jerseyNumber: player.jerseyNumber,
            playerNameKanji: player.playerNameKanji,
            message,
          });
        });

        setStatsErrors(errors);
      }
    }
  };

  // [登録]ボタンクリック時、所属選手全員のスタッツをYupで検証し、成功したらDBへ登録する
  const handleRegister = async () => {
    /* 所属選手全員を登録対象にする */
    const allPlayerStats = Object.fromEntries(
      players.map((player) => [
        player.playerId,
        /* 選択済み選手のIDが含まれているかで場合分け */
        selectedPlayerIds.includes(player.playerId)
          /* 選択済みの選手は入力済みのスタッツを渡す */
          ? playerStats[player.playerId]
          /* 未選択の選手はスタッツの初期値(すべて0のデータ)を渡す */
          : { ...initialPlayerStats },
      ])
    );

    /* エラー情報を一時的に格納 */
    const errors: StatsError[] = [];

    // 所属選手全員ののスタッツを1人ずつ検証
    /* 配列の加工は不要なので.map()ではなく【for...of】を使う
    -> 所属選手全員についてYupの非同期検証を順番に実行 */
    /* Yupの検証でエラーが発生すると、for...ofを抜けてcatchの処理へ進む */

    /* Object.entries() → allPlayerStatsを「[キー, 値]」の配列に変換する
    　 [playerId, stats] → 配列のキーをplayerId、値をstatsとして分割代入する
    　　 for...of → 1選手分ずつ順番に取り出して処理する */
    for (const [playerId, stats] of Object.entries(allPlayerStats)) {
      const player = players.find(
        (player) => player.playerId === Number(playerId)
      );

      try {
        await playerStatsSchema.validate(stats, {
          abortEarly: false,
        });
      } catch (error) {
        if (
          error instanceof yup.ValidationError &&
          player
        ) {
          error.errors.forEach((message) => {
            errors.push({
              playerId: player.playerId,
              jerseyNumber: player.jerseyNumber,
              playerNameKanji: player.playerNameKanji,
              message,
            });
          });
        }
      }
    }

    /* 各選手の試合出場時間を合計する */
    const totalPlaySec = Object.values(allPlayerStats).reduce(
      (total, stats) => total + stats.playSec,
      0
    );

    /* 出場時間エラーを追加 */
    if (totalPlaySec !== 12000) {
      errors.push({
        message:
          "所属選手全員の試合出場時間の合計が12,000秒になるように入力してください",
      });
    }

    /* 各選手の得点を合計する */
    const totalPoints = Object.values(allPlayerStats).reduce(
      (total, stats) =>
        total + calculatePlayerPoints(stats),
      0
    );
    
    /* 得点エラーを追加 */
    if (totalPoints !== teamScore) {
      errors.push({
        message:
          "選手スタッツの得点合計と試合の最終スコアが一致するように入力してください",
      });
    }

    /* エラーが1件以上ある場合は登録しない */
    if (errors.length > 0) {
      setStatsErrors(errors);
      return;
    }

    /* エラーがなければServer Actionを実行 */
    try {
      await createStats(
        gameId,
        teamId,
        allPlayerStats
      );
    } catch (error) {
      /* Server Action側で発生したエラーを表示 */
      if (error instanceof Error) {
        setStatsErrors([
          {
            message: error.message,
          },
        ]);
      }
    }
  };

  return (
    <section className={styles.container}>
      {/* ステップ1：出場選手を選択 */}
      {step === 1 && (
        <div className={styles.step}>
          <h3>【{teamName}】</h3>

          <p>出場選手を選択してください</p>

          <PlayerSelect
            /* これは属性ではなくProps */
            players={players}
            selectedPlayerIds={selectedPlayerIds}
            onChange={handlePlayerChange}
          />

          {/* 5人未満の場合は注意書きを表示 */}
          {selectedPlayerIds.length < 5 && (
            <p className={common.error}>
              ※出場選手を5人以上選択してください
            </p>
          )}

          <div className={styles.navigation}>
            <button
              type="button"
              className={common.button}
              onClick={() => setStep(2)}
              disabled={selectedPlayerIds.length < 5}
            >
              スタッツ入力に進む
            </button>
            
            <Link
              href={`/games/${gameId}`}
              className={common.buttonCancel}
            >
              キャンセル
            </Link>
          </div>
        </div>
      )}

      {/* ステップ2：スタッツを入力 */}
      {step === 2 && (
        <div className={styles.step}>
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
          
          {/* エラーがある場合、エラーメッセージを一覧表示 */}
          {statsErrors.length > 0 && (
            <div>
              {statsErrors.map((error, index) => (
                <p
                  key={index}
                  className={common.error}
                >
                  {error.playerId !== undefined &&
                    `背番号${error.jerseyNumber} ${error.playerNameKanji}：`}
                  {error.message}
                </p>
              ))}
            </div>
          )}

          {/* 現在の選手が最初の選手ではない場合は前の選手へ戻れる */}
          <div className={styles.navigation}>
            <button
              type="button"
              className={common.button}
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
                  className={common.button}
                  /* ボタンクリック時の処理 */
                  onClick={handleNextPlayer}
                >
                  次の選手へ
                </button>
              ) : (
                <button
                  type="button"
                  className={common.button}
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
              className={common.button}
              onClick={() => {
                /* currentPlayerIndexを0に更新 */
                setCurrentPlayerIndex(0);
                /* stepを1に更新 */
                setStep(1);
                /* 表示中のYupエラーメッセージを消す */
                setStatsErrors([]);
              }}
            >
              選手選択に戻る
            </button>

            <Link
              href={`/games/${gameId}`}
              className={common.buttonCancel}
            >
              キャンセル
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}