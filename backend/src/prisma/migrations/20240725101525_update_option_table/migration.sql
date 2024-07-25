/*
  Warnings:

  - You are about to drop the column `status` on the `Question` table. All the data in the column will be lost.
  - Added the required column `option` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Option` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "option" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "status";
