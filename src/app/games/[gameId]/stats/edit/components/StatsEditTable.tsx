// チームのスタッツを一覧・編集するコンポーネント
// ===========================================

"use client";

/* 型の読み込み */
import type { PlayerStats } from "../../new/types"; 

/* StatsEditTableが受け取るPropsの型定義 */
type Props = {
  stats: {
    playerId: number;
    p3A: number;
    p3M: number;
    p2A: number;
    p2M: number;
    ftA: number;
    ftM: number;
    oRbd: number;
    dRbd: number;
    ast: number;
    stl: number;
    blk: number;
    tov: number;
    pf: number;
    tf: number;
    fo: number;
    dq: number;
    playSec: number;
    player: {
      playerNameKanji: string;
      jerseyNumber: number;
    };
  }[];
  /* 選手ID・変更するスタッツ・変更後の値を受け取る関数 */
  onChange: (
    playerId: number,
    field: keyof PlayerStats, // PlayerStatsのキー
    value: number
  ) => void; // 戻り値なし
};

/* チームの選手ごとのスタッツを一覧・編集する関数 */
export default function StatsEditTable({
  stats,
  onChange,
}: Props) {
  return (
    <table>
      {/* 見出しを作る */}
      <thead>
        <tr>
          <th>背番号</th>
          <th>選手名</th>
          <th>3P試投</th>
          <th>3P成功</th>
          <th>2P試投</th>
          <th>2P成功</th>
          <th>FT試投</th>
          <th>FT成功</th>
          <th>OR</th>
          <th>DR</th>
          <th>AST</th>
          <th>STL</th>
          <th>BLK</th>
          <th>TO</th>
          <th>PF</th>
          <th>TF</th>
          <th>FO</th>
          <th>DQ</th>
          <th>出場時間(秒)</th>
        </tr>
      </thead>

      {/* 1つ1つのデータを表示 */}
      <tbody>
        {stats.map((stat) => (
          /* スタッツを一意に識別するためのキー */
          <tr key={stat.playerId}>
            <td>{stat.player.jerseyNumber}</td>

            <td>{stat.player.playerNameKanji}</td>

            <td>
              <input
                type="number" // 入力欄の種類は数値
                min="0" // 最小値0
                /* 現在登録されているstats.p3Aの値を表示 */
                value={stat.p3A}
                onChange={(e) =>
                  onChange(
                    stat.playerId, // どの選手？
                    "p3A", // どのカラム？
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
                value={stat.p3M}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
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
                value={stat.p2A}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
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
                value={stat.p2M}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
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
                value={stat.ftA}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
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
                value={stat.ftM}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "ftM",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.oRbd}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "oRbd",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.dRbd}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "dRbd",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.ast}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "ast",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.stl}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "stl",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.blk}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "blk",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.tov}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "tov",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.pf}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "pf",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.tf}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "tf",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.fo}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "fo",
                    Number(e.target.value)
                  )
                }
              />
            </td>

            <td>
              <input
                type="checkbox"
                checked={stat.dq === 1}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "dq",
                    e.target.checked ? 1 : 0
                  )
                }
              />
            </td>

            <td>
              <input
                type="number"
                min="0"
                value={stat.playSec}
                onChange={(e) =>
                  onChange(
                    stat.playerId,
                    "playSec",
                    Number(e.target.value)
                  )
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}