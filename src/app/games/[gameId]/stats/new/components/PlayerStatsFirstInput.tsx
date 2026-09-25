// 第1段階：1選手分のスタッツを入力
// ===========================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

/* 型の読み込み */
import type { Player, PlayerStats } from "../../types";

/* CSSの読み込み */
import styles from "./PlayerStatsFirstInput.module.css";
import common from "@/app/common.module.css";

/* PlayerStatsInputが受け取るPropsの型定義 */
type Props = {
  player: Player;
  /* まだその選手のスタッツを変更していない場合はundefinedの可能性がある */
  stats: PlayerStats | undefined;
  /* 選手ID・変更するスタッツ・変更後の値を受け取る関数 */
  onChange: (
    playerId: number,
    field: keyof PlayerStats, // PlayerStatsのキー
    value: number
  ) => void; // 戻り値なし
};

/* 1人分のスタッツ入力を表示し、変更を親に伝える関数 */
export default function PlayerStatsInput({
  player,
  stats,
  onChange,
}: Props) {
  return (
    <div className={styles.container}>
      <h4 className={styles.playerTitle}>
        #{player.jerseyNumber} {player.playerNameKanji}
      </h4>

      {/* リバウンド */}
      <div className={styles.statsGroup}>
        <h5 className={styles.statsGroupTitle}>
          リバウンド
        </h5>

        <div className={styles.statsGrid}>
          <label className={styles.statsField}>
            OR
            <input
              type="number" // 入力欄の種類は数値
              min="0" // 最小値0
              className={common.input}
              /* stats が存在すれば oRbd を表示し、存在しなければ 0 を表示する */
              value={stats?.oRbd ?? 0}
              /* 値が変わった時の処理 */
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "oRbd",
                  /* 入力された値を数値型に変換してonChangeに渡す */
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className={styles.statsField}>
            DR
            <input
              type="number"
              min="0"
              className={common.input}
              value={stats?.dRbd ?? 0}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "dRbd",
                  Number(e.target.value)
                )
              }
            />
          </label>
        </div>
      </div>

      {/* その他のスタッツ */}
      <div className={styles.statsGroup}>
        <h5 className={styles.statsGroupTitle}>
          その他
        </h5>
        <div className={styles.statsGrid}>
          <label className={styles.statsField}>
            AST
            <input
              type="number"
              min="0"
              className={common.input}
              value={stats?.ast ?? 0}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "ast",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className={styles.statsField}>
            STL
            <input
              type="number"
              min="0"
              className={common.input}
              value={stats?.stl ?? 0}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "stl",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className={styles.statsField}>
            BLK
            <input
              type="number"
              min="0"
              className={common.input}
              value={stats?.blk ?? 0}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "blk",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className={styles.statsField}>
            TO
            <input
              type="number"
              min="0"
              className={common.input}
              value={stats?.tov ?? 0}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "tov",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className={styles.statsField}>
            PF
            <input
              type="number"
              min="0"
              className={common.input}
              value={stats?.pf ?? 0}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "pf",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className={styles.statsField}>
            TF
            <input
              type="number"
              min="0"
              className={common.input}
              value={stats?.tf ?? 0}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "tf",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className={styles.statsField}>
            FO
            <input
              type="number"
              min="0"
              className={common.input}
              value={stats?.fo ?? 0}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "fo",
                  Number(e.target.value)
                )
              }
            />
          </label>
        </div>
      </div>

      {/* 退場 */}
      <div className={styles.statsGroup}>
        <h5 className={styles.statsGroupTitle}>
          退場
        </h5>

        <label className={styles.checkboxField}>
          <input
            type="checkbox"
            className={common.input}
            checked={(stats?.dq ?? 0) === 1}
            onChange={(e) =>
              onChange(
                player.playerId,
                "dq",
                e.target.checked ? 1 : 0
              )
            }
          />
          DQ
        </label>
      </div>
    </div>
  );
}