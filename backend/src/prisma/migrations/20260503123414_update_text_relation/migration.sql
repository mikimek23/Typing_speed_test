/*
  Warnings:

  - The `user_id` column on the `Text` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `difficulty` on the `Text` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `source_type` on the `Text` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('DEFAULT', 'USER');

-- DropForeignKey
ALTER TABLE "Text" DROP CONSTRAINT "Text_id_fkey";

-- AlterTable
ALTER TABLE "Text" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
DROP COLUMN "source_type",
ADD COLUMN     "source_type" "Source" NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID;

-- DropEnum
DROP TYPE "diff";

-- DropEnum
DROP TYPE "source";

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
