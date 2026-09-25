// スタッツ編集内容を確認する表
// ===========================================

"use client";

/* 型の読み込み */
import type { PlayerStats } from "../../types";

/* 得点計算関数の読み込み */
import { calculatePlayerPoints } from "../../utils";

/* CSSの読み込み */
import common from "@/app/common.module.css";
import styles from "./StatsEditConfirmTable.module.css";

/* StatsEditConfirmTableが受け取るPropsの型定義 */
type Props = {
  stats: {
    playerId: number;
    playerNameKanji: string;
    jerseyNumber: number;
    stats: PlayerStats;
  }[];
  teamScore: number;
};

/* スタッツ編集内容を確認する */
export default function StatsEditConfirmTable({
  stats,
  teamScore,
}: Props) {
  /* 全選手の出場時間を合計 */
  const totalPlaySec = stats.reduce(
    (total, stat) => total + stat.stats.playSec,
    0
  );

  /* 全選手の得点を合計 */
  const totalPoints = stats.reduce(
    (total, stat) =>
      total + calculatePlayerPoints(stat.stats),
    0
  );

  return (
    <div className={styles.container}>
      <div className={common.tableScroll}>
        <table className={common.table}>
          <thead>
            <tr>
              <th className={`${common.th} ${styles.playerNumber}`}>
                背番号
              </th>

              <th className={`${common.th} ${styles.playerName}`}>
                選手名
              </th>

              <th className={common.th}>3P試投</th>
              <th className={common.th}>3P成功</th>
              <th className={common.th}>2P試投</th>
              <th className={common.th}>2P成功</th>
              <th className={common.th}>FT試投</th>
              <th className={common.th}>FT成功</th>
              <th className={common.th}>得点</th>
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
              <th className={common.th}>出場時間（秒）</th>
            </tr>
          </thead>

          <tbody>
            {stats.map((stat) => {
              const points = calculatePlayerPoints(stat.stats);

              return (
                <tr key={stat.playerId}>
                  <td
                    className={`${common.td} ${styles.playerNumber}`}
                  >
                    {stat.jerseyNumber}
                  </td>

                  <td
                    className={`${common.td} ${styles.playerName}`}
                  >
                    {stat.playerNameKanji}
                  </td>

                  <td className={common.td}>
                    {stat.stats.p3A}
                  </td>

                  <td className={common.td}>
                    {stat.stats.p3M}
                  </td>

                  <td className={common.td}>
                    {stat.stats.p2A}
                  </td>

                  <td className={common.td}>
                    {stat.stats.p2M}
                  </td>

                  <td className={common.td}>
                    {stat.stats.ftA}
                  </td>

                  <td className={common.td}>
                    {stat.stats.ftM}
                  </td>

                  <td className={common.td}>
                    {points}
                  </td>

                  <td className={common.td}>
                    {stat.stats.oRbd}
                  </td>

                  <td className={common.td}>
                    {stat.stats.dRbd}
                  </td>

                  <td className={common.td}>
                    {stat.stats.ast}
                  </td>

                  <td className={common.td}>
                    {stat.stats.stl}
                  </td>

                  <td className={common.td}>
                    {stat.stats.blk}
                  </td>

                  <td className={common.td}>
                    {stat.stats.tov}
                  </td>

                  <td className={common.td}>
                    {stat.stats.pf}
                  </td>

                  <td className={common.td}>
                    {stat.stats.tf}
                  </td>

                  <td className={common.td}>
                    {stat.stats.fo}
                  </td>

                  <td className={common.td}>
                    {stat.stats.dq === 1 ? "あり" : "-"}
                  </td>

                  <td className={common.td}>
                    {stat.stats.playSec}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.summary}>
        <p>
          出場時間合計：{totalPlaySec.toLocaleString()} / 12,000秒
        </p>

        <p>
          得点合計：{totalPoints} / {teamScore}点
        </p>
      </div>
    </div>
  );
}