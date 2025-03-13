/*
  Warnings:

  - A unique constraint covering the columns `[audioTrackId]` on the table `AudioFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "ModuleType" ADD VALUE 'COMPOSITION';

-- AlterTable
ALTER TABLE "AudioFile" ADD COLUMN     "audioTrackId" INTEGER;

-- CreateTable
CREATE TABLE "CompositionModule" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER,

    CONSTRAINT "CompositionModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioTrack" (
    "id" SERIAL NOT NULL,
    "startPosition" DOUBLE PRECISION,
    "startCue" DOUBLE PRECISION,
    "endCue" DOUBLE PRECISION,
    "compositionId" INTEGER NOT NULL,

    CONSTRAINT "AudioTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AudioFile_audioTrackId_key" ON "AudioFile"("audioTrackId");

-- AddForeignKey
ALTER TABLE "CompositionModule" ADD CONSTRAINT "CompositionModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_compositionId_fkey" FOREIGN KEY ("compositionId") REFERENCES "CompositionModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioFile" ADD CONSTRAINT "AudioFile_audioTrackId_fkey" FOREIGN KEY ("audioTrackId") REFERENCES "AudioTrack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
