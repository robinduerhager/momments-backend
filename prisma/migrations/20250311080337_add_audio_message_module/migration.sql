-- AlterEnum
ALTER TYPE "ModuleType" ADD VALUE 'AUDIOMESSAGE';

-- CreateTable
CREATE TABLE "AudioMessageModule" (
    "id" SERIAL NOT NULL,
    "audioFileName" TEXT NOT NULL,
    "moduleId" INTEGER,

    CONSTRAINT "AudioMessageModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AudioMessageModule_moduleId_key" ON "AudioMessageModule"("moduleId");

-- AddForeignKey
ALTER TABLE "AudioMessageModule" ADD CONSTRAINT "AudioMessageModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
