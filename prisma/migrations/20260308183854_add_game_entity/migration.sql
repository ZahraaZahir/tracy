/*
  Warnings:

  - You are about to drop the column `fixedCode` on the `GameEntity` table. All the data in the column will be lost.
  - You are about to drop the column `glitchedCode` on the `GameEntity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameEntity" DROP COLUMN "fixedCode",
DROP COLUMN "glitchedCode";
