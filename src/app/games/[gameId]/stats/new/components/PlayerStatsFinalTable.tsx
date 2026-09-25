// 全選手の出場時間・得点関連スタッツを入力する表
// ===========================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

/* 型の読み込み */
import type { Player, PlayerStats } from "../../types";

/* 得点計算関数の読み込み */
import { calculatePlayerPoints } from "../../utils";

/* CSSの読み込み */
import styles from "./PlayerStatsFinalTable.module.css";
import common from "@/app/common.module.css";

/* PlayerStatsFinalTableが受け取るPropsの型定義 */
type Props = {
  players: Player[];
  selectedPlayerIds: number[];
  /* キーの型は数値型、値の型はPlayerStats */
  playerStats: Record<number, PlayerStats>;
  teamScore: number;
  /* 選手ID・変更するスタッツ・変更後の値を受け取る関数 */
  onChange: (
    playerId: number,
    field: keyof PlayerStats, // PlayerStatsのキー
    value: number
  ) => void; // 戻り値なし
};

/* 全選手の出場時間・得点関連スタッツを表形式で入力する */
export default function PlayerStatsFinalTable({
  players,
  selectedPlayerIds,
  playerStats,
  teamScore,
  onChange,
}: Props) {
  /* 全選手の出場時間を合計 */
  const totalPlaySec = players.reduce(
    (total, player) =>
      total + (playerStats[player.playerId]?.playSec ?? 0),
    0
  );

  /* 全選手の得点を合計 */
  const totalPoints = players.reduce(
    (total, player) => {
      const stats = playerStats[player.playerId];
      if (!stats) {
        return total;
      }
      return total + calculatePlayerPoints(stats);
    },
    0
  );

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.player}>選手</th>
              <th className={styles.participation}>出場</th>
              <th>3P試投</th>
              <th>3P成功</th>
              <th>2P試投</th>
              <th>2P成功</th>
              <th>FT試投</th>
              <th>FT成功</th>
              <th>得点</th>
              <th>出場時間（秒）</th>
            </tr>
          </thead>

          {/* データの値を入力する部分 */}
          <tbody>
            {players.map((player) => {
              const isSelected = selectedPlayerIds.includes(
                player.playerId
              );

              const stats = playerStats[player.playerId];

              /* 1選手の得点 */
              /* 【三項演算子】statsがあるか */
              const points = stats
                ? calculatePlayerPoints(stats) // statsあり
                : 0; // statsなし

              return (
                /* 選手IDで選手を一意に識別する */
                <tr key={player.playerId}> 
                  
                  <td className={styles.player}>
                    #{player.jerseyNumber} {player.playerNameKanji}
                  </td>

                  <td className={styles.participation}>
                    {isSelected ? "出場" : "DNP"}
                  </td>

                  <td>
                    <input
                      type="number" // 入力欄の種類は数値
                      min="0" // 最小値0
                      className={styles.input}
                      /* stats が存在すれば p3A を表示し、存在しなければ 0 を表示する */
                      value={stats?.p3A ?? 0}
                      disabled={!isSelected}
                      /* 値が変わった時の処理 */
                      onChange={(e) =>
                        onChange(
                          player.playerId,
                          "p3A",
                          /* 入力された値を数値型に変換してonChangeに渡す */
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={stats?.p3M ?? 0}
                      disabled={!isSelected}
                      onChange={(e) =>
                        onChange(
                          player.playerId,
                          "p3M",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={stats?.p2A ?? 0}
                      disabled={!isSelected}
                      onChange={(e) =>
                        onChange(
                          player.playerId,
                          "p2A",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={stats?.p2M ?? 0}
                      disabled={!isSelected}
                      onChange={(e) =>
                        onChange(
                          player.playerId,
                          "p2M",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={stats?.ftA ?? 0}
                      disabled={!isSelected}
                      onChange={(e) =>
                        onChange(
                          player.playerId,
                          "ftA",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={stats?.ftM ?? 0}
                      disabled={!isSelected}
                      onChange={(e) =>
                        onChange(
                          player.playerId,
                          "ftM",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td className={styles.points}>
                    {points}
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={stats?.playSec ?? 0}
                      disabled={!isSelected}
                      onChange={(e) =>
                        onChange(
                          player.playerId,
                          "playSec",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.summary}>
        <p>
          出場時間合計：{totalPlaySec} / 12,000秒
        </p>

        <p>
          得点合計：{totalPoints} / {teamScore}点
        </p>
      </div>
    </div>
  );
}