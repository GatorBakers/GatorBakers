import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../index";

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

describe("orders routes auth integration", () => {
  it("GET /orders/user/:id returns 401 without token", async () => {
    const response = await request(app).get("/orders/user/1");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("GET /orders/seller/:id returns 401 without token", async () => {
    const response = await request(app).get("/orders/seller/1");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("GET /orders/user/:id returns 403 when token user id mismatches route id", async () => {
    const token = makeAccessToken(10);
    const response = await request(app)
      .get("/orders/user/11")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Forbidden: you can only access your own order data",
    });
  });

  it("GET /orders/seller/:id returns 403 when token user id mismatches route id", async () => {
    const token = makeAccessToken(10);
    const response = await request(app)
      .get("/orders/seller/11")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Forbidden: you can only access your own order data",
    });
  });
});
