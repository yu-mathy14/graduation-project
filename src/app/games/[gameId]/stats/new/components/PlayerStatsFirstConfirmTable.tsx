// 第1段階：全選手のスタッツ確認表
// ===========================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

/* 型の読み込み */
import type { Player, PlayerStats } from "../../types";

/* CSSの読み込み */
import styles from "./PlayerStatsFirstConfirmTable.module.css";
import common from "@/app/common.module.css";

/* PlayerStatsFirstConfirmTableが受け取るPropsの型定義 */
type Props = {
  players: Player[];
  selectedPlayerIds: number[];
  playerStats: Record<number, PlayerStats>;
};

/* 第1段階で入力した全選手のスタッツを確認する表 */
export default function PlayerStatsFirstConfirmTable({
  players,
  selectedPlayerIds,
  playerStats,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={common.tableScroll}>
        <table className={`${common.table} ${common.statsTable}`}>
          <thead>
            <tr>
              <th className={common.th}>背番号</th>
              <th className={common.th}>選手名</th>
              <th className={common.th}>出場</th>
              <th className={common.th}>OR</th>
              <th className={common.th}>DR</th>
              <th className={common.th}>AST</th>
              <th className={common.th}>STL</th>
              <th className={common.th}>BLK</th>
              <th className={common.th}>TO</th>
              <th className={common.th}>PF</th>
              <th className={common.th}>TF</th>
              <th className={common.th}>FO</th>
              <th className={common.th}>DQ</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => {
              const isSelected = selectedPlayerIds.includes(
                player.playerId
              );

              const stats =
                playerStats[player.playerId];

              return (
                <tr key={player.playerId}>
                  <td className={common.td}>
                    {player.jerseyNumber}
                  </td>

                  <td className={common.td}>
                    {player.playerNameKanji}
                  </td>

                  <td className={common.td}>
                    {isSelected ? "出場" : "DNP"}
                  </td>

                  <td className={common.td}>
                    {stats?.oRbd ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.dRbd ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.ast ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.stl ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.blk ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.tov ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.pf ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.tf ?? 0}
                  </td>

                  <td className={common.td}>
                    {stats?.fo ?? 0}
                  </td>

                  <td className={common.td}>
                    {(stats?.dq ?? 0) === 1 ? "あり" : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}