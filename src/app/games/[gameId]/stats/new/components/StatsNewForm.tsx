// 登録画面全体の状態・ステップを管理するコンポーネント
/*  */
// ===========================================

"use client";

import { useState } from "react";
import { PlayerStats } from "../types";
import PlayerStatsInput from "./PlayerStatsInput";
import PlayerSelect from "./PlayerSelect";

type Player = {
  playerId: number;
  playerNameKanji: string;
  jerseyNumber: number;
};

type Props = {
  homeTeamName: string;
  homePlayers: Player[];
  awayTeamName: string;
  awayPlayers: Player[];
};

export default function StatsNewForm({
  homeTeamName,
  homePlayers,
  awayTeamName,
  awayPlayers,
}: Props) {
  // 現在どのステップを表示しているか
  const [step, setStep] = useState(1);

  // 出場選手のID
  // ホームチーム
  const [selectedHomePlayerIds, setSelectedHomePlayerIds] = useState<
    number[]
  >([]);
  // アウェイチーム
  const [selectedAwayPlayerIds, setSelectedAwayPlayerIds] = useState<
    number[]
  >([]);

  // 選手ごとのスタッツ
  const [playerStats, setPlayerStats] = useState<
    Record<number, PlayerStats>
  >({});

  // 出場選手のチェックを変更する
  // ホームチーム
  const handleHomePlayerChange = (playerId: number) => {
    setSelectedHomePlayerIds((currentIds) => {
      if (currentIds.includes(playerId)) {
        return currentIds.filter((id) => id !== playerId);
      }

      return [...currentIds, playerId];
    });
  };
  // アウェイチーム
  const handleAwayPlayerChange = (playerId: number) => {
    setSelectedAwayPlayerIds((currentIds) => {
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

          <PlayerSelect
            players={homePlayers}
            selectedPlayerIds={selectedHomePlayerIds}
            onChange={handleHomePlayerChange}
          />

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={selectedHomePlayerIds.length === 0}
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
              selectedHomePlayerIds.includes(player.playerId)
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

          <button type="button" onClick={() => setStep(3)}>
            次へ
          </button>
        </>
      )}

      {/* ステップ3：アウェイチームの出場選手選択 */}
      {step === 3 && (
        <>
          <h3>アウェイチーム【{awayTeamName}】</h3>

          <p>出場選手を選択してください</p>

          <PlayerSelect
            players={awayPlayers}
            selectedPlayerIds={selectedAwayPlayerIds}
            onChange={handleAwayPlayerChange}
          />

          <button type="button" onClick={() => setStep(2)}>
            ホームに戻る
          </button>

          <button
            type="button"
            onClick={() => setStep(4)}
            disabled={selectedAwayPlayerIds.length === 0}
          >
            次へ
          </button>
        </>
      )}

      {/* ステップ4：アウェイチームのスタッツ入力 */}
      {step === 4 && (
        <>
          <h3>アウェイチーム【{awayTeamName}】のスタッツ</h3>

          {awayPlayers
            .filter((player) =>
              selectedAwayPlayerIds.includes(player.playerId)
            )
            .map((player) => (
              <PlayerStatsInput
                key={player.playerId}
                player={player}
                stats={playerStats[player.playerId]}
                onChange={handleStatsChange}
              />
            ))}

          <button type="button" onClick={() => setStep(3)}>
            戻る
          </button>
        </>
      )}
    </section>
  );
}