-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "elo" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "games" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "losses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0;
