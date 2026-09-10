// 出場選手の選択を管理するコンポーネント
/*  */
// ===========================================

/* このコンポーネントはブラウザ上(クライアントサイド)で実行されることを明示 */
"use client";

/* 型の読み込み */
import type { Player } from "../types";

/* PlayerSelectが受け取るPropsの型定義 */
type Props = {
  /* 複数の選手オブジェクトを格納した配列 */
  players: Player[];
  /* 選択されている選手のIDを格納した配列 */
  selectedPlayerIds: number[];
  /* 選択された選手のIDを受け取る関数 */
  onChange: (
    playerId: number
  ) => void; // 戻り値なし
};

/* 選手一覧を表示し、出場選手の選択を管理する関数 */
export default function PlayerSelect({
  players,
  selectedPlayerIds,
  onChange,
}: Props) {
  return (
    <div>
      {players.map((player) => (
        <label key={player.playerId}>
          <input
            type="checkbox" // 入力欄はチェックボックス
            /* 入力欄が持つ値：選手IDを設定する */
            value={player.playerId}
            /* チェック状態：trueならチェックされる
            selectedPlayerIdsの中に、この選手のIDが含まれているか */
            checked={selectedPlayerIds.includes(player.playerId)}
            /* チェック状態が変化した時の処理
            -> チェック状態が変化した選手のIDを親に伝える */
            onChange={() => onChange(player.playerId)}
          />
          #{player.jerseyNumber} {player.playerNameKanji}
        </label>
      ))}

      {/* 選択されている選手のIDを格納した配列の要素数 */}
      <p>選択人数：{selectedPlayerIds.length}人</p>
    </div>
  );
}