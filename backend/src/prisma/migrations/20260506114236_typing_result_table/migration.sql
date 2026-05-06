-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('TIMED', 'PASSAGE');

-- CreateTable
CREATE TABLE "Typing_results" (
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

    CONSTRAINT "Typing_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Typing_results_user_id_idx" ON "Typing_results"("user_id");

-- CreateIndex
CREATE INDEX "Typing_results_completedAt_idx" ON "Typing_results"("completedAt");

-- CreateIndex
CREATE INDEX "Text_user_id_idx" ON "Text"("user_id");

-- AddForeignKey
ALTER TABLE "Typing_results" ADD CONSTRAINT "Typing_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Typing_results" ADD CONSTRAINT "Typing_results_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;
