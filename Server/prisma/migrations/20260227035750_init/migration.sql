/*
  Warnings:

  - Made the column `expired_at` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expired_at" SET NOT NULL;
