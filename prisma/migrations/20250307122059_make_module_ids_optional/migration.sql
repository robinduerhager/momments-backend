-- DropForeignKey
ALTER TABLE "RefSongModule" DROP CONSTRAINT "RefSongModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "TextModule" DROP CONSTRAINT "TextModule_moduleId_fkey";

-- AlterTable
ALTER TABLE "RefSongModule" ALTER COLUMN "moduleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TextModule" ALTER COLUMN "moduleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TextModule" ADD CONSTRAINT "TextModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefSongModule" ADD CONSTRAINT "RefSongModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CommentModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
