import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { transactionsTable, walletsTable } from "@workspace/db";
import { eq, desc, inArray } from "drizzle-orm";
import { GetRecentActivityQueryParams } from "@workspace/api-zod";
import { requireAuth, AuthRequest } from "../middleware/requireAuth.js";

const router = Router();

const typeIconMap: Record<string, string> = {
  send: "arrow-up-right",
  receive: "arrow-down-left",
  swap: "arrow-left-right",
  contract: "file-code",
  nft: "image",
};

router.get("/activity", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parsed = GetRecentActivityQueryParams.safeParse({
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
  });
  if (!parsed.success) { res.status(400).json({ error: "Invalid params" }); return; }

  const limit = parsed.data.limit || 20;

  const userWallets = await db
    .select({ id: walletsTable.id })
    .from(walletsTable)
    .where(eq(walletsTable.userId, userId));
  const walletIds = userWallets.map((w) => w.id);

  if (walletIds.length === 0) {
    res.json([]);
    return;
  }

  const txs = await db
    .select({ tx: transactionsTable, walletName: walletsTable.name })
    .from(transactionsTable)
    .leftJoin(walletsTable, eq(transactionsTable.walletId, walletsTable.id))
    .where(inArray(transactionsTable.walletId, walletIds))
    .orderBy(desc(transactionsTable.createdAt))
    .limit(limit);

  const items = txs.map(({ tx, walletName }) => {
    const valueUsd = parseFloat(tx.valueUsd);
    let title = "";
    let subtitle = "";

    const fmt = (n: string | null) => {
      if (!n) return "?";
      const v = parseFloat(n);
      return v < 0.01 ? v.toFixed(6) : v < 1000 ? v.toFixed(4) : v.toFixed(2);
    };
    if (tx.type === "send") {
      title = `Sent ${fmt(tx.amount)} ${tx.tokenSymbol}`;
      subtitle = `To ${tx.toAddress.slice(0, 6)}...${tx.toAddress.slice(-4)}`;
    } else if (tx.type === "receive") {
      title = `Received ${fmt(tx.amount)} ${tx.tokenSymbol}`;
      subtitle = `From ${tx.fromAddress.slice(0, 6)}...${tx.fromAddress.slice(-4)}`;
    } else if (tx.type === "swap") {
      title = `Swapped ${fmt(tx.amount)} ${tx.tokenSymbol}`;
      subtitle = `For ${fmt(tx.toAmount)} ${tx.toTokenSymbol || ""}`;
    } else {
      title = `Contract interaction`;
      subtitle = tx.tokenSymbol;
    }

    return {
      id: tx.id,
      type: tx.type,
      title,
      subtitle,
      valueUsd,
      timestamp: tx.createdAt.toISOString(),
      status: tx.status,
      icon: typeIconMap[tx.type] || "circle",
      walletName: walletName || "Unknown",
    };
  });

  res.json(items);
});

export default router;
