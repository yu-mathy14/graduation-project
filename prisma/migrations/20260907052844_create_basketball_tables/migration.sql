/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "Teams" (
    "teamId" INTEGER NOT NULL,
    "teamName" VARCHAR(30) NOT NULL,
    "teamColor" VARCHAR(7) NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "Players" (
    "playerId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "playerNameKanji" VARCHAR(30) NOT NULL,
    "playerNameKana" VARCHAR(30) NOT NULL,
    "jerseyNumber" INTEGER NOT NULL,
    "almaMater" VARCHAR(30) NOT NULL DEFAULT '未設定',
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("playerId")
);

-- CreateTable
CREATE TABLE "Games" (
    "gameId" INTEGER NOT NULL,
    "tipoffTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("gameId")
);

-- CreateTable
CREATE TABLE "Stats" (
    "playerId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "p3A" INTEGER NOT NULL DEFAULT 0,
    "p3M" INTEGER NOT NULL DEFAULT 0,
    "p2A" INTEGER NOT NULL DEFAULT 0,
    "p2M" INTEGER NOT NULL DEFAULT 0,
    "ftA" INTEGER NOT NULL DEFAULT 0,
    "ftM" INTEGER NOT NULL DEFAULT 0,
    "oRbd" INTEGER NOT NULL DEFAULT 0,
    "dRbd" INTEGER NOT NULL DEFAULT 0,
    "stl" INTEGER NOT NULL DEFAULT 0,
    "blk" INTEGER NOT NULL DEFAULT 0,
    "tov" INTEGER NOT NULL DEFAULT 0,
    "pf" INTEGER NOT NULL DEFAULT 0,
    "tf" INTEGER NOT NULL DEFAULT 0,
    "fo" INTEGER NOT NULL DEFAULT 0,
    "dq" INTEGER NOT NULL DEFAULT 0,
    "playSec" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("playerId","gameId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teams_teamName_key" ON "Teams"("teamName");

-- CreateIndex
CREATE UNIQUE INDEX "Players_teamId_jerseyNumber_key" ON "Players"("teamId", "jerseyNumber");

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Teams"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Teams"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Players"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
