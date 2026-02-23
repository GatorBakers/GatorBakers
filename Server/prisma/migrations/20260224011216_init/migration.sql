/*
  Warnings:

  - You are about to drop the column `userId` on the `Coords` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `listingId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Coords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listing_id]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Coords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `state` on the `Location` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "US_State" AS ENUM ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC');

-- DropForeignKey
ALTER TABLE "Coords" DROP CONSTRAINT "Coords_userId_fkey";

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_userId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropIndex
DROP INDEX "Coords_userId_key";

-- DropIndex
DROP INDEX "Listing_userId_key";

-- DropIndex
DROP INDEX "Location_listingId_key";

-- DropIndex
DROP INDEX "Location_userId_key";

-- DropIndex
DROP INDEX "Order_userId_key";

-- AlterTable
ALTER TABLE "Coords" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "listingId",
DROP COLUMN "userId",
ADD COLUMN     "listing_id" INTEGER,
ADD COLUMN     "user_id" INTEGER,
DROP COLUMN "state",
ADD COLUMN     "state" "US_State" NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "USState";

-- CreateTable
CREATE TABLE "Token" (
    "token_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coords_user_id_key" ON "Coords"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_user_id_key" ON "Listing"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_user_id_key" ON "Location"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_listing_id_key" ON "Location"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_user_id_key" ON "Order"("user_id");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coords" ADD CONSTRAINT "Coords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
