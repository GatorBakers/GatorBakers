-- Backfill any NULL values from the previous migration, then enforce NOT NULL.
UPDATE "Listing"
SET
  "allergens"   = COALESCE("allergens",   ARRAY[]::TEXT[]),
  "ingredients" = COALESCE("ingredients", ARRAY[]::TEXT[]);

ALTER TABLE "Listing"
  ALTER COLUMN "allergens"   SET NOT NULL,
  ALTER COLUMN "ingredients" SET NOT NULL;