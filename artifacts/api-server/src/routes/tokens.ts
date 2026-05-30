import { Router } from "express";
import { db } from "@workspace/db";
import { tokensTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetTokenParams } from "@workspace/api-zod";

const router = Router();

router.get("/tokens", async (_req, res) => {
  const tokens = await db.select().from(tokensTable);
  return res.json(
    tokens.map((t) => ({
      ...t,
      priceUsd: parseFloat(t.priceUsd),
      change24hPercent: parseFloat(t.change24hPercent),
      marketCapUsd: parseFloat(t.marketCapUsd),
      volume24hUsd: parseFloat(t.volume24hUsd),
    })),
  );
});

router.get("/tokens/:symbol", async (req, res) => {
  const parsed = GetTokenParams.safeParse({ symbol: req.params.symbol });
  if (!parsed.success) return res.status(400).json({ error: "Invalid symbol" });
  const [token] = await db.select().from(tokensTable).where(eq(tokensTable.symbol, parsed.data.symbol.toUpperCase()));
  if (!token) return res.status(404).json({ error: "Token not found" });
  return res.json({
    ...token,
    priceUsd: parseFloat(token.priceUsd),
    change24hPercent: parseFloat(token.change24hPercent),
    marketCapUsd: parseFloat(token.marketCapUsd),
    volume24hUsd: parseFloat(token.volume24hUsd),
  });
});

export default router;
