// 1人分のスタッツ入力を表示・管理するコンポーネント
// ===========================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

/* 型の読み込み */
import type { Player, PlayerStats } from "../types";

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
    <div>
      <h4>
        #{player.jerseyNumber} {player.playerNameKanji}
      </h4>

      {/* シュート系 */}
      <div>
        <h5>シュート</h5>

        <label>
          3P試投
          <input
            type="number" // 入力欄の種類は数値
            min="0" // 最小値0
            /* stats が存在すれば p3A を表示し、存在しなければ 0 を表示する */
            value={stats?.p3A ?? 0}
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
        </label>

        <label>
          3P成功
          <input
            type="number"
            min="0"
            value={stats?.p3M ?? 0}
            onChange={(e) =>
              onChange(
                player.playerId,
                "p3M",
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          2P試投
          <input
            type="number"
            min="0"
            value={stats?.p2A ?? 0}
            onChange={(e) =>
              onChange(
                player.playerId,
                "p2A",
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          2P成功
          <input
            type="number"
            min="0"
            value={stats?.p2M ?? 0}
            onChange={(e) =>
              onChange(
                player.playerId,
                "p2M",
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          FT試投
          <input
            type="number"
            min="0"
            value={stats?.ftA ?? 0}
            onChange={(e) =>
              onChange(
                player.playerId,
                "ftA",
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          FT成功
          <input
            type="number"
            min="0"
            value={stats?.ftM ?? 0}
            onChange={(e) =>
              onChange(
                player.playerId,
                "ftM",
                Number(e.target.value)
              )
            }
          />
        </label>
      </div>

      {/* リバウンド */}
      <div>
        <h5>リバウンド</h5>

        <label>
          OR
          <input
            type="number"
            min="0"
            value={stats?.oRbd ?? 0}
            onChange={(e) =>
              onChange(
                player.playerId,
                "oRbd",
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          DR
          <input
            type="number"
            min="0"
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

      {/* その他のスタッツ */}
      <div>
        <h5>その他</h5>

        <label>
          AST
          <input
            type="number"
            min="0"
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

        <label>
          STL
          <input
            type="number"
            min="0"
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

        <label>
          BLK
          <input
            type="number"
            min="0"
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

        <label>
          TOV
          <input
            type="number"
            min="0"
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

        <label>
          PF
          <input
            type="number"
            min="0"
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

        <label>
          TF
          <input
            type="number"
            min="0"
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

        <label>
          FO
          <input
            type="number"
            min="0"
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

      {/* 退場 */}
      <div>
        <h5>退場</h5>

        <label>
          <input
            type="checkbox"
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

      {/* 出場時間 */}
      <div>
        <h5>出場時間</h5>

        <label>
          出場時間（秒）
          <input
            type="number"
            min="0"
            value={stats?.playSec ?? 0}
            onChange={(e) =>
              onChange(
                player.playerId,
                "playSec",
                Number(e.target.value)
              )
            }
          />
        </label>
      </div>
    </div>
  );
}