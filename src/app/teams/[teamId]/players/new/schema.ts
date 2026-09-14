/* yupライブラリのすべてのエクスポートをまとめて
yupという名前のオブジェクトとして読み込む */
/* import * as ...
-> モジュールの全エクスポートをまとめて1つの名前空間オブジェクトにする */
import * as yup from "yup";

/* どんなフォームにするのかを型で設計 */
export type PlayerFormValues = {
  playerNameKanji: string;
  playerNameKana: string;
  jerseyNumber: string;
  almaMater: string;
  height?: string;
  weight?: string;
};

// 検証ルールを準備
/* yup.object関数の中にオブジェクトを入れていく */
/* PlayerFormValuesの中に入る値の検証ルール */
export const playerSchema = yup.object({
  playerNameKanji: yup
    .string() // データ型：文字列
    .label("氏名(漢字)") // フィールドの日本語名
  // 以下、検証ルール
    .required("${label}は必須入力です。") // 必須入力指定
    /* 最大文字数
    ：第一引数は最大文字数、第二引数はエラーメッセージ */
    .max(30, "${label}は${max}文字以内で入力してください。"),

  playerNameKana: yup
    .string() // データ型：文字列
    .label("氏名(かな)") // フィールドの日本語名
  // 以下、検証ルール
    .required("${label}は必須入力です。") // 必須入力指定
    /* 最大文字数
    ：第一引数は最大文字数、第二引数はエラーメッセージ */
    .max(30, "${label}は${max}文字以内で入力してください。"),

  jerseyNumber: yup
    .string() // データ型：文字列
    .label("背番号") // フィールドの日本語名
  // 以下、検証ルール
    .required("${label}は必須入力です。") // 必須入力指定
    /* 正規表現に一致するか
    ：第一引数は照合する正規表現、第二引数はエラーメッセージ */
    .matches(
    /* 【/.../】正規表現リテラル(JSなどで使う書き方)
       【^】 文字列の先頭
       {【[1-9]】文字クラス(1〜9のいずれか1文字),
        【\d】数字1文字,
        【*】直前のパターンを0回以上繰り返す
       　->【[1-9]\d*】最初の1文字は1~9、その後0~9を0回以上}
       【$】文字列の末尾*/
    /^[1-9]\d*$/,
    "${label}は1以上の整数で入力してください。"
    ),

  almaMater: yup
    .string() // データ型：文字列
    .label("出身校") // フィールドの日本語名
  // 以下、検証ルール
    .required("${label}は必須入力です。") // 必須入力指定
    /* 最大文字数
    ：第一引数は最大文字数、第二引数はエラーメッセージ */
    .max(30, "${label}は${max}文字以内で入力してください。"),

  height: yup
    .string() // データ型：文字列
    .label("身長") // フィールドの日本語名
  // 以下、検証ルール
    /* 【test】独自の検証ルールの実装
    ：値が入力されている場合、整数かつ50より大きいことを検証 */
    .test(
      /* 第一引数：独自バリデーションにつける名前 */
      "height",
      /* 第二引数：検証失敗時のエラーメッセージ */
      "${label}は51cm以上の整数で入力してください。",
      /* 第三引数：Yupから検証対象の値をvalueで受け取る */
      (value) => {
        /* 受け取った値がfalsyならtrueを返す
        -> 値未入力時はエラーにしない */
        if (!value) return true;

        /* 受け取った入力値を数値型に変換して定数に格納 */
        const number = Number(value);
        /* 【Number.isInteger()】整数かどうかを調べる */
        /* 入力値が整数かつ3より大きい時、合格判定 */
        return Number.isInteger(number) && number > 50;
      }
    ),


  weight: yup
    .string() // データ型：文字列
    .label("体重") // フィールドの日本語名
  // 以下、検証ルール
    /* 【test】独自の検証ルールの実装
    ：値が入力されている場合、整数かつ3より大きいことを検証 */
    .test(
      /* 第一引数：独自バリデーションにつける名前 */
      "weight",
      /* 第二引数：検証失敗時のエラーメッセージ */
      "${label}は4kg以上の整数で入力してください。",
      /* 第三引数：Yupから検証対象の値をvalueで受け取る */
      (value) => {
        /* 受け取った値がfalsyならtrueを返す
        -> 値未入力時はエラーにしない */
        if (!value) return true;

        /* 受け取った入力値を数値型に変換して定数に格納 */
        const number = Number(value);
        /* 【Number.isInteger()】整数かどうかを調べる */
        /* 入力値が整数かつ3より大きい時、合格判定 */
        return Number.isInteger(number) && number > 3;
      }
    ),

});
