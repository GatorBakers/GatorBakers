import "dotenv/config";
import { PrismaClient } from "./generated/prisma";
import express, { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { validateRegInput, validateLoginInput } from "./src/utils/validation";
import { use } from "react";

const saltRounds = 10;
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = 4000;
const access_secret = process.env.ACCESS_TOKEN_SECRET!;
const refresh_secret = process.env.REFRESH_TOKEN_SECRET!;

if (!access_secret) {
  throw new Error("access_secret is not defined ");
}
if (!refresh_secret) {
  throw new Error("refresh_secret is not defined ");
}

app.use(express.json({ limit: "10mb" })); // Increased for base64 image payloads (revert once AWS S3 upload is implemented)
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

function authenticate(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }
  const token = parts[1];

  try {
    const data = jwt.verify(token, access_secret);
    (req as any).user = data;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

interface tokenData {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

app.post("/refresh", async (req: Request, res: Response) => {
  const refresh_token = req.cookies?.refresh_token;
  if (!refresh_token)
    return res.status(401).json({ message: "No refresh token provided" });

  let data: tokenData;
  try {
    data = jwt.verify(refresh_token, refresh_secret!) as tokenData;
  } catch (err) {
    return res.json({ message: "Invalid or expired refresh token" });
  }

  const db_token = await prisma.token.findUnique({
    where: { user_id: data.id },
  });

  if (!db_token || db_token.token !== refresh_token) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  if (db_token.expired_at < new Date()) {
    await prisma.token.delete({
      where: { user_id: data.id },
    });
    return res.json({ message: "Refresh token expired" });
  }

  const new_refresh_token = jwt.sign(
    { id: data.id, email: data.email },
    refresh_secret,
    { expiresIn: "2d" },
  );

  const access_token = jwt.sign(
    { id: data.id, email: data.email },
    access_secret!,
    { expiresIn: "2h" },
  );

  const new_expired_at = dayjs().add(2, "day").toDate();

  await prisma.token.update({
    where: { user_id: data.id },
    data: {
      token: new_refresh_token,
      expired_at: new_expired_at,
    },
  });

  res.cookie("refresh_token", new_refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });

  res.json({
    access_token,
  });
});

app.post("/logout", async (req: Request, res: Response) => {
  const refresh_token = req.cookies?.refresh_token;
  if (refresh_token) {
    try {
      const data = jwt.verify(refresh_token, refresh_secret!) as tokenData;
      await prisma.token
        .delete({ where: { user_id: data.id } })
        .catch(() => {});
    } catch {
      // Token invalid/expired, still clear cookie
    }
  }
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out" });
});

app.get("/profile", authenticate, async (req: Request, res: Response) => {
  const { id } = (req as any).user;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        account_status: true,
        photo_url: true,
        favorite_bake: true,
        created_at: true,
        search_location: {
          select: { city: true, state: true },
        },
        _count: {
          select: { listings: true, orders: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      account_status: user.account_status,
      photo_url: user.photo_url,
      favorite_bake: user.favorite_bake ?? null,
      created_at: user.created_at,
      city: user.search_location?.city ?? null,
      state: user.search_location?.state ?? null,
      listing_count: user._count.listings,
      order_count: user._count.orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  const result = validateRegInput(req.body);

  if ("error" in result) {
    return res.status(400).json({ message: result.error });
  }

  const { email, password, first_name, last_name } = result.sanitized;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      account_status: "USER",
      first_name,
      last_name,
    },
  });

  const { password: _, ...safeUser } = user;
  res.status(201).json(safeUser);
});

app.post("/login", async (req: Request, res: Response) => {
  const result = validateLoginInput(req.body);
  if ("error" in result) {
    return res.status(400).json({ message: result.error });
  }
  const { email, password } = result.sanitized;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const refresh_token = jwt.sign(
    { id: user.id, email: user.email },
    refresh_secret!,
    { expiresIn: "2d" },
  );
  const expired_at = dayjs().add(2, "day").toDate();

  await prisma.token.upsert({
    where: { user_id: user.id },
    update: { token: refresh_token, expired_at },
    create: { user_id: user.id, token: refresh_token, expired_at },
  });

  const access_token = jwt.sign(
    { id: user.id, email: user.email },
    access_secret!,
    { expiresIn: "2h" },
  );

  // Set refresh token as httpOnly cookie
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });

  res.json({ access_token });
});

