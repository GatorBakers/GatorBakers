import "dotenv/config";
import { PrismaClient } from "./generated/prisma";
import express, { Request, Response } from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import bcrypt from "bcrypt";

const saltRounds = 10;
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = 4000;

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
  res.json(user);
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
