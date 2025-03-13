/*
  Warnings:

  - You are about to drop the column `audioModuleId` on the `AudioFile` table. All the data in the column will be lost.
  - You are about to drop the column `audioTrackId` on the `AudioFile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audioFileId]` on the table `AudioMessageModule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audioFileId]` on the table `AudioTrack` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AudioFile" DROP CONSTRAINT "AudioFile_audioModuleId_fkey";

-- DropForeignKey
ALTER TABLE "AudioFile" DROP CONSTRAINT "AudioFile_audioTrackId_fkey";

-- DropIndex
DROP INDEX "AudioFile_audioModuleId_key";

-- DropIndex
DROP INDEX "AudioFile_audioTrackId_key";

-- AlterTable
ALTER TABLE "AudioFile" DROP COLUMN "audioModuleId",
DROP COLUMN "audioTrackId";

-- AlterTable
ALTER TABLE "AudioMessageModule" ADD COLUMN     "audioFileId" INTEGER;

-- AlterTable
ALTER TABLE "AudioTrack" ADD COLUMN     "audioFileId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "AudioMessageModule_audioFileId_key" ON "AudioMessageModule"("audioFileId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioTrack_audioFileId_key" ON "AudioTrack"("audioFileId");

-- AddForeignKey
ALTER TABLE "AudioMessageModule" ADD CONSTRAINT "AudioMessageModule_audioFileId_fkey" FOREIGN KEY ("audioFileId") REFERENCES "AudioFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_audioFileId_fkey" FOREIGN KEY ("audioFileId") REFERENCES "AudioFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
