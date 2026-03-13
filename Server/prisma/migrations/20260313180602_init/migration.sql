-- CreateIndex
CREATE INDEX "Order_listing_id_idx" ON "Order"("listing_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
