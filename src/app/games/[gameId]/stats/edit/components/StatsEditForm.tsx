// スタッツ編集画面全体を管理するコンポーネント
// ===========================================

"use client";

import { useState } from "react";

/* 型の読み込み */
import type { PlayerStats } from "../../new/types";

/* コンポーネントの読み込み */
import StatsEditTable from "./StatsEditTable";

/* 関数の読み込み */
import { updateStats } from "../actions";

/* 型の結合【インターセクション】 */
/* 編集したスタッツと選手情報を1つのオブジェクトでまとめて管理 */
type EditStat = PlayerStats & {
  playerId: number;
  player: {
    playerNameKanji: string;
    jerseyNumber: number;
  };
};

/* StatsEditFormが受け取るPropsの型定義 */
type Props = {
  gameId: number;
  /* 編集済みのスタッツオブジェクトを格納した配列 */
  stats: EditStat[];
};

/* スタッツ編集画面全体の状態と処理を管理する関数 */
export default function StatsEditForm({
  gameId, 
  stats,
}: Props) {
/* 状態を管理するuseState値 */
  /* 編集中のスタッツを管理 */
  const [editStats, setEditStats] = useState<EditStat[]>(stats);

/* イベントハンドラー */
  /* 指定した選手の指定したスタッツを変更する */
  const handleStatsChange = (
    playerId: number,
    field: keyof PlayerStats, // 変更するスタッツの項目名
    value: number
  ) => {
    /* 選手ごとのスタッツを更新する */
    setEditStats((currentStats) =>
      currentStats.map((stat) =>
        /* 【三項演算子】スタッツのplayerIdと受け取ったplayerIdが一致するかどうか */
        stat.playerId === playerId
          ? {
              /* 現在のスタッツをコピー */
              ...stat,
              /* 更新するスタッツ項目の対象(キー)を
              受け取ったfieldで指定 */
              /* 受け取った値(value)を、指定したスタッツ項目に設定 */
              [field]: value,
            }
          /* 一致しない場合は現在のスタッツのまま返す */
          : stat
      )
    );
  };

  /* 編集したスタッツをDBへ登録する */
  const handleSubmit = async () => {
    /* DBへ渡す形式に編集データを変換する */
    const statsData = editStats.map(({ playerId, player, ...stats }) => ({
      playerId,
      stats,
    }));

    /* 非同期のupdateStats()関数を実行 */
    await updateStats(gameId, statsData);
  };

  return (
    <>
      <StatsEditTable
        /* これは属性ではなくProps */
        stats={editStats}
        onChange={handleStatsChange}
      />

      {/*  */}
      <button
        /* これは属性 */
        type="button"
        onClick={handleSubmit}
      >
        変更を保存
      </button>
    </>
    
  );
}