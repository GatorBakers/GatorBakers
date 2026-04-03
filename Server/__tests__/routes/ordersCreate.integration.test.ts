import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app, prisma } from "../../index";

const accessSecret = process.env.ACCESS_TOKEN_SECRET;

function makeAccessToken(id: number) {
  if (!accessSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  return jwt.sign(
    { id, email: `user${id}@example.com` },
    accessSecret,
    { expiresIn: "5m" },
  );
}

async function createUser(seed: string) {
  return prisma.user.create({
    data: {
      email: `${seed}@example.com`,
      password: "Password1!",
      first_name: "Test",
      last_name: "User",
      account_status: "USER",
    },
  });
}

async function createListing(ownerId: number, quantity: number) {
  return prisma.listing.create({
    data: {
      user_id: ownerId,
      title: "Integration Test Pastry",
      description: "A listing for integration testing",
      price: "12.50",
      quantity,
      pastries_sold: 0,
      listing_status: "AVAILABLE",
      photo_url: "https://example.com/pastry.jpg",
      ingredients: ["flour", "butter"],
      allergens: ["wheat"],
    },
  });
}

const createdOrderIds: number[] = [];
const createdListingIds: number[] = [];
const createdUserIds: number[] = [];

afterEach(async () => {
  if (createdOrderIds.length > 0) {
    await prisma.order.deleteMany({
      where: { id: { in: [...createdOrderIds] } },
    });
    createdOrderIds.length = 0;
  }

  if (createdListingIds.length > 0) {
    await prisma.listing.deleteMany({
      where: { id: { in: [...createdListingIds] } },
    });
    createdListingIds.length = 0;
  }

  if (createdUserIds.length > 0) {
    await prisma.user.deleteMany({
      where: { id: { in: [...createdUserIds] } },
    });
    createdUserIds.length = 0;
  }
});

describe("create order route integration", () => {
  it("POST /listing/:id/order returns 401 without token", async () => {
    const response = await request(app)
      .post("/listing/1/order")
      .send({ pickup_location: "Library", pickup_time: "13:30" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("creates an order and updates listing counters for a valid buyer flow", async () => {
    const seller = await createUser(`seller-${Date.now()}-${Math.random()}`);
    const buyer = await createUser(`buyer-${Date.now()}-${Math.random()}`);
    createdUserIds.push(seller.id, buyer.id);

    const listing = await createListing(seller.id, 2);
    createdListingIds.push(listing.id);

    const token = makeAccessToken(buyer.id);
    const response = await request(app)
      .post(`/listing/${listing.id}/order`)
      .set("Authorization", `Bearer ${token}`)
      .send({ pickup_location: "Student Union", pickup_time: "14:45" });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("PENDING");
    expect(response.body.user_id).toBe(buyer.id);
    expect(response.body.listing_id).toBe(listing.id);

    createdOrderIds.push(response.body.id);

    const updatedListing = await prisma.listing.findUnique({
      where: { id: listing.id },
    });

    expect(updatedListing?.quantity).toBe(1);
    expect(updatedListing?.pastries_sold).toBe(1);
  });

  it("returns 403 when listing owner tries to order own listing", async () => {
    const owner = await createUser(`owner-${Date.now()}-${Math.random()}`);
    createdUserIds.push(owner.id);

    const listing = await createListing(owner.id, 2);
    createdListingIds.push(listing.id);

    const token = makeAccessToken(owner.id);
    const response = await request(app)
      .post(`/listing/${listing.id}/order`)
      .set("Authorization", `Bearer ${token}`)
      .send({ pickup_location: "Student Union", pickup_time: "11:00" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "You cannot place an order on your own listing",
    });

    const orderCount = await prisma.order.count({
      where: { listing_id: listing.id },
    });
    expect(orderCount).toBe(0);
  });

  it("returns 410 and marks listing sold when quantity is zero", async () => {
    const seller = await createUser(`sold-seller-${Date.now()}-${Math.random()}`);
    const buyer = await createUser(`sold-buyer-${Date.now()}-${Math.random()}`);
    createdUserIds.push(seller.id, buyer.id);

    const listing = await createListing(seller.id, 0);
    createdListingIds.push(listing.id);

    const token = makeAccessToken(buyer.id);
    const response = await request(app)
      .post(`/listing/${listing.id}/order`)
      .set("Authorization", `Bearer ${token}`)
      .send({ pickup_location: "Library", pickup_time: "09:15" });

    expect(response.status).toBe(410);
    expect(response.body).toEqual({ message: "Pastry is sold out!" });

    const updatedListing = await prisma.listing.findUnique({
      where: { id: listing.id },
    });

    expect(updatedListing?.quantity).toBe(0);
    expect(updatedListing?.listing_status).toBe("SOLD");

    const orderCount = await prisma.order.count({
      where: { listing_id: listing.id },
    });
    expect(orderCount).toBe(0);
  });
});
