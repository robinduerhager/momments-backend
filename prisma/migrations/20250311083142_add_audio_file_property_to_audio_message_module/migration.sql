/*
  Warnings:

  - You are about to drop the column `audioFileName` on the `AudioMessageModule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audioFileId]` on the table `AudioMessageModule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `audioFileId` to the `AudioMessageModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioMessageModule" DROP COLUMN "audioFileName",
ADD COLUMN     "audioFileId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AudioFile" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "audioModuleId" INTEGER,

    CONSTRAINT "AudioFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AudioMessageModule_audioFileId_key" ON "AudioMessageModule"("audioFileId");

-- AddForeignKey
ALTER TABLE "AudioMessageModule" ADD CONSTRAINT "AudioMessageModule_audioFileId_fkey" FOREIGN KEY ("audioFileId") REFERENCES "AudioFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
