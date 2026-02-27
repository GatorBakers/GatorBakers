import "dotenv/config";
import { PrismaClient } from "./generated/prisma";
import express, { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

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

  const access_token = jwt.sign(
    { id: data.id, email: data.email },
    access_secret!,
    { expiresIn: "2h" },
  );

  res.json({ access_token });
});

app.post("/register", async (req: Request, res: Response) => {
  const { email, password, first_name, last_name } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      account_status: "USER",
      first_name: first_name,
      last_name: last_name,
    },
  });
  // TODO Add a try/catch statement for accounts that were created already.
  res.json(user);
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

app.listen(PORT, () => console.log("Server running on port " + PORT));
