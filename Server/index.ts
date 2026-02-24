import "dotenv/config";
import { PrismaClient } from "./generated/prisma";
import express, { Request, Response } from "express";
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
const private_key = process.env.PRIVATE_KEY;

if (!private_key) {
  throw new Error("PRIVATE_KEY is not defined ");
}

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
    private_key!,
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
    private_key!,
    { expiresIn: "2h" },
  );
  // TODO: Send access token as a HTTP cookie for more security
  res.json(access_token);
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
