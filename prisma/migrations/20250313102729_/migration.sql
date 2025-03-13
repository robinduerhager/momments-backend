/*
  Warnings:

  - You are about to drop the column `audioFileId` on the `AudioMessageModule` table. All the data in the column will be lost.
  - You are about to drop the column `audioFileId` on the `AudioTrack` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audioModuleId]` on the table `AudioFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audioTrackId]` on the table `AudioFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[compositionModuleId]` on the table `AudioTrack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[moduleId]` on the table `CompositionModule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AudioMessageModule" DROP CONSTRAINT "AudioMessageModule_audioFileId_fkey";

-- DropForeignKey
ALTER TABLE "AudioMessageModule" DROP CONSTRAINT "AudioMessageModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "AudioTrack" DROP CONSTRAINT "AudioTrack_audioFileId_fkey";

-- DropForeignKey
ALTER TABLE "AudioTrack" DROP CONSTRAINT "AudioTrack_compositionModuleId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "CommentModule" DROP CONSTRAINT "CommentModule_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CompositionModule" DROP CONSTRAINT "CompositionModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "RefSongModule" DROP CONSTRAINT "RefSongModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "TextModule" DROP CONSTRAINT "TextModule_moduleId_fkey";

-- DropIndex
DROP INDEX "AudioMessageModule_audioFileId_key";

-- DropIndex
DROP INDEX "AudioTrack_audioFileId_key";

-- AlterTable
ALTER TABLE "AudioFile" ADD COLUMN     "audioModuleId" INTEGER,
ADD COLUMN     "audioTrackId" INTEGER;

-- AlterTable
ALTER TABLE "AudioMessageModule" DROP COLUMN "audioFileId";

-- AlterTable
ALTER TABLE "AudioTrack" DROP COLUMN "audioFileId",
ALTER COLUMN "compositionModuleId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AudioFile_audioModuleId_key" ON "AudioFile"("audioModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioFile_audioTrackId_key" ON "AudioFile"("audioTrackId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioTrack_compositionModuleId_key" ON "AudioTrack"("compositionModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "CompositionModule_moduleId_key" ON "CompositionModule"("moduleId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModule" ADD CONSTRAINT "CommentModule_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextModule" ADD CONSTRAINT "TextModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefSongModule" ADD CONSTRAINT "RefSongModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioMessageModule" ADD CONSTRAINT "AudioMessageModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompositionModule" ADD CONSTRAINT "CompositionModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_compositionModuleId_fkey" FOREIGN KEY ("compositionModuleId") REFERENCES "CompositionModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioFile" ADD CONSTRAINT "AudioFile_audioModuleId_fkey" FOREIGN KEY ("audioModuleId") REFERENCES "AudioMessageModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioFile" ADD CONSTRAINT "AudioFile_audioTrackId_fkey" FOREIGN KEY ("audioTrackId") REFERENCES "AudioTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
