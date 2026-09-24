// スタッツ編集画面全体を管理するコンポーネント
// ===========================================

"use client";

import { useState } from "react";
import Link from "next/link";

/* 型の読み込み */
import type { PlayerStats, StatsError } from "../../types";

/* コンポーネントの読み込み */
import StatsEditTable from "./StatsEditTable";

/* 関数の読み込み */
import { updateStats } from "../actions";

/* Yupスキーマの読み込み */
import { playerStatsSchema } from "../../schema";
import * as yup from "yup";

/* CSSファイルの読み込み */
import common from "@/app/common.module.css";
import styles from "../../stats.module.css"

/* 得点計算関数の読み込み */
import { calculatePlayerPoints } from "../../utils";

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
  teamScore: number;
};

/* スタッツ編集画面全体の状態と処理を管理する関数 */
export default function StatsEditForm({
  gameId, 
  stats,
  teamScore,
}: Props) {
/* 状態を管理するuseState値 */
  /* 編集中のスタッツを管理 */
  const [editStats, setEditStats] = useState<EditStat[]>(stats);

  /* Yup検証/試合出場時間・最終スコアチェックで発生したエラーメッセージを配列で管理 */
  const [statsErrors, setStatsErrors] = useState<StatsError[]>([]);

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

    /* 前回のバリデーションエラーをクリアする */
    setStatsErrors([]);

    /* エラー情報を一時的に格納する配列 */
    const errors: StatsError[] = [];

    /* 編集した全選手のスタッツを1人ずつ検証 */
    /* playerId → 現在検証している選手のID
       stats → 現在検証している選手のスタッツ */
    for (const { playerId, stats } of statsData) {
      /* playerIdに一致する選手情報をeditStatsから取得 */
      const player = editStats.find(
        (stat) => stat.playerId === playerId
      );

      try {
        /* 1選手分のスタッツをYupで検証 */
        await playerStatsSchema.validate(stats, {
          /* 【abortEarly】バリデーションエラーが発生した際に、最初のエラーで検証を終了するかを指定
            true：最初のエラーが発生した時点で検証を終了
            false：検証を続け、すべてのエラーを取得 */
          /* 【await】Yupの検証処理が完了するまで次の処理に進まないようにする */
          /* 現在の選手のスタッツをplayerStatsSchemaに渡して、Yupで検証 */
          /* 1つのエラーで検証を終了せず、すべてのエラーを取得 */
          abortEarly: false,
        });
      } catch (error) {
        /* Yup検証失敗時、発生したerrorがYupのValidationErrorかどうかを確認
        -> 今回のようなYupによる検証エラーならこの条件はtrueになる */
        if (error instanceof yup.ValidationError && player) {
          /* 発生したすべてのエラー情報を配列へ追加 */
          error.errors.forEach((message) => {
            errors.push({
              playerId,
              jerseyNumber: player.player.jerseyNumber,
              playerNameKanji: player.player.playerNameKanji,
              message,
            });
          });
        }
      }
    }

    /* 各選手の試合出場時間を合計する */
    const totalPlaySec = statsData.reduce(
      (total, { stats }) => total + stats.playSec,
      0
    );

    /* 出場時間エラーを追加 */
    if (totalPlaySec !== 12000) {
      errors.push({
        message:
          "所属選手全員の試合出場時間の合計が12,000秒になるように入力してください",
      });
    }

    /* 各選手の得点を合計する */
    const totalPoints = statsData.reduce(
      (total, { stats }) =>
        total + calculatePlayerPoints(stats),
      0
    );

    /* 得点エラーを追加 */
    if (totalPoints !== teamScore) {
      errors.push({
        message:
          "選手スタッツの得点合計と試合の最終スコアが一致するように入力してください",
      });
    }


    /* エラーが1件以上ある場合 */
    if (errors.length > 0) {
      /* 取得したすべてのエラーメッセージをstateに保存 */
      setStatsErrors(errors);
      return;
    }

    /* すべての選手の検証に成功した場合のみServer Actionを実行 */
    try {
      await updateStats(gameId, statsData);
    } catch (error) {
      /* Server Action側で発生したエラーを画面に表示 */
      if (error instanceof Error) {
        setStatsErrors([
          {
            message: error.message,
          },
        ]);
      }
    }
  };
  
  return (
    <>
      {/* エラーがある場合、エラーメッセージを一覧表示 */}
      {statsErrors.length > 0 && (
        <div>
          {statsErrors.map((error, index) => (
            /* インデックス番号でエラーを一意に識別 */
            <p
              key={index}
              className={common.error}
            >
              {error.playerId !== undefined &&
                `背番号${error.jerseyNumber} ${error.playerNameKanji}：`}
              {error.message}
            </p>
          ))}
        </div>
      )}

      <StatsEditTable
        /* これは属性ではなくProps */
        stats={editStats}
        onChange={handleStatsChange}
      />

      <div className={styles.navigation}>
        <button
          type="button"
          className={common.button}
          onClick={handleSubmit}
        >
          変更を保存
        </button>
        
        <Link
          href={`/games/${gameId}`}
          className={common.buttonCancel}
        >
          キャンセル
        </Link>

      </div>
    </>
    
  );
}