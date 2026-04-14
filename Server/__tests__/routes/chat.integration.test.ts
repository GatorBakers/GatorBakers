import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { StreamChat } from "stream-chat";
import { app, prisma } from "../../index";

const accessSecret = process.env.ACCESS_TOKEN_SECRET;

function makeAccessToken(id: number) {
  if (!accessSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  return jwt.sign({ id, email: `user${id}@example.com` }, accessSecret, {
    expiresIn: "5m",
  });
}

async function createUser(seed: string) {
  return prisma.user.create({
    data: {
      email: `${seed}@example.com`,
      password: "Password1!",
      first_name: "Chat",
      last_name: "Tester",
      account_status: "USER",
    },
  });
}

async function createListing(ownerId: number) {
  return prisma.listing.create({
    data: {
      user_id: ownerId,
      title: "Chat Integration Listing",
      description: "Used by chat integration tests",
      price: "11.25",
      quantity: 2,
      pastries_sold: 0,
      listing_status: "AVAILABLE",
      photo_url: "https://example.com/chat-listing.jpg",
      ingredients: ["flour"],
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
      pickup_time: "16:00",
      status: "PENDING",
    },
  });
}

const createdChannelConnectionIds: number[] = [];
const createdOrderIds: number[] = [];
const createdListingIds: number[] = [];
const createdUserIds: number[] = [];

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(async () => {
  if (createdChannelConnectionIds.length > 0) {
    await prisma.channelConnection.deleteMany({
      where: { id: { in: [...createdChannelConnectionIds] } },
    });
    createdChannelConnectionIds.length = 0;
  }

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

afterAll(async () => {
  await prisma.$disconnect();
});

describe("chat routes integration", () => {
  it("POST /chat/:orderId returns 401 without token", async () => {
    const response = await request(app).post("/chat/1");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("POST /chat/:orderId returns 404 for unknown order", async () => {
    const token = makeAccessToken(22);
    const response = await request(app)
      .post("/chat/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Order not found" });
  });

  it("POST /chat/:orderId returns 403 when requester is not order buyer or seller", async () => {
    const seller = await createUser(`chat-seller-${Date.now()}-${Math.random()}`);
    const buyer = await createUser(`chat-buyer-${Date.now()}-${Math.random()}`);
    const unrelated = await createUser(`chat-other-${Date.now()}-${Math.random()}`);
    createdUserIds.push(seller.id, buyer.id, unrelated.id);

    const listing = await createListing(seller.id);
    createdListingIds.push(listing.id);

    const order = await createOrder(buyer.id, listing.id);
    createdOrderIds.push(order.id);

    const token = makeAccessToken(unrelated.id);
    const response = await request(app)
      .post(`/chat/${order.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  it("POST /chat/:orderId creates channel connection for valid buyer and calls Stream with unique members", async () => {
    const seller = await createUser(`chat-seller-${Date.now()}-${Math.random()}`);
    const buyer = await createUser(`chat-buyer-${Date.now()}-${Math.random()}`);
    createdUserIds.push(seller.id, buyer.id);

    const listing = await createListing(seller.id);
    createdListingIds.push(listing.id);

    const order = await createOrder(buyer.id, listing.id);
    createdOrderIds.push(order.id);

    const token = makeAccessToken(buyer.id);
    const response = await request(app)
      .post(`/chat/${order.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ channelId: order.id.toString() });

    const connection = await prisma.channelConnection.findUnique({
      where: { order_id: order.id },
    });

    expect(connection).toBeTruthy();
    if (connection) {
      createdChannelConnectionIds.push(connection.id);
      expect(connection.customer_id).toBe(buyer.id);
      expect(connection.vendor_id).toBe(seller.id);
      expect(connection.channel_id).toBe(order.id.toString());
    }

    const streamClient = StreamChat.getInstance("test-stream-api-key", "test-stream-api-secret") as any;
    expect(streamClient.upsertUsers).toHaveBeenCalledTimes(1);
    expect(streamClient.channel).toHaveBeenCalledWith(
      "messaging",
      order.id.toString(),
      expect.objectContaining({
        members: [buyer.id.toString(), seller.id.toString()],
        created_by_id: buyer.id.toString(),
      }),
    );
  });

  it("POST /chat/:orderId reuses existing channel connection without creating new Stream channel", async () => {
    const seller = await createUser(`chat-seller-${Date.now()}-${Math.random()}`);
    const buyer = await createUser(`chat-buyer-${Date.now()}-${Math.random()}`);
    createdUserIds.push(seller.id, buyer.id);

    const listing = await createListing(seller.id);
    createdListingIds.push(listing.id);

    const order = await createOrder(buyer.id, listing.id);
    createdOrderIds.push(order.id);

    const connection = await prisma.channelConnection.create({
      data: {
        channel_id: `existing-${order.id}`,
        order_id: order.id,
        customer_id: buyer.id,
        vendor_id: seller.id,
      },
    });
    createdChannelConnectionIds.push(connection.id);

    const token = makeAccessToken(seller.id);
    const response = await request(app)
      .post(`/chat/${order.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ channelId: `existing-${order.id}` });

    const streamClient = StreamChat.getInstance("test-stream-api-key", "test-stream-api-secret") as any;
    expect(streamClient.upsertUsers).not.toHaveBeenCalled();
    expect(streamClient.channel).not.toHaveBeenCalled();
  });

  it("GET /chat/token returns 401 without token", async () => {
    const response = await request(app).get("/chat/token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("GET /chat/token returns a token when authenticated", async () => {
    const token = makeAccessToken(42);
    const response = await request(app)
      .get("/chat/token")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: "test-stream-token" });
  });

  it("GET /chat/config returns the stream api key", async () => {
    const response = await request(app).get("/chat/config");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ apiKey: process.env.STREAM_API_KEY });
  });
});
