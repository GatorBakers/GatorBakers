/*
  Warnings:

  - Changed the type of `account_status` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Account_Status" AS ENUM ('USER', 'VENDOR', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "account_status",
ADD COLUMN     "account_status" "Account_Status" NOT NULL;

-- DropEnum
DROP TYPE "Status";
