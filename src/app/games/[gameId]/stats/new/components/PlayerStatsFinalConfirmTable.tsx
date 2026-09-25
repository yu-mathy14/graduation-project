// 第2段階：出場時間・得点関連スタッツの確認表
// ===========================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

/* 型の読み込み */
import type { Player, PlayerStats } from "../../types";

/* 得点計算関数の読み込み */
import { calculatePlayerPoints } from "../../utils";

/* CSSの読み込み */
import styles from "./PlayerStatsFinalConfirmTable.module.css";
import common from "@/app/common.module.css";

/* PlayerStatsFinalConfirmTableが受け取るPropsの型定義 */
type Props = {
  players: Player[];
  selectedPlayerIds: number[];
  playerStats: Record<number, PlayerStats>;
  teamScore: number;
};

/* 全選手の出場時間・得点関連スタッツを確認する */
export default function PlayerStatsFinalConfirmTable({
  players,
  selectedPlayerIds,
  playerStats,
  teamScore,
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
      <div className={common.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.playerNumber}>背番号</th>
              <th className={styles.playerName}>選手名</th>
              <th className={common.th}>出場</th>
              <th className={common.th}>3P試投</th>
              <th className={common.th}>3P成功</th>
              <th className={common.th}>2P試投</th>
              <th className={common.th}>2P成功</th>
              <th className={common.th}>FT試投</th>
              <th className={common.th}>FT成功</th>
              <th className={common.th}>得点</th>
              <th className={common.th}>出場時間（秒）</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => {
              const isSelected = selectedPlayerIds.includes(
                player.playerId
              );

              const stats = playerStats[player.playerId];

              const points = stats
                ? calculatePlayerPoints(stats)
                : 0;

              return (
                <tr key={player.playerId}>
                  <td className={styles.playerNumber}>
                    {player.jerseyNumber}
                  </td>

                  <td className={styles.playerName}>
                    {player.playerNameKanji}
                  </td>

                  <td className={common.td}>
                    {isSelected ? "出場" : "DNP"}
                  </td>

                  <td className={common.td}>
                    {stats?.p3A ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.p3M ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.p2A ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.p2M ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.ftA ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.ftM ?? 0}
                  </td>

                  <td className={common.td}>
                    {points}
                  </td>

                  <td className={common.td}>
                    {stats?.playSec ?? 0}
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