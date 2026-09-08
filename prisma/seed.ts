import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/* main() -> DBを初期状態にするための一連の処理をまとめた関数 */
/* 【async】∴ 非同期処理をawaitできるようになる */
async function main() {
  /* 既存のデータを全て削除する */
  /* FK有のため、子テーブル→親テーブルの順に削除する必要あり */
  await prisma.stats.deleteMany();
  await prisma.games.deleteMany();
  await prisma.players.deleteMany();
  await prisma.teams.deleteMany();

// 各テーブルの初期値の作成=========================================
  /* 1. チーム */
  const shohoku = await prisma.teams.create({
    data: {
        teamName: '湘北高校',
        teamColor: '#E60012',
    },
  });

  const ryonan = await prisma.teams.create({
    data: {
        teamName: '陵南高校',
        teamColor: '#1E3A8A',
    },
  });

  const shoyo = await prisma.teams.create({
    data: {
        teamName: '翔陽高校',
        teamColor: '#15803D',
    },
  });

  const kainan = await prisma.teams.create({
    data: {
        teamName: '海南大付属高校',
        teamColor: '#552583',
    },
  });

  const toyotama = await prisma.teams.create({
    data: {
        teamName: '豊玉高校',
        teamColor: '#0077C0',
    },
  });

  const sannoh = await prisma.teams.create({
    data: {
        teamName: '山王高校',
        teamColor: '#FFFFFF',
    },
  });

  /* 2. 選手 */
  // 1 湘北高校 ------------------------------
  const akagi = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '赤木剛憲',
      playerNameKana: 'あかぎ　たけのり',
      jerseyNumber: 4,
      height: 197,
      weight: 93,
    },
  });

  const kogure = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '木暮公延',
      playerNameKana: 'こぐれ　きみのぶ',
      jerseyNumber: 5,
      height: 178,
      weight: 62,
    },
  });

  const miyagi = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '宮城リョータ',
      playerNameKana: 'みやぎ　りょうた',
      jerseyNumber: 7,
      height: 168,
      weight: 59,
    },
  });

  const sakuragi = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '桜木花道',
      playerNameKana: 'さくらぎ　はなみち',
      jerseyNumber: 10,
      height: 188,
      weight: 83,
    },
  });

  const rukawa = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '流川楓',
      playerNameKana: 'るかわ　かえで',
      jerseyNumber: 11,
      height: 187,
      weight: 75,
    },
  });

  const mitsui = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '三井寿',
      playerNameKana: 'みつい　ひさし',
      jerseyNumber: 14,
      height: 184,
      weight: 70,
    },
  });

  const yasuda = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '安田靖春',
      playerNameKana: 'やすだ　やすはる',
      jerseyNumber: 6,
      height: 165,
      weight: 57,
    },
  });

  const shiozaki = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '潮崎哲士',
      playerNameKana: 'しおざき　てつし',
      jerseyNumber: 8,
      height: 170,
      weight: 60,
    },
  });

  const kakuta = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '角田悟',
      playerNameKana: 'かくた　さとる',
      jerseyNumber: 9,
      height: 180,
      weight: 70,
    },
  });

  const ishii = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '石井健太郎',
      playerNameKana: 'いしい　けんたろう',
      jerseyNumber: 12,
      height: 170,
      weight: 65,
    },
  });

  const sasaoka = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,
      playerNameKanji: '佐々岡智',
      playerNameKana: 'ささおか　さとる',
      jerseyNumber: 13,
      height: 175,
      weight: 65,
    },
  });

  const kuwata = await prisma.players.create({
    data: {
      teamId: shohoku.teamId,    
      playerNameKanji: '桑田登紀',
      playerNameKana: 'くわた　とき',
      jerseyNumber: 15,
      height: 165,
      weight: 55,
    },
  });

  // 2 陵南高校 -------------------------------
  const uozumi = await prisma.players.create({
    data: {
      teamId: ryonan.teamId,
      playerNameKanji: '魚住純',
      playerNameKana: 'うおずみ　じゅん',
      jerseyNumber: 4,
      height: 202,
      weight: 90,
    },
  });

  const ikegami = await prisma.players.create({
    data: {
      teamId: ryonan.teamId,
      playerNameKanji: '池上亮二',
      playerNameKana: 'いけがみ　りょうじ',
      jerseyNumber: 5,
      height: 183,
      weight: 83,
    },
  });

  const koshino = await prisma.players.create({
    data: {
      teamId: ryonan.teamId,
      playerNameKanji: '越野宏明',
      playerNameKana: 'こしの　ひろあき',
      jerseyNumber: 6,
      height: 174,
      weight: 62,
    },
  });

  const sendo = await prisma.players.create({
    data: {
      teamId: ryonan.teamId,
      playerNameKanji: '仙道彰',
      playerNameKana: 'せんどう　あきら',
      jerseyNumber: 7,
      height: 190,
      weight: 79,
    },
  });

  const uekusa = await prisma.players.create({
    data: {
      teamId: ryonan.teamId,
      playerNameKanji: '植草智之',
      playerNameKana: 'うえくさ　ともゆき',
      jerseyNumber: 8,
      height: 170,
      weight: 62,
    },
  });

  const fukuda = await prisma.players.create({
    data: {
      teamId: ryonan.teamId,
      playerNameKanji: '福田吉兆',
      playerNameKana: 'ふくだ　きっちょう',
      jerseyNumber: 13,
      height: 188,
      weight: 80,
    },
  });

  const sugadaira = await prisma.players.create({
    data: {
      teamId: ryonan.teamId,
      playerNameKanji: '菅平',
      playerNameKana: 'すがだいら',
      jerseyNumber: 11,
      height: 188,
      weight: 78,
    },
  });

  // 3 翔陽高校 -------------------------------
  const fujima = await prisma.players.create({
    data: {
      teamId: shoyo.teamId,
      playerNameKanji: '藤真健司',
      playerNameKana: 'ふじま　けんじ',
      jerseyNumber: 4,
      height: 178,
      weight: 66,
    },
  });

  const hanagata = await prisma.players.create({
    data: {
      teamId: shoyo.teamId,
      playerNameKanji: '花形透',
      playerNameKana: 'はながた　とおる',
      jerseyNumber: 5,
      height: 197,
      weight: 83,
    },
  });

  const hasegawa = await prisma.players.create({
    data: {
      teamId: shoyo.teamId,
      playerNameKanji: '長谷川一志',
      playerNameKana: 'はせがわ　かずし',
      jerseyNumber: 6,
      height: 190,
      weight: 81,
    },
  });

  const nagano = await prisma.players.create({
    data: {
      teamId: shoyo.teamId,
      playerNameKanji: '永野満',
      playerNameKana: 'ながの　みつる',
      jerseyNumber: 7,
      height: 191,
      weight: 84,
    },
  });

  const takano = await prisma.players.create({
    data: {
      teamId: shoyo.teamId,
      playerNameKanji: '高野昭一',
      playerNameKana: 'たかの　しょういち',
      jerseyNumber: 8,
      height: 193,
      weight: 85,
    },
  });

  const ito = await prisma.players.create({
    data: {
      teamId: shoyo.teamId,
      playerNameKanji: '伊藤卓',
      playerNameKana: 'いとう　たく',
      jerseyNumber: 9,
      height: 180,
      weight: 70,
    },
  });

  // 4 海南高校 -----------------------------
  const maki = await prisma.players.create({
    data: {
      teamId: kainan.teamId,
      playerNameKanji: '牧紳一',
      playerNameKana: 'まき　しんいち',
      jerseyNumber: 4,
      height: 184,
      weight: 79,
    },
  });

  const takasago = await prisma.players.create({
    data: {
      teamId: kainan.teamId,
      playerNameKanji: '高砂一馬',
      playerNameKana: 'たかさご　かずま',
      jerseyNumber: 5,
      height: 191,
      weight: 80,
    },
  });

  const jin = await prisma.players.create({
    data: {
      teamId: kainan.teamId,
      playerNameKanji: '神宗一郎',
      playerNameKana: 'じん　そういちろう',
      jerseyNumber: 6,
      height: 189,
      weight: 71,
    },
  });

  const muto = await prisma.players.create({
    data: {
      teamId: kainan.teamId,
      playerNameKanji: '武藤正',
      playerNameKana: 'むとう　ただし',
      jerseyNumber: 9,
      height: 184,
      weight: 75,
    },
  });

  const kiyota = await prisma.players.create({
    data: {
      teamId: kainan.teamId,
      playerNameKanji: '清田信長',
      playerNameKana: 'きよた　のぶなが',
      jerseyNumber: 10,
      height: 178,
      weight: 65,
    },
  });

  const miyamasu = await prisma.players.create({
    data: {
      teamId: kainan.teamId,
      playerNameKanji: '宮益義範',
      playerNameKana: 'みやます　よしのり',
      jerseyNumber: 15,
      height: 160,
      weight: 42,
    },
  });

  // 5 豊玉高校 -------------------------------
  const minami = await prisma.players.create({
    data: {
      teamId: toyotama.teamId,
      playerNameKanji: '南烈',
      playerNameKana: 'みなみ　つよし',
      jerseyNumber: 4,
      height: 184,
      weight: 73,
    },
  });

  const kishimoto = await prisma.players.create({
    data: {
      teamId: toyotama.teamId,
      playerNameKanji: '岸本実理',
      playerNameKana: 'きしもと　みのり',
      jerseyNumber: 5,
      height: 188,
      weight: 80,
    },
  });

  const itakura = await prisma.players.create({
    data: {
      teamId: toyotama.teamId,
      playerNameKanji: '板倉大二朗',
      playerNameKana: 'いたくら　だいじろう',
      jerseyNumber: 6,
      height: 183,
      weight: 70,
    },
  });

  const yajima = await prisma.players.create({
    data: {
      teamId: toyotama.teamId,
      playerNameKanji: '矢嶋京平',
      playerNameKana: 'やじま　きょうへい',
      jerseyNumber: 7,
      height: 180,
      weight: 70,
    },
  });

  const iwata = await prisma.players.create({
    data: {
      teamId: toyotama.teamId,
      playerNameKanji: '岩田三秋',
      playerNameKana: 'いわた　みつあき',
      jerseyNumber: 8,
      height: 190,
      weight: 80,
    },
  });

  const okawa = await prisma.players.create({
    data: {
      teamId: toyotama.teamId,
      playerNameKanji: '大川輝男',
      playerNameKana: 'おおかわ　てるお',
      jerseyNumber: 14,
      height: 180,
      weight: 70,
    },
  });

  // 6 山王工業高校 -----------------------------
  const fukatsu = await prisma.players.create({
    data: {
      teamId: sannoh.teamId,
      playerNameKanji: '深津一成',
      playerNameKana: 'ふかつ　かずなり',
      jerseyNumber: 4,
      height: 180,
      weight: 70,
    },
  });

  const nobe = await prisma.players.create({
    data: {
      teamId: sannoh.teamId,
      playerNameKanji: '野辺将広',
      playerNameKana: 'のべ　まさひろ',
      jerseyNumber: 5,
      height: 198,
      weight: 90,
    },
  });

  const matsumoto = await prisma.players.create({
    data: {
      teamId: sannoh.teamId,
      playerNameKanji: '松本稔',
      playerNameKana: 'まつもと　みのる',
      jerseyNumber: 6,
      height: 180,
      weight: 70,
    },
  });

  const kawataMasashi = await prisma.players.create({
    data: {
      teamId: sannoh.teamId,
      playerNameKanji: '河田雅史',
      playerNameKana: 'かわた　まさし',
      jerseyNumber: 7,
      height: 194,
      weight: 93,
    },
  });

  const ichinokura = await prisma.players.create({
    data: {
      teamId: sannoh.teamId,
      playerNameKanji: '一之倉聡',
      playerNameKana: 'いちのくら　さとし',
      jerseyNumber: 8,
      height: 171,
      weight: 62,
    },
  });

  const sawakita = await prisma.players.create({
    data: {
      teamId: sannoh.teamId,
      playerNameKanji: '沢北栄治',
      playerNameKana: 'さわきた　えいじ',
      jerseyNumber: 9,
      height: 188,
      weight: 80,
    },
  });

  const kawataMikio = await prisma.players.create({
    data: {
      teamId: sannoh.teamId,
      playerNameKanji: '河田美紀男',
      playerNameKana: 'かわた　みきお',
      jerseyNumber: 15,
      height: 210,
      weight: 130,
    },
  });

  /* 3. 試合 */
  // 1 湘北 - 陵南
  const game1 = await prisma.games.create({
    data: {
      tipoffTime: new Date('2026-04-14T11:00:00+09:00'),
      homeTeamId: shohoku.teamId,
      awayTeamId: ryonan.teamId,
    },
  });
  
  // 2 湘北 - 翔陽
  const game2 = await prisma.games.create({
    data: {
      tipoffTime: new Date('2026-05-25T10:00:00+09:00'),
      homeTeamId: shohoku.teamId,
      awayTeamId: shoyo.teamId,
    },
  });

  // 3 湘北 - 海南
  const game3 = await prisma.games.create({
    data: {
      tipoffTime: new Date('2026-06-20T10:30:00+09:00'),
      homeTeamId: shohoku.teamId,
      awayTeamId: kainan.teamId,
    },
  });

  // 4 陵南 - 海南
  const game4 = await prisma.games.create({
    data: {
      tipoffTime: new Date('2026-06-23T10:00:00+09:00'),
      homeTeamId: ryonan.teamId,
      awayTeamId: kainan.teamId,
    },
  });

  // 5 湘北 - 陵南
  const game5 = await prisma.games.create({
    data: {
      tipoffTime: new Date('2026-06-27T10:00:00+09:00'),
      homeTeamId: shohoku.teamId,
      awayTeamId: ryonan.teamId,
    },
  });

  // 6 湘北 - 豊玉
  const game6 = await prisma.games.create({
    data: {
      tipoffTime: new Date('2026-08-02T14:00:00+09:00'),
      homeTeamId: shohoku.teamId,
      awayTeamId: toyotama.teamId,
    },
  });

  // 7 湘北 - 山王
  const game7 = await prisma.games.create({
    data: {
      tipoffTime: new Date('2026-08-03T11:30:00+09:00'),
      homeTeamId: shohoku.teamId,
      awayTeamId: sannoh.teamId,
    },
  });

  /* 4. スタッツ */
  // game1 湘北-陵南
  await prisma.stats.createMany({
    data: [
      // ========================================
      // 湘北高校
      // 湘北 86 - 87 陵南
      // game1
      // ========================================

      // ----------------------------------------
      // 赤木 剛憲 #4
      // 30得点
      // 2P: 11/17 = 22点
      // FT: 8/10 = 8点
      // ----------------------------------------
      {
        playerId: akagi.playerId,
        gameId: game1.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 17,
        p2M: 11,
        ftA: 10,
        ftM: 8,
        oRbd: 4,
        dRbd: 8,
        stl: 1,
        blk: 4,
        tov: 3,
        pf: 4,
        tf: 0,
        fo: 3,
        dq: 0,
        playSec: 2400,
      },

      // ----------------------------------------
      // 木暮 公延 #5
      // 14得点
      // 3P: 3/6 = 9点
      // 2P: 2/5 = 4点
      // FT: 1/2 = 1点
      // ----------------------------------------
      {
        playerId: kogure.playerId,
        gameId: game1.gameId,
        p3A: 6,
        p3M: 3,
        p2A: 5,
        p2M: 2,
        ftA: 2,
        ftM: 1,
        oRbd: 1,
        dRbd: 3,
        stl: 1,
        blk: 0,
        tov: 1,
        pf: 2,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2400,
      },

      // ----------------------------------------
      // 安田 靖司 #6
      // 7得点
      // 3P: 1/2 = 3点
      // 2P: 2/4 = 4点
      // ----------------------------------------
      {
        playerId: yasuda.playerId,
        gameId: game1.gameId,
        p3A: 2,
        p3M: 1,
        p2A: 4,
        p2M: 2,
        ftA: 0,
        ftM: 0,
        oRbd: 1,
        dRbd: 2,
        stl: 2,
        blk: 0,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 1,
        dq: 0,
        playSec: 1500,
      },

      // ----------------------------------------
      // 潮崎 哲士 #8
      // 2得点
      // 2P: 1/2 = 2点
      // ----------------------------------------
      {
        playerId: shiozaki.playerId,
        gameId: game1.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 2,
        p2M: 1,
        ftA: 0,
        ftM: 0,
        oRbd: 0,
        dRbd: 1,
        stl: 1,
        blk: 0,
        tov: 1,
        pf: 1,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 1200,
      },

      // ----------------------------------------
      // 桜木 花道 #10
      // 11得点
      // 2P: 5/8 = 10点
      // FT: 1/3 = 1点
      // ----------------------------------------
      {
        playerId: sakuragi.playerId,
        gameId: game1.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 8,
        p2M: 5,
        ftA: 3,
        ftM: 1,
        oRbd: 5,
        dRbd: 7,
        stl: 1,
        blk: 2,
        tov: 3,
        pf: 5,
        tf: 0,
        fo: 4,
        dq: 0,
        playSec: 2100,
      },

      // ----------------------------------------
      // 流川 楓 #11
      // 22得点
      // 3P: 2/5 = 6点
      // 2P: 6/12 = 12点
      // FT: 4/5 = 4点
      // ----------------------------------------
      {
        playerId: rukawa.playerId,
        gameId: game1.gameId,
        p3A: 5,
        p3M: 2,
        p2A: 12,
        p2M: 6,
        ftA: 5,
        ftM: 4,
        oRbd: 1,
        dRbd: 5,
        stl: 2,
        blk: 1,
        tov: 2,
        pf: 3,
        tf: 0,
        fo: 3,
        dq: 0,
        playSec: 2400,
      },

      // ========================================
      // 陵南高校
      // 陵南 87点
      // ========================================

      // ----------------------------------------
      // 魚住 純 #4
      // 18得点
      // 2P: 8/13 = 16点
      // FT: 2/4 = 2点
      // ----------------------------------------
      {
        playerId: uozumi.playerId,
        gameId: game1.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 13,
        p2M: 8,
        ftA: 4,
        ftM: 2,
        oRbd: 4,
        dRbd: 7,
        stl: 0,
        blk: 4,
        tov: 3,
        pf: 5,
        tf: 0,
        fo: 3,
        dq: 0,
        playSec: 2400,
      },

      // ----------------------------------------
      // 池上 亮二 #5
      // 10得点
      // 3P: 2/5 = 6点
      // 2P: 2/5 = 4点
      // ----------------------------------------
      {
        playerId: ikegami.playerId,
        gameId: game1.gameId,
        p3A: 5,
        p3M: 2,
        p2A: 5,
        p2M: 2,
        ftA: 0,
        ftM: 0,
        oRbd: 1,
        dRbd: 3,
        stl: 2,
        blk: 1,
        tov: 1,
        pf: 3,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2400,
      },

      // ----------------------------------------
      // 越野 宏明 #6
      // 12得点
      // 3P: 2/5 = 6点
      // 2P: 2/6 = 4点
      // FT: 2/2 = 2点
      // ----------------------------------------
      {
        playerId: koshino.playerId,
        gameId: game1.gameId,
        p3A: 5,
        p3M: 2,
        p2A: 6,
        p2M: 2,
        ftA: 2,
        ftM: 2,
        oRbd: 1,
        dRbd: 2,
        stl: 2,
        blk: 0,
        tov: 2,
        pf: 4,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2400,
      },

      // ----------------------------------------
      // 仙道 彰 #7
      // 27得点
      // 3P: 3/7 = 9点
      // 2P: 7/13 = 14点
      // FT: 4/5 = 4点
      // ----------------------------------------
      {
        playerId: sendo.playerId,
        gameId: game1.gameId,
        p3A: 7,
        p3M: 3,
        p2A: 13,
        p2M: 7,
        ftA: 5,
        ftM: 4,
        oRbd: 2,
        dRbd: 5,
        stl: 3,
        blk: 1,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 4,
        dq: 0,
        playSec: 2400,
      },

      // ----------------------------------------
      // 植草 智之 #8
      // 20得点
      // 3P: 2/4 = 6点
      // 2P: 5/9 = 10点
      // FT: 4/5 = 4点
      // ----------------------------------------
      {
        playerId: uekusa.playerId,
        gameId: game1.gameId,
        p3A: 4,
        p3M: 2,
        p2A: 9,
        p2M: 5,
        ftA: 5,
        ftM: 4,
        oRbd: 1,
        dRbd: 3,
        stl: 1,
        blk: 0,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2400,
      },
    ],
  });

  // game2 湘北-翔陽
  await prisma.stats.createMany({
    data: [
      // ========================================
      // 湘北高校
      // 湘北 62 - 60 翔陽
      // ========================================

      // 赤木剛憲 #4
      // 6得点
      {
        playerId: akagi.playerId,
        gameId: game2.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 7,
        p2M: 3,
        ftA: 2,
        ftM: 0,
        oRbd: 3,
        dRbd: 8,
        stl: 1,
        blk: 3,
        tov: 2,
        pf: 3,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2100,
      },

      // 木暮公延 #5
      // 6得点・途中出場
      {
        playerId: kogure.playerId,
        gameId: game2.gameId,
        p3A: 3,
        p3M: 1,
        p2A: 3,
        p2M: 1,
        ftA: 1,
        ftM: 1,
        oRbd: 0,
        dRbd: 2,
        stl: 1,
        blk: 0,
        tov: 1,
        pf: 1,
        tf: 0,
        fo: 1,
        dq: 0,
        playSec: 900,
      },

      // 安田靖春 #6
      // 8得点
      {
        playerId: yasuda.playerId,
        gameId: game2.gameId,
        p3A: 3,
        p3M: 2,
        p2A: 3,
        p2M: 1,
        ftA: 0,
        ftM: 0,
        oRbd: 1,
        dRbd: 2,
        stl: 2,
        blk: 0,
        tov: 1,
        pf: 2,
        tf: 0,
        fo: 1,
        dq: 0,
        playSec: 1500,
      },

      // 宮城リョータ #7
      // 2得点
      {
        playerId: miyagi.playerId,
        gameId: game2.gameId,
        p3A: 1,
        p3M: 0,
        p2A: 4,
        p2M: 1,
        ftA: 0,
        ftM: 0,
        oRbd: 1,
        dRbd: 3,
        stl: 3,
        blk: 0,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2100,
      },

      // 桜木花道 #10
      // 2得点
      {
        playerId: sakuragi.playerId,
        gameId: game2.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 4,
        p2M: 1,
        ftA: 1,
        ftM: 0,
        oRbd: 5,
        dRbd: 7,
        stl: 1,
        blk: 2,
        tov: 2,
        pf: 4,
        tf: 0,
        fo: 3,
        dq: 0,
        playSec: 2400,
      },

      // 流川楓 #11
      // 18得点
      {
        playerId: rukawa.playerId,
        gameId: game2.gameId,
        p3A: 5,
        p3M: 2,
        p2A: 10,
        p2M: 5,
        ftA: 3,
        ftM: 2,
        oRbd: 1,
        dRbd: 5,
        stl: 2,
        blk: 1,
        tov: 2,
        pf: 3,
        tf: 0,
        fo: 3,
        dq: 0,
        playSec: 2400,
      },

      // 三井寿 #14
      // 20得点
      {
        playerId: mitsui.playerId,
        gameId: game2.gameId,
        p3A: 11,
        p3M: 5,
        p2A: 5,
        p2M: 2,
        ftA: 2,
        ftM: 1,
        oRbd: 1,
        dRbd: 4,
        stl: 2,
        blk: 0,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 3,
        dq: 0,
        playSec: 2400,
      },

      // ========================================
      // 翔陽高校
      // 湘北 62 - 60 翔陽
      // ========================================

      // 藤真健司 #4
      // 5得点・途中出場
      {
        playerId: fujima.playerId,
        gameId: game2.gameId,
        p3A: 2,
        p3M: 1,
        p2A: 2,
        p2M: 1,
        ftA: 0,
        ftM: 0,
        oRbd: 0,
        dRbd: 2,
        stl: 1,
        blk: 0,
        tov: 1,
        pf: 1,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 900,
      },

      // 花形透 #5
      // 18得点
      {
        playerId: hanagata.playerId,
        gameId: game2.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 11,
        p2M: 7,
        ftA: 5,
        ftM: 4,
        oRbd: 4,
        dRbd: 7,
        stl: 1,
        blk: 3,
        tov: 2,
        pf: 3,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2400,
      },

      // 長谷川一志 #6
      // 12得点
      {
        playerId: hasegawa.playerId,
        gameId: game2.gameId,
        p3A: 5,
        p3M: 2,
        p2A: 6,
        p2M: 3,
        ftA: 0,
        ftM: 0,
        oRbd: 1,
        dRbd: 3,
        stl: 2,
        blk: 0,
        tov: 1,
        pf: 3,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2400,
      },

      // 永野満 #7
      // 10得点
      {
        playerId: nagano.playerId,
        gameId: game2.gameId,
        p3A: 4,
        p3M: 2,
        p2A: 5,
        p2M: 2,
        ftA: 0,
        ftM: 0,
        oRbd: 1,
        dRbd: 3,
        stl: 2,
        blk: 0,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2400,
      },

      // 高野昭一 #8
      // 8得点
      {
        playerId: takano.playerId,
        gameId: game2.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 7,
        p2M: 4,
        ftA: 0,
        ftM: 0,
        oRbd: 2,
        dRbd: 4,
        stl: 1,
        blk: 1,
        tov: 1,
        pf: 3,
        tf: 0,
        fo: 1,
        dq: 0,
        playSec: 2400,
      },

      // 伊藤卓 #9
      // 7得点
      {
        playerId: ito.playerId,
        gameId: game2.gameId,
        p3A: 4,
        p3M: 1,
        p2A: 5,
        p2M: 2,
        ftA: 0,
        ftM: 0,
        oRbd: 1,
        dRbd: 2,
        stl: 1,
        blk: 0,
        tov: 1,
        pf: 2,
        tf: 0,
        fo: 2,
        dq: 0,
        playSec: 2400,
      },
    ],
  });

  // game3 湘北-海南
  await prisma.stats.createMany({
    data: [
      // =========================
      // 湘北高校
      // =========================

      // 赤木剛憲 #4
      {
        playerId: akagi.playerId,
        gameId: game3.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 10,
        p2M: 5,
        ftA: 2,
        ftM: 0,
        oRbd: 4,
        dRbd: 7,
        stl: 1,
        blk: 2,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2400,
      },

      // 木暮公延 #5
      {
        playerId: kogure.playerId,
        gameId: game3.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 1,
        p2M: 0,
        ftA: 0,
        ftM: 0,
        oRbd: 0,
        dRbd: 1,
        stl: 0,
        blk: 0,
        tov: 0,
        pf: 0,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 180,
      },

      // 宮城リョータ #7
      {
        playerId: miyagi.playerId,
        gameId: game3.gameId,
        p3A: 3,
        p3M: 1,
        p2A: 6,
        p2M: 3,
        ftA: 0,
        ftM: 0,
        oRbd: 1,
        dRbd: 2,
        stl: 2,
        blk: 0,
        tov: 2,
        pf: 1,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2220,
      },

      // 桜木花道 #10
      {
        playerId: sakuragi.playerId,
        gameId: game3.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 10,
        p2M: 7,
        ftA: 2,
        ftM: 0,
        oRbd: 5,
        dRbd: 8,
        stl: 2,
        blk: 1,
        tov: 3,
        pf: 1,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2400,
      },

      // 流川楓 #11
      {
        playerId: rukawa.playerId,
        gameId: game3.gameId,
        p3A: 7,
        p3M: 3,
        p2A: 13,
        p2M: 8,
        ftA: 8,
        ftM: 6,
        oRbd: 1,
        dRbd: 4,
        stl: 2,
        blk: 1,
        tov: 2,
        pf: 1,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2400,
      },

      // 三井寿 #14
      {
        playerId: mitsui.playerId,
        gameId: game3.gameId,
        p3A: 9,
        p3M: 4,
        p2A: 7,
        p2M: 3,
        ftA: 8,
        ftM: 6,
        oRbd: 1,
        dRbd: 3,
        stl: 1,
        blk: 0,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2400,
      },

      // =========================
      // 海南高校
      // =========================

      // 牧紳一 #4
      {
        playerId: maki.playerId,
        gameId: game3.gameId,
        p3A: 3,
        p3M: 1,
        p2A: 14,
        p2M: 8,
        ftA: 7,
        ftM: 5,
        oRbd: 2,
        dRbd: 4,
        stl: 2,
        blk: 0,
        tov: 2,
        pf: 3,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2280,
      },

      // 高砂一馬 #5
      {
        playerId: takasago.playerId,
        gameId: game3.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 8,
        p2M: 5,
        ftA: 3,
        ftM: 2,
        oRbd: 3,
        dRbd: 6,
        stl: 1,
        blk: 1,
        tov: 2,
        pf: 2,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2400,
      },

      // 神宗一郎 #6
      {
        playerId: jin.playerId,
        gameId: game3.gameId,
        p3A: 10,
        p3M: 5,
        p2A: 8,
        p2M: 4,
        ftA: 5,
        ftM: 4,
        oRbd: 1,
        dRbd: 3,
        stl: 1,
        blk: 0,
        tov: 1,
        pf: 1,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2400,
      },

      // 武藤正 #9
      {
        playerId: muto.playerId,
        gameId: game3.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 7,
        p2M: 4,
        ftA: 2,
        ftM: 2,
        oRbd: 2,
        dRbd: 4,
        stl: 1,
        blk: 0,
        tov: 1,
        pf: 1,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2400,
      },

      // 清田信長 #10
      {
        playerId: kiyota.playerId,
        gameId: game3.gameId,
        p3A: 5,
        p3M: 2,
        p2A: 7,
        p2M: 4,
        ftA: 4,
        ftM: 3,
        oRbd: 2,
        dRbd: 3,
        stl: 2,
        blk: 1,
        tov: 2,
        pf: 1,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 2400,
      },

      // 宮益義範 #15
      {
        playerId: miyamasu.playerId,
        gameId: game3.gameId,
        p3A: 0,
        p3M: 0,
        p2A: 0,
        p2M: 0,
        ftA: 0,
        ftM: 0,
        oRbd: 0,
        dRbd: 0,
        stl: 0,
        blk: 0,
        tov: 0,
        pf: 0,
        tf: 0,
        fo: 0,
        dq: 0,
        playSec: 120,
      },
    ],
  });

  console.log('Seed data inserted successfully.');

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
