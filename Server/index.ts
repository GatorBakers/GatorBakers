import "dotenv/config";
import { PrismaClient } from "./generated/prisma";
import express, { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { validateRegInput } from "./src/utils/validation";

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

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

function authenticate(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ message: "No token provided" });
  }
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.json({ message: "Invalid token format" });
  }
  const token = parts[1];

  try {
    const data = jwt.verify(token, access_secret);
    (req as any).user = data;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.json({ message: "Token expired" });
    }
    return res.json({ message: "Invalid token" });
  }
}

interface tokenData {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

app.post("/refresh", async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.json({ message: "No refresh token provided" });

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

  res.json({
    access_token,
    refresh_token: new_refresh_token,
  });
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
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.json("Invalid username or password");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.json("Invalid username or password");
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

  // TODO: Send access token as a HTTP cookie for more security
  res.json({ access_token, refresh_token });
});

app.get("/user/:id/listings", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }
  try {
    const listings = await prisma.listing.findMany({
      where: {
        user_id: id,
      },
    });
    return res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.post("/listing", async (req: Request, res: Response) => {
  const {
    user_id,
    title,
    description,
    price,
    remaining_inventory,
    listing_status,
    photo_url,
    location,
  } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });
  if (!user) {
    return res.json("User not found");
  }

  try {
    const new_listing = await prisma.listing.create({
      data: {
        user_id,
        title,
        description,
        price,
        remaining_inventory,
        listing_status,
        photo_url,
      },
    });
    res.json(new_listing);
  } catch {
    res.json("Server error");
  }
});

app.patch("/listing/:id", async (req: Request, res: Response) => {
  // TODO: Add funcitonality for updating locations model
  const id = Number(req.params.id);
  const updateData: any = {};

  if (req.body.title !== undefined) updateData.title = req.body.title;

  if (req.body.description !== undefined)
    updateData.description = req.body.description;

  if (req.body.price !== undefined)
    updateData.price = req.body.price.toString();

  if (req.body.remaining_inventory !== undefined)
    updateData.remaining_inventory = Number(req.body.remaining_inventory);

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
  const { user_id } = req.body;

  if (!listing_id || isNaN(listing_id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listing_id },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing does not exist" });
    }

    if (listing.user_id == user_id) {
      return res.status(404).json({ message: "User is the owner of the listing" });
    }

    if (listing.remaining_inventory < 1) {
      await prisma.listing.update({
        where: { id: listing_id },
        data: {
          remaining_inventory: 0,
          listing_status: "SOLD",
        },
      });

      return res.status(410).json({ message: "Pastry is sold out!" });
    }

    await prisma.listing.update({
      where: { id: listing_id },
      data: {
        remaining_inventory: listing.remaining_inventory - 1,
      },
    });

    const order = await prisma.order.create({
      data: {
        user_id,
        listing_id,
        status: "PENDING",
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
