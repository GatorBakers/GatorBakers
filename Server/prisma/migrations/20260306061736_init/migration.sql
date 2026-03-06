/*
  Warnings:

  - You are about to drop the column `user_current_id` on the `Coords` table. All the data in the column will be lost.
  - You are about to drop the column `user_search_id` on the `Coords` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Coords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Coords` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Coords" DROP CONSTRAINT "Coords_user_current_id_fkey";

-- DropForeignKey
ALTER TABLE "Coords" DROP CONSTRAINT "Coords_user_search_id_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_listing_id_fkey";

-- DropIndex
DROP INDEX "Coords_user_current_id_key";

-- DropIndex
DROP INDEX "Coords_user_search_id_key";

-- AlterTable
ALTER TABLE "Coords" DROP COLUMN "user_current_id",
DROP COLUMN "user_search_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "listing_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Coords_user_id_key" ON "Coords"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_user_id_key" ON "Listing"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_user_id_key" ON "Location"("user_id");

-- AddForeignKey
ALTER TABLE "Coords" ADD CONSTRAINT "Coords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
