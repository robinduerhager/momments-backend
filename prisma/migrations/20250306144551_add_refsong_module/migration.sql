/*
  Warnings:

  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ModuleType" ADD VALUE 'REFSONG';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RefSongModule" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "RefSongModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefSongModule_moduleId_key" ON "RefSongModule"("moduleId");

-- AddForeignKey
ALTER TABLE "RefSongModule" ADD CONSTRAINT "RefSongModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
