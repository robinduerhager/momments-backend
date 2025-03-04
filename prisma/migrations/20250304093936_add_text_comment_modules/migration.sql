-- CreateEnum
CREATE TYPE "ModuleType" AS ENUM ('TEXT');

-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "commentIds" INTEGER[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "commentIds" INTEGER[];

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "discussionId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentModule" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "type" "ModuleType" NOT NULL,

    CONSTRAINT "CommentModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextModule" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "TextModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TextModule_moduleId_key" ON "TextModule"("moduleId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModule" ADD CONSTRAINT "CommentModule_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextModule" ADD CONSTRAINT "TextModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
