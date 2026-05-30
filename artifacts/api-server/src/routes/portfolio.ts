import { Router } from "express";
import { db } from "@workspace/db";
import { walletsTable, transactionsTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { GetPortfolioHistoryQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/portfolio/summary", async (_req, res) => {
  const wallets = await db.select().from(walletsTable);
  const totalValueUsd = wallets.reduce((sum, w) => sum + (w.totalValueUsd ? parseFloat(w.totalValueUsd) : 0), 0);
  const avgChange = wallets.length
    ? wallets.reduce((sum, w) => sum + (w.change24hPercent ? parseFloat(w.change24hPercent) : 0), 0) / wallets.length
    : 0;
  const change24hUsd = (totalValueUsd * avgChange) / 100;
  const [txCount] = await db.select({ count: count() }).from(transactionsTable);
  const networks = new Set(wallets.map((w) => w.networkId));

  return res.json({
    totalValueUsd: parseFloat(totalValueUsd.toFixed(2)),
    change24hUsd: parseFloat(change24hUsd.toFixed(2)),
    change24hPercent: parseFloat(avgChange.toFixed(4)),
    topAsset: "ETH",
    walletCount: wallets.length,
    networkCount: networks.size,
    totalTransactions: txCount?.count || 0,
  });
});

router.get("/portfolio/history", async (req, res) => {
  const parsed = GetPortfolioHistoryQueryParams.safeParse({ period: req.query.period || "7d" });
  if (!parsed.success) return res.status(400).json({ error: "Invalid params" });

  const periodMap: Record<string, number> = { "1d": 1, "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = periodMap[parsed.data.period || "7d"] || 7;
  const wallets = await db.select().from(walletsTable);
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

  return res.json(points);
});

export default router;
