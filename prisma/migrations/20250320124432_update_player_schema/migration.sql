/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discordId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "discordId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_discordId_key" ON "Player"("discordId");
