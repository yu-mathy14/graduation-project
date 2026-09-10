// スタッツ画面・入力・ステップを管理する
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
  homeTeamName: string;
  /* 複数の選手オブジェクトを格納した配列 */
  homePlayers: Player[];
  awayTeamName: string;
  /* 複数の選手オブジェクトを格納した配列 */
  awayPlayers: Player[];
};

/* スタッツ入力画面の状態と処理を管理する関数 */
export default function StatsNewForm({
  gameId,
  homeTeamName,
  homePlayers,
  awayTeamName,
  awayPlayers,
}: Props) {
/* 画面の状態を管理するuseStateの定義 */
  // 現在どのステップを表示しているかを管理
  const [step, setStep] = useState(1);

  // 現在スタッツを入力している選手の位置を管理
  // ホームチーム
  const [currentHomePlayerIndex, setCurrentHomePlayerIndex] =
    useState(0); // 型推論によりnumber型になる

  // アウェイチーム
  const [currentAwayPlayerIndex, setCurrentAwayPlayerIndex] =
    useState(0); // 型推論によりnumber型になる

  // 出場選手のIDを管理
  // ホームチーム
  const [selectedHomePlayerIds, setSelectedHomePlayerIds] =
    /* number型の配列 */
    useState<number[]>([]);

  // アウェイチーム
  const [selectedAwayPlayerIds, setSelectedAwayPlayerIds] =
    /* number型の配列 */
    useState<number[]>([]);

  // 選手ごとのスタッツを管理
  const [playerStats, setPlayerStats] =
    /* 選手IDをキーとして、PlayerStats型のスタッツを管理 */
    /* キーがnumber型、値がPlayerStats型のオブジェクト */
    useState<Record<number, PlayerStats>>({});

/* イベントハンドラー */
  // ホームチームの出場選手のチェックを変更する
  const handleHomePlayerChange = (playerId: number) => {
    setSelectedHomePlayerIds((currentIds) => {
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

  // アウェイチームの出場選手のチェックを変更する
  const handleAwayPlayerChange = (playerId: number) => {
    setSelectedAwayPlayerIds((currentIds) => {
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
    field: keyof PlayerStats, // 変更するスタッツの項目名
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
      {/* ステップ1：ホームチームの出場選手を選択 */}
      {step === 1 && (
        <>
          <h3>ホームチーム【{homeTeamName}】</h3>

          <p>出場選手を選択してください</p>

          <PlayerSelect
            /* これは属性ではなくProps */
            players={homePlayers}
            selectedPlayerIds={selectedHomePlayerIds}
            onChange={handleHomePlayerChange}
          />

          <button
            type="button"
            /* ボタンクリックでstepを2に更新 */
            onClick={() => setStep(2)}
            /* 現在選択中のホームチーム選手が0人の場合は押せない */
            disabled={selectedHomePlayerIds.length === 0}
          >
            スタッツ入力（ホーム）に進む
          </button>
        </>
      )}

      {/* ステップ2：ホームチームのスタッツを入力 */}
      {step === 2 && (
        <>
          <h3>ホームチーム【{homeTeamName}】のスタッツ</h3>

          {homePlayers
            /* ホームチームのすべての所属選手の中から
            選択された選手のplayerIdが含まれるもののみを取り出し新たな配列とする */
            .filter((player) =>
              selectedHomePlayerIds.includes(player.playerId)
            )

            /* 選択された選手を1人ずつ処理する */
            .map((player, index) =>
              /* 現在入力する選手の位置と一致した場合だけ表示 */
              index === currentHomePlayerIndex ? (
                <PlayerStatsInput
                  key={player.playerId} // 選手を一意に識別するためのキー

                  /* これは属性ではなくProps */
                  player={player}
                  stats={playerStats[player.playerId]}
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
              setCurrentHomePlayerIndex(
                (currentIndex) => currentIndex - 1
              )
            }
            /* 現在の選手が最初の選手の場合は押せない */
            disabled={currentHomePlayerIndex === 0}
          >
            前の選手へ
          </button>

          {/* 次の選手がいる場合は次の選手の入力に切り替える */}
          {/* currentHomePlayerIndex：現在入力している選手の位置
              selectedHomePlayerIds.length：選択した選手の人数 */}
          {
            /* 現在の選手が最後の選手より前にいるか確認 */
            currentHomePlayerIndex < selectedHomePlayerIds.length - 1 ? (
              <button
                type="button"
                /* ボタンクリックでインデックス番号を1増やし、
                次の選手のスタッツ入力へ切り替える */
                onClick={() =>
                  setCurrentHomePlayerIndex(
                    (currentIndex) => currentIndex + 1
                  )
                }
              >
                次の選手へ
              </button>
            ) : (
              <button
                type="button"
                /* ホームの選手位置を最初に戻して、
                ステップ3(アウェイ選手選択)へ進む */
                onClick={() => {
                  setCurrentHomePlayerIndex(0);
                  setStep(3);
                }}
              >
                選手選択（アウェイ）に進む
              </button>
            )
          }

          {/* ホームチームの出場選手選択画面へ戻る */}
          <button
            type="button"
            /* ボタンクリックでstepを1に更新 */
            onClick={() => setStep(1)}
          >
            選手選択（ホーム）に戻る
          </button>
        </>
      )}

      {/* ステップ3：アウェイチームの出場選手を選択 */}
      {step === 3 && (
        <>
          <h3>アウェイチーム【{awayTeamName}】</h3>

          <p>出場選手を選択してください</p>

          <PlayerSelect
            /* これは属性ではなくProps */
            players={awayPlayers}
            selectedPlayerIds={selectedAwayPlayerIds}
            onChange={handleAwayPlayerChange}
          />

          {/* ホームチームのスタッツ入力画面へ戻る */}
          <button
            type="button"
            /* ボタンクリックでstepを2に更新 */
            onClick={() => setStep(2)}
          >
            スタッツ入力（ホーム）に戻る
          </button>

          <button
            type="button"
            /* ボタンクリックでstepを4に更新 */
            onClick={() => setStep(4)}
            /* 現在選択中のアウェイチーム選手が0人の場合は押せない */
            disabled={selectedAwayPlayerIds.length === 0}
          >
            スタッツ入力（アウェイ）に進む
          </button>
        </>
      )}

      {/* ステップ4：アウェイチームのスタッツを入力 */}
      {step === 4 && (
        <>
          <h3>アウェイチーム【{awayTeamName}】のスタッツ</h3>

          {awayPlayers
            /* アウェイチームのすべての所属選手の中から
            選択された選手のplayerIdが含まれるもののみを取り出し新たな配列とする */
            .filter((player) =>
              selectedAwayPlayerIds.includes(player.playerId)
            )

            /* 選択された選手を1人ずつ処理する */
            .map((player, index) =>
              /* 現在入力する選手の位置と一致した場合だけ表示 */
              index === currentAwayPlayerIndex ? (
                <PlayerStatsInput
                  key={player.playerId} // 選手を一意に識別するためのキー

                  /* これは属性ではなくProps */
                  player={player}
                  stats={playerStats[player.playerId]}
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
              setCurrentAwayPlayerIndex(
                (currentIndex) => currentIndex - 1
              )
            }
            /* 現在の選手が最初の選手の場合は押せない */
            disabled={currentAwayPlayerIndex === 0}
          >
            前の選手へ
          </button>

          {/* 次の選手がいる場合は次の選手の入力に切り替える */}
          {/* currentAwayPlayerIndex：現在入力している選手の位置
              selectedAwayPlayerIds.length：選択した選手の人数 */}
          {
            /* 現在の選手が最後の選手より前にいるか確認 */
            currentAwayPlayerIndex < selectedAwayPlayerIds.length - 1 ? (
              <button
                type="button"
                /* ボタンクリックでインデックス番号を1増やし、
                次の選手のスタッツ入力へ切り替える */
                onClick={() =>
                  setCurrentAwayPlayerIndex(
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

          {/* アウェイチームの出場選手選択画面へ戻る */}
          <button
            type="button"
            /* ボタンクリックでstepを3に更新 */
            onClick={() => setStep(3)}
          >
            選手選択（アウェイ）に戻る
          </button>
        </>
      )}
    </section>
  );
}