app.get("/discovery/listings", async (req: Request, res: Response) => {
  const sortByRaw = req.query.sortBy;
  const sortBy =
    typeof sortByRaw === "string" && sortByRaw.length > 0
      ? sortByRaw
      : "recent";

  let orderBy: any;

  if (sortBy === "popular") {
    orderBy = { pastries_sold: "desc" };
  } else if (sortBy === "recent") {
    orderBy = { created_at: "desc" };
  } else {
    return res
      .status(400)
      .json({ message: 'Invalid sortBy. Allowed values: "recent", "popular"' });
  }

  try {
    const listing = await prisma.listing.findMany({
      orderBy,
      include: {
        user: { select: { first_name: true, last_name: true } },
        location: { select: { city: true, state: true } },
      },
      take: 40,
    });

    return res.status(200).json(listing);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/user/:id/listings", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  try {
    const listings = await prisma.listing.findMany({
      where: {
        user_id: id,
      },
      include: { user: { select: { first_name: true, last_name: true } } },
      orderBy: { created_at: "desc" },
    });
    return res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/my-listings", authenticate, async (req: Request, res: Response) => {
  const { id } = (req as any).user;
  try {
    const listings = await prisma.listing.findMany({
      where: { user_id: id },
      include: { user: { select: { first_name: true, last_name: true } } },
      orderBy: { created_at: "desc" },
    });
    return res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/listing/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: { select: { first_name: true, last_name: true } },
        location: { select: { city: true, state: true } },
      },
    });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    return res.status(200).json(listing);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
});

// TODO [AWS S3]: Add a dedicated image upload endpoint:
//  POST /upload (authenticate) — accepts multipart/form-data with an image file.
//  1. npm install @aws-sdk/client-s3 multer
//  2. Use multer for multipart parsing, then PutObjectCommand to upload to S3.
//  3. Return { url: "https://<bucket>.s3.<region>.amazonaws.com/<key>" }.
//  4. The client calls this endpoint first, then passes the returned URL as photo_url
//     in the POST /listing body (instead of a base64 data URL).
//  5. Update the Listing photo_url column to store the S3 URL (no schema change needed,
//     just shorter strings). Consider adding a DELETE /upload/:key for cleanup.

app.post("/listing", authenticate, async (req: Request, res: Response) => {
  const { id: user_id } = (req as any).user;
  const {
    title,
    description,
    price,
    quantity,
    photo_url,
    ingredients,
    allergens,
  } = req.body;

  // Validate required fields
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!description || typeof description !== "string" || !description.trim()) {
    return res.status(400).json({ message: "Description is required" });
  }
  if (price === undefined || price === null) {
    return res.status(400).json({ message: "Price is required" });
  }
  const priceStr = String(price).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(priceStr)) {
    return res.status(400).json({
      message:
        "Price must be a non-negative number with up to 2 decimal places",
    });
  }
  const parsedInventory = quantity !== undefined ? Number(quantity) : 1;
  if (
    isNaN(parsedInventory) ||
    parsedInventory < 0 ||
    !Number.isInteger(parsedInventory)
  ) {
    return res
      .status(400)
      .json({ message: "Inventory must be a non-negative integer" });
  }
  // TODO [AWS S3]: Once photo_url stores an S3 URL, tighten MAX_PHOTO_URL_LENGTH to ~500 chars.
  // For now it matches the Express body limit so base64 data URLs are accepted during the interim.
  const MAX_PHOTO_URL_LENGTH = 10 * 1024 * 1024; // 10 MB expressed as character count
  if (photo_url !== undefined && photo_url !== "") {
    if (typeof photo_url !== "string") {
      return res.status(400).json({ message: "photo_url must be a string" });
    }
    if (photo_url.length > MAX_PHOTO_URL_LENGTH) {
      return res
        .status(400)
        .json({ message: "photo_url exceeds maximum allowed size" });
    }
  }
  if (ingredients !== undefined) {
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ message: "Ingredients must be an array" });
    }
    if (!ingredients.every((item: unknown) => typeof item === "string")) {
      return res
        .status(400)
        .json({ message: "Each ingredient must be a string" });
    }
  }
  if (allergens !== undefined) {
    if (!Array.isArray(allergens)) {
      return res.status(400).json({ message: "Allergens must be an array" });
    }
    if (!allergens.every((item: unknown) => typeof item === "string")) {
      return res
        .status(400)
        .json({ message: "Each allergen must be a string" });
    }
  }

  const normalizedIngredients: string[] = (ingredients ?? [])
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);
  const normalizedAllergens: string[] = (allergens ?? [])
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);

  try {
    const new_listing = await prisma.listing.create({
      data: {
        user_id,
        title: title.trim(),
        description: description.trim(),
        price: priceStr,
        quantity: parsedInventory,
        listing_status: "AVAILABLE",
        photo_url: photo_url || "",
        ingredients: normalizedIngredients,
        allergens: normalizedAllergens,
      },
      include: { user: { select: { first_name: true, last_name: true } } },
    });
    return res.status(201).json(new_listing);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.patch("/listing/:id", async (req: Request, res: Response) => {
  // TODO: Add funcitonality for updating locations model
  const id = Number(req.params.id);
  const updateData: any = {};

  const inventoryInput = req.body.quantity;

  if (req.body.title !== undefined) updateData.title = req.body.title;

  if (req.body.description !== undefined)
    updateData.description = req.body.description;

  if (req.body.price !== undefined)
    updateData.price = req.body.price.toString();

  if (inventoryInput !== undefined) {
    const parsedInventory = Number(inventoryInput);
    if (
      isNaN(parsedInventory) ||
      parsedInventory < 0 ||
      !Number.isInteger(parsedInventory)
    ) {
      return res
        .status(400)
        .json({ message: "Inventory must be a non-negative integer" });
    }
    updateData.quantity = parsedInventory;
  }

  if (req.body.photo_url !== undefined)
    updateData.photo_url = req.body.photo_url;

  if (req.body.listing_status !== undefined)
    updateData.listing_status = req.body.listing_status;

  if (!id || isNaN(id)) {
    return res.json({ message: "Invalid listing id" });
  }
  try {
    const updated_listing = await prisma.listing.update({
      where: { id },
      data: updateData,
    });
    res.json(updated_listing);
  } catch (error) {
    res.json({ message: "Server error", error });
  }
});

app.delete("/listing/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    return res.json({ message: "Invalid listing id" });
  }
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
    });

    if (!listing) {
      return res.json({ message: "Listing not found" });
    }

    await prisma.listing.delete({
      where: { id },
    });
    res.json("Deleted!");
  } catch {
    res.json("Server Error");
  }
});

