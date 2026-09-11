// 1チーム分の登録フローを管理
/*  */
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

/* StatsNewFormが受け取るPropsの型定義 */
type Props = {
  gameId: number;
  teamName: string;
  /* 複数の選手オブジェクトを格納した配列 */
  players: Player[];
};

/* スタッツ入力画面の状態と処理を管理する関数 */
export default function StatsNewForm({
  gameId,
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

/* イベントハンドラー */
  // 出場選手のチェックを変更する
  const handlePlayerChange = (playerId: number) => {
    setSelectedPlayerIds((currentIds) => {
      /* チェックが変更された選手のID(playerId)が
      現在の選択中のID(currentIds)に含まれている場合は、そのIDを削除 */
      if (currentIds.includes(playerId)) {
        return currentIds.filter((id) => id !== playerId);
      }

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
                /* ボタンクリックでインデックス番号を1増やし、
                次の選手のスタッツ入力へ切り替える */
                onClick={() =>
                  setCurrentPlayerIndex(
                    (currentIndex) => currentIndex + 1
                  )
                }
              >
                次の選手へ
              </button>
            ) : (
              <button
                type="button"
                /* ボタンクリックで非同期のcreateStats()関数を実行 */
                onClick={async () => {
                  await createStats(gameId, playerStats);
                }}
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
            }}
          >
            選手選択に戻る
          </button>
        </>
      )}
    </section>
  );
}