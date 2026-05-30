import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { walletsTable, transactionsTable } from "@workspace/db";
import { eq, count, inArray } from "drizzle-orm";
import { GetPortfolioHistoryQueryParams } from "@workspace/api-zod";
import { requireAuth, AuthRequest } from "../middleware/requireAuth.js";

const router = Router();

router.get("/portfolio/summary", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const wallets = await db.select().from(walletsTable).where(eq(walletsTable.userId, userId));
  const totalValueUsd = wallets.reduce((sum, w) => sum + (w.totalValueUsd ? parseFloat(w.totalValueUsd) : 0), 0);
  const avgChange = wallets.length
    ? wallets.reduce((sum, w) => sum + (w.change24hPercent ? parseFloat(w.change24hPercent) : 0), 0) / wallets.length
    : 0;
  const change24hUsd = (totalValueUsd * avgChange) / 100;

  const walletIds = wallets.map((w) => w.id);
  let txCount = 0;
  if (walletIds.length > 0) {
    const [row] = await db
      .select({ count: count() })
      .from(transactionsTable)
      .where(inArray(transactionsTable.walletId, walletIds));
    txCount = row?.count || 0;
  }
  const networks = new Set(wallets.map((w) => w.networkId));

  res.json({
    totalValueUsd: parseFloat(totalValueUsd.toFixed(2)),
    change24hUsd: parseFloat(change24hUsd.toFixed(2)),
    change24hPercent: parseFloat(avgChange.toFixed(4)),
    topAsset: "ETH",
    walletCount: wallets.length,
    networkCount: networks.size,
    totalTransactions: txCount,
  });
});

router.get("/portfolio/history", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parsed = GetPortfolioHistoryQueryParams.safeParse({ period: req.query.period || "7d" });
  if (!parsed.success) { res.status(400).json({ error: "Invalid params" }); return; }

  const periodMap: Record<string, number> = { "1d": 1, "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = periodMap[parsed.data.period || "7d"] || 7;
  const wallets = await db.select().from(walletsTable).where(eq(walletsTable.userId, userId));
  const baseValue = wallets.reduce((sum, w) => sum + (w.totalValueUsd ? parseFloat(w.totalValueUsd) : 0), 0);

  const points = [];
  const now = Date.now();
  const stepMs = (days * 24 * 60 * 60 * 1000) / Math.min(days * 4, 100);
  let value = baseValue * 0.75;

  for (let i = 0; i <= Math.min(days * 4, 100); i++) {
    const timestamp = new Date(now - (Math.min(days * 4, 100) - i) * stepMs);
    const noise = (Math.random() - 0.45) * (baseValue * 0.02);
    value = Math.max(value + noise, baseValue * 0.5);
    if (i === Math.min(days * 4, 100)) value = baseValue;
    points.push({ timestamp: timestamp.toISOString(), valueUsd: parseFloat(value.toFixed(2)) });
  }

  res.json(points);
});

export default router;