app.post("/listing/:id/order", async (req: Request, res: Response) => {
  const listing_id = Number(req.params.id);
  const user_id = Number(req.body.user_id);
  const pickup_location = req.body.pickup_location;
  const pickup_time = req.body.pickup_time;

  if (!listing_id || isNaN(listing_id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }
  if (!pickup_location || typeof pickup_location !== "string") {
    return res.status(400).json({ message: "Pickup location is required" });
  }
  if (!pickup_time || typeof pickup_time !== "string") {
    return res.status(400).json({ message: "Pickup time is required" });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listing_id },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing does not exist" });
    }

    if (listing.user_id == user_id) {
      return res
        .status(400)
        .json({ message: "User is the owner of the listing" });
    }

    if (listing.quantity < 1) {
      await prisma.listing.update({
        where: { id: listing_id },
        data: {
          quantity: 0,
          listing_status: "SOLD",
        },
      });

      return res.status(410).json({ message: "Pastry is sold out!" });
    }

    await prisma.listing.update({
      where: { id: listing_id },
      data: {
        quantity: listing.quantity - 1,
        pastries_sold: listing.pastries_sold + 1,
      },
    });

    const order = await prisma.order.create({
      data: {
        user_id,
        listing_id,
        status: "PENDING",
        pickup_location,
        pickup_time,
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.patch("/order/:id", async (req: Request, res: Response) => {
  const order_id = Number(req.params.id);
  const { status } = req.body;
  const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

  if (!order_id || isNaN(order_id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: order_id,
      },
    });
    if (!order) {
      return res.status(404).json({ message: "Order does not exist" });
    }
    const updated_order = await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status,
      },
    });
    return res.status(200).json(updated_order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/orders/user/:id", async (req: Request, res: Response) => {
  const user_id = Number(req.params.id);

  if (isNaN(user_id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { user_id },
      select: {
        id: true,
        created_at: true,
        pickup_location: true,
        pickup_time: true,
        status: true,
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            quantity: true,
            listing_status: true,
            photo_url: true,
            ingredients: true,
            allergens: true,
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/orders/seller/:id", async (req: Request, res: Response) => {
  const seller_id = Number(req.params.id);

  if (isNaN(seller_id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  try {
    const orders = await prisma.order.findMany({
      where: { listing: { user_id: seller_id } },
      select: {
        id: true,
        created_at: true,
        pickup_location: true,
        pickup_time: true,
        status: true,
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            quantity: true,
            listing_status: true,
            photo_url: true,
            ingredients: true,
            allergens: true,
          },
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    const pending_orders = orders.filter(o => o.status === "PENDING");
    const confirmed_orders = orders.filter(o =>
      ["CONFIRMED", "COMPLETED"].includes(o.status),
    );
    const cancelled_orders = orders.filter(o => o.status === "CANCELLED");

    return res
      .status(200)
      .json({ pending_orders, confirmed_orders, cancelled_orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
