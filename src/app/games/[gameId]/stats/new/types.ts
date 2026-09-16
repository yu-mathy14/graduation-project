// 複数のコンポーネントが使う型は共通ファイルに切り出す

/* 1選手分のオブジェクトの型定義 */
export type Player = {
  playerId: number;
  playerNameKanji: string;
  jerseyNumber: number;
};

/* 1選手分のスタッツの型定義 */
export type PlayerStats = {
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
};