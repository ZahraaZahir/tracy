/*
  Warnings:

  - You are about to drop the column `fixedCode` on the `GameEntity` table. All the data in the column will be lost.
  - You are about to drop the column `glitchedCode` on the `GameEntity` table. All the data in the column will be lost.
  - Added the required column `errorMessages` to the `GameEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solutionMap` to the `GameEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateCode` to the `GameEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameEntity" DROP COLUMN "fixedCode",
DROP COLUMN "glitchedCode",
ADD COLUMN     "errorMessages" JSONB NOT NULL,
ADD COLUMN     "solutionMap" JSONB NOT NULL,
ADD COLUMN     "templateCode" TEXT NOT NULL;
