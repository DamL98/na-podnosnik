-- AlterTable
ALTER TABLE "rezerwacje" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "rezerwacje_userId_idx" ON "rezerwacje"("userId");

-- AddForeignKey
ALTER TABLE "rezerwacje" ADD CONSTRAINT "rezerwacje_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
