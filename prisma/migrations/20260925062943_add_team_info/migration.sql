/*
  Warnings:

  - Added the required column `coach` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefecture` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teams"
ADD COLUMN "coach" VARCHAR(30) NOT NULL,
ADD COLUMN "memo" TEXT,
ADD COLUMN "prefecture" VARCHAR(10) NOT NULL;
