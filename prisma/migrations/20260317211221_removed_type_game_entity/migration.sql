/*
  Warnings:

  - You are about to drop the column `saveStateUserId` on the `GameEntity` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `GameEntity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameEntity" DROP CONSTRAINT "GameEntity_saveStateUserId_fkey";

-- AlterTable
ALTER TABLE "GameEntity" DROP COLUMN "saveStateUserId",
DROP COLUMN "type";

-- CreateTable
CREATE TABLE "_GameEntityToSaveState" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameEntityToSaveState_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GameEntityToSaveState_B_index" ON "_GameEntityToSaveState"("B");

-- AddForeignKey
ALTER TABLE "_GameEntityToSaveState" ADD CONSTRAINT "_GameEntityToSaveState_A_fkey" FOREIGN KEY ("A") REFERENCES "GameEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameEntityToSaveState" ADD CONSTRAINT "_GameEntityToSaveState_B_fkey" FOREIGN KEY ("B") REFERENCES "SaveState"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
