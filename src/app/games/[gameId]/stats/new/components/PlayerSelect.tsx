// 出場選手の選択を管理するコンポーネント
/*  */
// ===========================================

"use client";

type Player = {
  playerId: number;
  playerNameKanji: string;
  jerseyNumber: number;
};

type Props = {
  players: Player[];
  selectedPlayerIds: number[];
  onChange: (playerId: number) => void;
};

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
            type="checkbox"
            value={player.playerId}
            checked={selectedPlayerIds.includes(player.playerId)}
            onChange={() => onChange(player.playerId)}
          />
          #{player.jerseyNumber} {player.playerNameKanji}
        </label>
      ))}

      <p>選択人数：{selectedPlayerIds.length}人</p>
    </div>
  );
}