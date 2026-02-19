import { PrismaClient } from "./generated/prisma";
import express, { Request, Response } from "express";
import cors from "cors";

const prisma = new PrismaClient();
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
});
