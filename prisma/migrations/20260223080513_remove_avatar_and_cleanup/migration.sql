/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `MigrationCheck` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "avatarUrl";

-- DropTable
DROP TABLE "MigrationCheck";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");
