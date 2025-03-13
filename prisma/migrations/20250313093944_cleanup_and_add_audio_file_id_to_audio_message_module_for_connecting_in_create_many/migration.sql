/*
  Warnings:

  - You are about to drop the column `audioModuleId` on the `AudioFile` table. All the data in the column will be lost.
  - You are about to drop the column `audioTrackId` on the `AudioFile` table. All the data in the column will be lost.
  - You are about to drop the column `compositionId` on the `AudioTrack` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audioFileId]` on the table `AudioTrack` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `compositionModuleId` to the `AudioTrack` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AudioFile" DROP CONSTRAINT "AudioFile_audioTrackId_fkey";

-- DropForeignKey
ALTER TABLE "AudioTrack" DROP CONSTRAINT "AudioTrack_compositionId_fkey";

-- DropIndex
DROP INDEX "AudioFile_audioTrackId_key";

-- AlterTable
ALTER TABLE "AudioFile" DROP COLUMN "audioModuleId",
DROP COLUMN "audioTrackId";

-- AlterTable
ALTER TABLE "AudioTrack" DROP COLUMN "compositionId",
ADD COLUMN     "audioFileId" INTEGER,
ADD COLUMN     "compositionModuleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AudioTrack_audioFileId_key" ON "AudioTrack"("audioFileId");

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_audioFileId_fkey" FOREIGN KEY ("audioFileId") REFERENCES "AudioFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_compositionModuleId_fkey" FOREIGN KEY ("compositionModuleId") REFERENCES "CompositionModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
