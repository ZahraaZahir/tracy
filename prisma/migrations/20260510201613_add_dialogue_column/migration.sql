-- AlterTable
ALTER TABLE "SaveState" ADD COLUMN     "seenDialogues" JSONB NOT NULL DEFAULT '[]';
