/*
  Warnings:

  - You are about to drop the `Games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Players" DROP CONSTRAINT "Players_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_playerId_fkey";

-- DropTable
DROP TABLE "Games";

-- DropTable
DROP TABLE "Players";

-- DropTable
DROP TABLE "Stats";

-- DropTable
DROP TABLE "Teams";

-- CreateTable
CREATE TABLE "teams" (
    "team_id" SERIAL NOT NULL,
    "team_name" VARCHAR(30) NOT NULL,
    "team_color" VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',

    CONSTRAINT "teams_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "players" (
    "player_id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "player_name_kanji" VARCHAR(30) NOT NULL,
    "player_name_kana" VARCHAR(30) NOT NULL,
    "jersey_number" INTEGER NOT NULL,
    "alma_mater" VARCHAR(30) NOT NULL DEFAULT '未設定',
    "height" INTEGER,
    "weight" INTEGER,

    CONSTRAINT "players_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "games" (
    "game_id" SERIAL NOT NULL,
    "tipoff_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "home_team_id" INTEGER NOT NULL,
    "away_team_id" INTEGER NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "stats" (
    "player_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "p3_a" INTEGER NOT NULL DEFAULT 0,
    "p3_m" INTEGER NOT NULL DEFAULT 0,
    "p2_a" INTEGER NOT NULL DEFAULT 0,
    "p2_m" INTEGER NOT NULL DEFAULT 0,
    "ft_a" INTEGER NOT NULL DEFAULT 0,
    "ft_m" INTEGER NOT NULL DEFAULT 0,
    "o_rbd" INTEGER NOT NULL DEFAULT 0,
    "d_rbd" INTEGER NOT NULL DEFAULT 0,
    "stl" INTEGER NOT NULL DEFAULT 0,
    "blk" INTEGER NOT NULL DEFAULT 0,
    "tov" INTEGER NOT NULL DEFAULT 0,
    "pf" INTEGER NOT NULL DEFAULT 0,
    "tf" INTEGER NOT NULL DEFAULT 0,
    "fo" INTEGER NOT NULL DEFAULT 0,
    "dq" INTEGER NOT NULL DEFAULT 0,
    "play_sec" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("player_id","game_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_name_key" ON "teams"("team_name");

-- CreateIndex
CREATE UNIQUE INDEX "players_team_id_jersey_number_key" ON "players"("team_id", "jersey_number");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stats" ADD CONSTRAINT "stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stats" ADD CONSTRAINT "stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;
