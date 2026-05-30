import { Router } from "express";
import { db } from "@workspace/db";
import { transactionsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { ListTransactionsQueryParams, GetTransactionParams } from "@workspace/api-zod";

const router = Router();

router.get("/transactions", async (req, res) => {
  const parsed = ListTransactionsQueryParams.safeParse({
    walletId: req.query.walletId ? parseInt(req.query.walletId as string) : undefined,
    type: req.query.type || undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
  });
  if (!parsed.success) return res.status(400).json({ error: "Invalid query params" });

  const conditions = [];
  if (parsed.data.walletId) conditions.push(eq(transactionsTable.walletId, parsed.data.walletId));
  if (parsed.data.type) conditions.push(eq(transactionsTable.type, parsed.data.type as "send" | "receive" | "swap" | "contract"));

  const query = db
    .select()
    .from(transactionsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(transactionsTable.createdAt))
    .limit(parsed.data.limit || 100);

  const txs = await query;
  return res.json(
    txs.map((tx) => ({
      ...tx,
      amount: parseFloat(tx.amount),
      toAmount: tx.toAmount ? parseFloat(tx.toAmount) : null,
      valueUsd: parseFloat(tx.valueUsd),
      gasFeeEth: tx.gasFeeEth ? parseFloat(tx.gasFeeEth) : null,
      gasFeeUsd: tx.gasFeeUsd ? parseFloat(tx.gasFeeUsd) : null,
      createdAt: tx.createdAt.toISOString(),
    })),
  );
});

router.get("/transactions/:txId", async (req, res) => {
  const parsed = GetTransactionParams.safeParse({ txId: parseInt(req.params.txId) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid tx ID" });
  const [tx] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, parsed.data.txId));
  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  return res.json({
    ...tx,
    amount: parseFloat(tx.amount),
    toAmount: tx.toAmount ? parseFloat(tx.toAmount) : null,
    valueUsd: parseFloat(tx.valueUsd),
    gasFeeEth: tx.gasFeeEth ? parseFloat(tx.gasFeeEth) : null,
    gasFeeUsd: tx.gasFeeUsd ? parseFloat(tx.gasFeeUsd) : null,
    createdAt: tx.createdAt.toISOString(),
  });
});

export default router;
