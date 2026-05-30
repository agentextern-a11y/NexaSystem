import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken } from "../lib/auth.js";
import { requireAuth, AuthRequest } from "../middleware/requireAuth.js";

const router = Router();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/auth/register", async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !isValidEmail(email)) {
    res.status(400).json({ error: "A valid email address is required" });
    return;
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (existing.length > 0) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ email: email.toLowerCase(), passwordHash })
    .returning();

  const token = signToken(user.id);
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, createdAt: user.createdAt.toISOString() },
  });
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, createdAt: user.createdAt.toISOString() },
  });
});

router.get("/auth/me", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, email: user.email, createdAt: user.createdAt.toISOString() });
});

export default router;
