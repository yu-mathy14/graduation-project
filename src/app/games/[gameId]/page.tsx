import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ gameId: string }>;
};

export default async function GameDetailPage({ params }: Props) {
  const { gameId } = await params;
  const id = Number( gameId ); // gameId(文字列)を数値に変換し、idに格納

  // Prismaを使ってGameテーブルから1件取得
  /* 戻り値はオブジェクト */
  const game = await prisma.games.findUnique({
    where: { gameId: id },
    // include：関連するテーブルを一緒に取得する
    include: {
      /* Gamesに紐づいているhomeTeam/awayTeamも取得する */
      homeTeam: true,
      awayTeam: true,
      /* Gamesに紐づくStatsも取得する */
      stats: {
        // include：関連するテーブルを一緒に取得する
        include: {
          /* 各Statsに紐づくplayerも取得する */
          player: true,
        },
      },
    },
  });

  /* 試合が見つからなかった場合、404ページを表示する */
  if (!game) notFound();

  // ホームチームの選手のスタッツだけ取り出す
  const homeStats = game.stats.filter(
    (stat) => stat.player.teamId === game.homeTeamId
  );

  // アウェイチームの選手のスタッツだけ取り出す
  const awayStats = game.stats.filter(
    (stat) => stat.player.teamId === game.awayTeamId
  );
 
  return (
    <div>
      {/* 試合一覧に戻るための遷移リンク */}
      <Link href="/games">
      ←試合一覧に戻る
      </Link>

      {/* 試合情報 */}
      <section>
        <h2>試合情報</h2>
        <table>
          <tbody>
            {/* 対戦日時 */}
            <tr>
              <th>対戦日時</th>
              <td>{game.tipoffTime.toLocaleDateString("ja-JP")}</td>
            </tr>

            {/* スコア
            -> ホームチーム名 点 - 点 アウェイチーム名 */}
            <tr>
              <th>スコア</th>
              <td>
                <div>
                  {game.homeTeam.teamName} {game.homeScore}-{game.awayScore} {game.awayTeam.teamName}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ホームチームスタッツ一覧表 */}
      <section>
        <h2>【{game.homeTeam.teamName}】スタッツ</h2>
        {/* 【三項演算子】ホームチームの選手のスタッツの件数が0件かどうかで表示を切り替える */}
        {homeStats.length === 0 ? (
          <p>スタッツが登録されていません</p>
        ) : (
          /* 1件以上の場合、表として表示 */
          <table>
          {/* 見出しを作る */}
            <thead>
              <tr>
                <th>背番号</th>
                <th>選手名</th>
                <th>pts</th>
                <th>3P(M)</th>
                <th>3P(A)</th>
                <th>3P(%)</th>
                <th>2P(M)</th>
                <th>2P(A)</th>
                <th>2P(%)</th>
                <th>FT(M)</th>
                <th>FT(A)</th>
                <th>FT(%)</th>
                <th>RBD(OR)</th>
                <th>RBD(DR)</th>
                <th>RBD(TOT)</th>
                <th>AST</th>
                <th>STL</th>
                <th>BLK</th>
                <th>TO</th>
                <th>PF</th>
                <th>TF</th>
                <th>FO</th>
                <th>DQ</th>
                <th>試合出場時間</th>
              </tr>
            </thead>

            {/* 1つ1つのデータを作る */}
            <tbody>
              {homeStats.map((gs) => {
              // 計算が必要なものを定数に格納
                // 総得点
                const pts: number = gs.p3M * 3 + gs.p2M * 2 + gs.ftM;

                // 各シュート成功率
                /* 【三項演算子】試行回数が0の時は成功率を0、
                  そうでない場合は M/A で成功率を計算する */
                /* 【Math.round()】小数第二位を四捨五入して整数に
                -> 成功率を小数第一位まで表示 */
                const p3P: number = gs.p3A === 0 ? 0 : Math.round((gs.p3M / gs.p3A) * 1000) / 10;
                const p2P: number = gs.p2A === 0 ? 0 : Math.round((gs.p2M / gs.p2A) * 1000) / 10;
                const ftP: number = gs.ftA === 0 ? 0 : Math.round((gs.ftM / gs.ftA) * 1000) / 10;

                // 総リバウンド数
                const rbd: number = gs.oRbd + gs.dRbd;

                // 試合出場時間
                /* 【Math.floor()】小数部分を切り捨てて整数に
                　-> 「分」を求める */
                const min: number = gs.playSec === 0 ? 0 : Math.floor(gs.playSec / 60);
                /* 60で割ったあまりから「秒」を求める */
                const sec: number = gs.playSec === 0 ? 0 : gs.playSec % 60;

                return (
                  <tr key={gs.playerId}>
                    {/* 背番号 */}
                    <td>{gs.player.jerseyNumber}</td>
                    {/* 選手名(漢字) */}
                    <td>{gs.player.playerNameKanji}</td>

                    {/* 総得点 */}
                    <td>{pts}</td>

                    {/* 3P成功 */}
                    <td>{gs.p3M}</td>
                    {/* 3P試行 */}
                    <td>{gs.p3A}</td>
                    {/* 3P成功率 */}
                    <td>{p3P}%</td>

                    {/* 2P成功 */}
                    <td>{gs.p2M}</td>
                    {/* 2P試行 */}
                    <td>{gs.p2A}</td>
                    {/* 2P成功率 */}
                    <td>{p2P}%</td>

                    {/* FT成功 */}
                    <td>{gs.ftM}</td>
                    {/* FT試行 */}
                    <td>{gs.ftA}</td>
                    {/* FT成功率 */}
                    <td>{ftP}%</td>

                    {/* オフェンスリバウンド数 */}
                    <td>{gs.oRbd}</td>
                    {/* ディフェンスリバウンド数 */}
                    <td>{gs.dRbd}</td>
                    {/* 総リバウンド数 */}
                    <td>{rbd}</td>

                    {/* アシスト数 */}
                    <td>{gs.ast}</td>
                    {/* スティール数 */}
                    <td>{gs.stl}</td>
                    {/* シュートブロック数 */}
                    <td>{gs.blk}</td>
                    {/* ターンオーバー数 */}
                    <td>{gs.tov}</td>
                    {/* 個人ファウル数 */}
                    <td>{gs.pf}</td>
                    {/* テクニカルファウル数 */}
                    <td>{gs.tf}</td>
                    {/* ファウルオン数 */}
                    <td>{gs.fo}</td>
                    {/* 退場フラグ */}
                    <td>{gs.dq}</td>

                    {/* 試合出場時間 */}
                    {gs.playSec === 0 ? (
                      <td>DNP</td>
                    ) : (
                      /* String(sec).padStart(2, "0")
                      -> 秒数が1桁の時も「00」のように2桁で表示する */
                      <td>{min}:{String(sec).padStart(2, "0")}</td>
                    )}
                    

                  </tr>
                );
              })}
              

            </tbody>

          </table>
        )}

        
      </section>

      {/* アウェイチームスタッツ一覧表 */}
      <section>
        <h2>【{game.awayTeam.teamName}】スタッツ</h2>
        {/* 【三項演算子】アウェイチームの選手のスタッツの件数が0件かどうかで表示を切り替える */}
        {awayStats.length === 0 ? (
          <p>スタッツが登録されていません</p>
        ) : (
          /* 1件以上の場合、表として表示 */
          <table>
          {/* 見出しを作る */}
            <thead>
              <tr>
                <th>背番号</th>
                <th>選手名</th>
                <th>pts</th>
                <th>3P(M)</th>
                <th>3P(A)</th>
                <th>3P(%)</th>
                <th>2P(M)</th>
                <th>2P(A)</th>
                <th>2P(%)</th>
                <th>FT(M)</th>
                <th>FT(A)</th>
                <th>FT(%)</th>
                <th>RBD(OR)</th>
                <th>RBD(DR)</th>
                <th>RBD(TOT)</th>
                <th>AST</th>
                <th>STL</th>
                <th>BLK</th>
                <th>TO</th>
                <th>PF</th>
                <th>TF</th>
                <th>FO</th>
                <th>DQ</th>
                <th>試合出場時間</th>
              </tr>
            </thead>

            {/* 1つ1つのデータを作る */}
            <tbody>
              {awayStats.map((gs) => {
              // 計算が必要なものを定数に格納
                // 総得点
                const pts: number = gs.p3M * 3 + gs.p2M * 2 + gs.ftM;

                // 各シュート成功率
                /* 【三項演算子】試行回数が0の時は成功率を0、
                  そうでない場合は M/A で成功率を計算する */
                /* 【Math.round()】小数第二位を四捨五入
                -> 成功率を小数第一位まで表示 */
                const p3P: number = gs.p3A === 0 ? 0 : Math.round((gs.p3M / gs.p3A) * 1000) / 10;
                const p2P: number = gs.p2A === 0 ? 0 : Math.round((gs.p2M / gs.p2A) * 1000) / 10;
                const ftP: number = gs.ftA === 0 ? 0 : Math.round((gs.ftM / gs.ftA) * 1000) / 10;

                // 総リバウンド数
                const rbd: number = gs.oRbd + gs.dRbd;

                // 試合出場時間
                /* 【Math.floor()】小数部分を切り捨てて整数に
                　-> 「分」を求める */
                const min: number = gs.playSec === 0 ? 0 : Math.floor(gs.playSec / 60);
                /* 60で割ったあまりから「秒」を求める */
                const sec: number = gs.playSec === 0 ? 0 : gs.playSec % 60;
                
                return(
                  <tr key={gs.playerId}>
                    {/* 背番号 */}
                    <td>{gs.player.jerseyNumber}</td>
                    {/* 選手名(漢字) */}
                    <td>{gs.player.playerNameKanji}</td>

                    {/* 総得点 */}
                    <td>{pts}</td>

                    {/* 3P成功 */}
                    <td>{gs.p3M}</td>
                    {/* 3P試行 */}
                    <td>{gs.p3A}</td>
                    {/* 3P成功率 */}
                    <td>{p3P}%</td>

                    {/* 2P成功 */}
                    <td>{gs.p2M}</td>
                    {/* 2P試行 */}
                    <td>{gs.p2A}</td>
                    {/* 2P成功率 */}
                    <td>{p2P}%</td>

                    {/* FT成功 */}
                    <td>{gs.ftM}</td>
                    {/* FT試行 */}
                    <td>{gs.ftA}</td>
                    {/* FT成功率 */}
                    <td>{ftP}%</td>

                    {/* オフェンスリバウンド数 */}
                    <td>{gs.oRbd}</td>
                    {/* ディフェンスリバウンド数 */}
                    <td>{gs.dRbd}</td>
                    {/* 総リバウンド数 */}
                    <td>{rbd}</td>

                    {/* アシスト数 */}
                    <td>{gs.ast}</td>
                    {/* スティール数 */}
                    <td>{gs.stl}</td>
                    {/* シュートブロック数 */}
                    <td>{gs.blk}</td>
                    {/* ターンオーバー数 */}
                    <td>{gs.tov}</td>
                    {/* 個人ファウル数 */}
                    <td>{gs.pf}</td>
                    {/* テクニカルファウル数 */}
                    <td>{gs.tf}</td>
                    {/* ファウルオン数 */}
                    <td>{gs.fo}</td>
                    {/* 退場フラグ */}
                    <td>{gs.dq}</td>

                    {/* 試合出場時間 */}
                    {gs.playSec === 0 ? (
                      <td>DNP</td>
                    ) : (
                      /* String(sec).padStart(2, "0")
                      -> 秒数が1桁の時も「00」のように2桁で表示する */
                      <td>{min}:{String(sec).padStart(2, "0")}</td>
                    )}

                  </tr>
                );
              })}
              

            </tbody>

          </table>
        )}

        
      </section>

    </div>
  );
}