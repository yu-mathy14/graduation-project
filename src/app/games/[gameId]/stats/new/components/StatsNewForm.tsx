// 登録画面全体の状態・ステップを管理するコンポーネント
/*  */
// ===========================================

"use client";

import { useState } from "react";
import { PlayerStats } from "../types";
import PlayerStatsInput from "./PlayerStatsInput";

type Player = {
  playerId: number;
  playerNameKanji: string;
  jerseyNumber: number;
};

type Props = {
  homeTeamName: string;
  homePlayers: Player[];
};

export default function StatsNewForm({
  homeTeamName,
  homePlayers,
}: Props) {
  // 現在どのステップを表示しているか
  const [step, setStep] = useState(1);

  // 出場選手のID
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  // 選手ごとのスタッツ
  const [playerStats, setPlayerStats] = useState<
    Record<number, PlayerStats>
  >({});

  // 出場選手のチェックを変更する
  const handlePlayerChange = (playerId: number) => {
    setSelectedPlayerIds((currentIds) => {
      if (currentIds.includes(playerId)) {
        return currentIds.filter((id) => id !== playerId);
      }

      return [...currentIds, playerId];
    });
  };

  // スタッツを変更する
  const handleStatsChange = (
    playerId: number,
    field: keyof PlayerStats,
    value: number
  ) => {
    setPlayerStats((currentStats) => ({
      ...currentStats,
      [playerId]: {
        ...currentStats[playerId],
        [field]: value,
      },
    }));
  };

  return (
    <section>
      {/* ステップ1：出場選手選択 */}
      {step === 1 && (
        <>
          <h3>ホームチーム【{homeTeamName}】</h3>

          <p>出場選手を選択してください</p>

          {homePlayers.map((player) => (
            <label key={player.playerId}>
              <input
                type="checkbox"
                value={player.playerId}
                checked={selectedPlayerIds.includes(player.playerId)}
                onChange={() => handlePlayerChange(player.playerId)}
              />
              #{player.jerseyNumber} {player.playerNameKanji}
            </label>
          ))}

          <p>選択人数：{selectedPlayerIds.length}人</p>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={selectedPlayerIds.length === 0}
          >
            次へ
          </button>
        </>
      )}

      {/* ステップ2：スタッツ入力 */}
      {step === 2 && (
        <>
          <h3>ホームチーム【{homeTeamName}】のスタッツ</h3>

          {homePlayers
            .filter((player) =>
              selectedPlayerIds.includes(player.playerId)
            )
            .map((player) => (
              <PlayerStatsInput
                key={player.playerId}
                player={player}
                stats={playerStats[player.playerId]}
                onChange={handleStatsChange}
              />
            ))}

          <button type="button" onClick={() => setStep(1)}>
            戻る
          </button>

          <button type="button" onClick={() => console.log(playerStats)}>
            確認
          </button>
        </>
      )}
    </section>
  );
}