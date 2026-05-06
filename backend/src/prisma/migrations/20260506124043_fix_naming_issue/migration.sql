/*
  Warnings:

  - You are about to drop the `Typing_results` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Typing_results" DROP CONSTRAINT "Typing_results_text_id_fkey";

-- DropForeignKey
ALTER TABLE "Typing_results" DROP CONSTRAINT "Typing_results_user_id_fkey";

-- DropTable
DROP TABLE "Typing_results";

-- CreateTable
CREATE TABLE "TypingResults" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "text_id" UUID,
    "mode" "Mode" NOT NULL,
    "durationSeconds" INTEGER,
    "wpm" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "correctCharacters" INTEGER NOT NULL,
    "incorrectCharacters" INTEGER NOT NULL,
    "totalKeyPress" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TypingResults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TypingResults_user_id_idx" ON "TypingResults"("user_id");

-- CreateIndex
CREATE INDEX "TypingResults_completedAt_idx" ON "TypingResults"("completedAt");

-- AddForeignKey
ALTER TABLE "TypingResults" ADD CONSTRAINT "TypingResults_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypingResults" ADD CONSTRAINT "TypingResults_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;
