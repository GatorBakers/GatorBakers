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

async function createListing(ownerId: number) {
  return prisma.listing.create({
    data: {
      user_id: ownerId,
      title: "Order Update Test Listing",
      description: "Listing used for order status update tests",
      price: "10.00",
      quantity: 5,
      pastries_sold: 0,
      listing_status: "AVAILABLE",
      photo_url: "https://example.com/pastry.jpg",
      ingredients: ["flour", "butter"],
      allergens: ["wheat"],
    },
  });
}

async function createOrder(buyerId: number, listingId: number) {
  return prisma.order.create({
    data: {
      user_id: buyerId,
      listing_id: listingId,
      pickup_location: "Student Union",
      pickup_time: "15:00",
      status: "PENDING",
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

describe("update order status route integration", () => {
  it("PATCH /order/:id returns 401 without token", async () => {
    const response = await request(app)
      .patch("/order/1")
      .send({ status: "CONFIRMED" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("returns 400 for invalid status", async () => {
    const seller = await createUser(`seller-status-${Date.now()}-${Math.random()}`);
    const buyer = await createUser(`buyer-status-${Date.now()}-${Math.random()}`);
    createdUserIds.push(seller.id, buyer.id);

    const listing = await createListing(seller.id);
    createdListingIds.push(listing.id);

    const order = await createOrder(buyer.id, listing.id);
    createdOrderIds.push(order.id);

    const sellerToken = makeAccessToken(seller.id);
    const response = await request(app)
      .patch(`/order/${order.id}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ status: "PENDING" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid status" });
  });

  it("returns 403 when non-owner tries to update an order", async () => {
    const seller = await createUser(`seller-own-${Date.now()}-${Math.random()}`);
    const buyer = await createUser(`buyer-own-${Date.now()}-${Math.random()}`);
    const otherUser = await createUser(`other-own-${Date.now()}-${Math.random()}`);
    createdUserIds.push(seller.id, buyer.id, otherUser.id);

    const listing = await createListing(seller.id);
    createdListingIds.push(listing.id);

    const order = await createOrder(buyer.id, listing.id);
    createdOrderIds.push(order.id);

    const nonOwnerToken = makeAccessToken(otherUser.id);
    const response = await request(app)
      .patch(`/order/${order.id}`)
      .set("Authorization", `Bearer ${nonOwnerToken}`)
      .send({ status: "CONFIRMED" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Forbidden: not your order to update" });

    const unchangedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    expect(unchangedOrder?.status).toBe("PENDING");
  });

  it("allows listing owner to confirm an order", async () => {
    const seller = await createUser(`seller-confirm-${Date.now()}-${Math.random()}`);
    const buyer = await createUser(`buyer-confirm-${Date.now()}-${Math.random()}`);
    createdUserIds.push(seller.id, buyer.id);

    const listing = await createListing(seller.id);
    createdListingIds.push(listing.id);

    const order = await createOrder(buyer.id, listing.id);
    createdOrderIds.push(order.id);

    const sellerToken = makeAccessToken(seller.id);
    const response = await request(app)
      .patch(`/order/${order.id}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ status: "CONFIRMED" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("CONFIRMED");
    expect(response.body.id).toBe(order.id);

    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    expect(updatedOrder?.status).toBe("CONFIRMED");
  });
});
