-- Rename Listing inventory column to align DB schema with API naming.
ALTER TABLE "Listing"
RENAME COLUMN "remaining_inventory" TO "quantity";
