import type { PlayerStats } from "./types";

/* 1選手分の得点を計算する */
export function calculatePlayerPoints(
  stats: PlayerStats
): number {
  return (
    stats.p3M * 3 +
    stats.p2M * 2 +
    stats.ftM
  );
}