/*
  Warnings:

  - You are about to drop the column `user_id` on the `Coords` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_current_id]` on the table `Coords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_search_id]` on the table `Coords` will be added. If there are existing duplicate values, this will fail.
  - Made the column `listing_id` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Coords" DROP CONSTRAINT "Coords_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_user_id_fkey";

-- DropIndex
DROP INDEX "Coords_user_id_key";

-- DropIndex
DROP INDEX "Listing_user_id_key";

-- DropIndex
DROP INDEX "Location_user_id_key";

-- AlterTable
ALTER TABLE "Coords" DROP COLUMN "user_id",
ADD COLUMN     "user_current_id" INTEGER,
ADD COLUMN     "user_search_id" INTEGER;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "user_id",
ALTER COLUMN "listing_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Coords_user_current_id_key" ON "Coords"("user_current_id");

-- CreateIndex
CREATE UNIQUE INDEX "Coords_user_search_id_key" ON "Coords"("user_search_id");

-- AddForeignKey
ALTER TABLE "Coords" ADD CONSTRAINT "Coords_user_current_id_fkey" FOREIGN KEY ("user_current_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coords" ADD CONSTRAINT "Coords_user_search_id_fkey" FOREIGN KEY ("user_search_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
