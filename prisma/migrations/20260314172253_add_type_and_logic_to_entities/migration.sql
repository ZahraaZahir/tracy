/*
  Warnings:

  - Added the required column `fixedCode` to the `GameEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `glitchedCode` to the `GameEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameEntity" ADD COLUMN     "fixedCode" JSONB NOT NULL,
ADD COLUMN     "glitchedCode" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'NPC';
