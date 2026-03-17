/*
  Warnings:

  - The primary key for the `SaveState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `data` on the `SaveState` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SaveState` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SaveState_userId_key";

-- AlterTable
ALTER TABLE "GameEntity" ADD COLUMN     "saveStateUserId" TEXT;

-- AlterTable
ALTER TABLE "SaveState" DROP CONSTRAINT "SaveState_pkey",
DROP COLUMN "data",
DROP COLUMN "id",
ADD COLUMN     "mapName" TEXT NOT NULL DEFAULT 'main_world',
ADD COLUMN     "posX" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "posY" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD CONSTRAINT "SaveState_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "GameEntity" ADD CONSTRAINT "GameEntity_saveStateUserId_fkey" FOREIGN KEY ("saveStateUserId") REFERENCES "SaveState"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
