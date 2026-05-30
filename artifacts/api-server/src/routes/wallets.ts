import { Router } from "express";
import { db } from "@workspace/db";
import { walletsTable, tokenHoldingsTable, transactionsTable, nftsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  GetWalletParams,
  UpdateWalletParams,
  UpdateWalletBody,
  DeleteWalletParams,
  GetWalletTokensParams,
  SendTransactionParams,
  SendTransactionBody,
  SwapTokensParams,
  SwapTokensBody,
  GetWalletNftsParams,
  CreateWalletBody,
} from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router = Router();

function randomEthAddress(): string {
  return "0x" + randomBytes(20).toString("hex");
}

function randomTxHash(): string {
  return "0x" + randomBytes(32).toString("hex");
}

router.get("/wallets", async (_req, res) => {
  const wallets = await db.select().from(walletsTable).orderBy(desc(walletsTable.createdAt));
  res.json(
    wallets.map((w) => ({
      ...w,
      totalValueUsd: w.totalValueUsd ? parseFloat(w.totalValueUsd) : null,
      change24hPercent: w.change24hPercent ? parseFloat(w.change24hPercent) : null,
      createdAt: w.createdAt.toISOString(),
    })),
  );
});

router.post("/wallets", async (req, res) => {
  const parsed = CreateWalletBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { name, networkId, color, importedAddress } = parsed.data;
  const address = importedAddress || randomEthAddress();
  const [wallet] = await db
    .insert(walletsTable)
    .values({ name, networkId, color: color || "#627EEA", address })
    .returning();
  return res.status(201).json({
    ...wallet,
    totalValueUsd: wallet.totalValueUsd ? parseFloat(wallet.totalValueUsd) : null,
    change24hPercent: wallet.change24hPercent ? parseFloat(wallet.change24hPercent) : null,
    createdAt: wallet.createdAt.toISOString(),
  });
});

router.get("/wallets/:walletId", async (req, res) => {
  const parsed = GetWalletParams.safeParse({ walletId: parseInt(req.params.walletId) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid wallet ID" });
  const [wallet] = await db.select().from(walletsTable).where(eq(walletsTable.id, parsed.data.walletId));
  if (!wallet) return res.status(404).json({ error: "Wallet not found" });
  return res.json({
    ...wallet,
    totalValueUsd: wallet.totalValueUsd ? parseFloat(wallet.totalValueUsd) : null,
    change24hPercent: wallet.change24hPercent ? parseFloat(wallet.change24hPercent) : null,
    createdAt: wallet.createdAt.toISOString(),
  });
});

router.patch("/wallets/:walletId", async (req, res) => {
  const parParsed = UpdateWalletParams.safeParse({ walletId: parseInt(req.params.walletId) });
  const bodyParsed = UpdateWalletBody.safeParse(req.body);
  if (!parParsed.success || !bodyParsed.success) return res.status(400).json({ error: "Invalid input" });
  const [wallet] = await db
    .update(walletsTable)
    .set(bodyParsed.data)
    .where(eq(walletsTable.id, parParsed.data.walletId))
    .returning();
  if (!wallet) return res.status(404).json({ error: "Wallet not found" });
  return res.json({
    ...wallet,
    totalValueUsd: wallet.totalValueUsd ? parseFloat(wallet.totalValueUsd) : null,
    change24hPercent: wallet.change24hPercent ? parseFloat(wallet.change24hPercent) : null,
    createdAt: wallet.createdAt.toISOString(),
  });
});

router.delete("/wallets/:walletId", async (req, res) => {
  const parsed = DeleteWalletParams.safeParse({ walletId: parseInt(req.params.walletId) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid wallet ID" });
  await db.delete(walletsTable).where(eq(walletsTable.id, parsed.data.walletId));
  return res.status(204).send();
});

router.get("/wallets/:walletId/tokens", async (req, res) => {
  const parsed = GetWalletTokensParams.safeParse({ walletId: parseInt(req.params.walletId) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid wallet ID" });
  const holdings = await db
    .select()
    .from(tokenHoldingsTable)
    .where(eq(tokenHoldingsTable.walletId, parsed.data.walletId));
  return res.json(
    holdings.map((h) => ({
      ...h,
      balance: parseFloat(h.balance),
      valueUsd: parseFloat(h.valueUsd),
      priceUsd: parseFloat(h.priceUsd),
      change24hPercent: parseFloat(h.change24hPercent),
    })),
  );
});

router.post("/wallets/:walletId/send", async (req, res) => {
  const parParsed = SendTransactionParams.safeParse({ walletId: parseInt(req.params.walletId) });
  const bodyParsed = SendTransactionBody.safeParse(req.body);
  if (!parParsed.success || !bodyParsed.success) return res.status(400).json({ error: "Invalid input" });
  const wallet = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.id, parParsed.data.walletId))
    .then((r) => r[0]);
  if (!wallet) return res.status(404).json({ error: "Wallet not found" });
  const { toAddress, amount, tokenSymbol, note } = bodyParsed.data;
  const priceEstimate = tokenSymbol === "ETH" ? 3200 : tokenSymbol === "BTC" ? 62000 : 1;
  const valueUsd = amount * priceEstimate;
  const [tx] = await db
    .insert(transactionsTable)
    .values({
      walletId: parParsed.data.walletId,
      type: "send",
      status: "confirmed",
      fromAddress: wallet.address,
      toAddress,
      amount: amount.toString(),
      tokenSymbol,
      valueUsd: valueUsd.toFixed(2),
      networkId: wallet.networkId,
      hash: randomTxHash(),
      gasFeeEth: "0.0012",
      gasFeeUsd: "3.84",
      note: note || null,
    })
    .returning();
  return res.status(201).json({
    ...tx,
    amount: parseFloat(tx.amount),
    toAmount: tx.toAmount ? parseFloat(tx.toAmount) : null,
    valueUsd: parseFloat(tx.valueUsd),
    gasFeeEth: tx.gasFeeEth ? parseFloat(tx.gasFeeEth) : null,
    gasFeeUsd: tx.gasFeeUsd ? parseFloat(tx.gasFeeUsd) : null,
    createdAt: tx.createdAt.toISOString(),
  });
});

router.post("/wallets/:walletId/swap", async (req, res) => {
  const parParsed = SwapTokensParams.safeParse({ walletId: parseInt(req.params.walletId) });
  const bodyParsed = SwapTokensBody.safeParse(req.body);
  if (!parParsed.success || !bodyParsed.success) return res.status(400).json({ error: "Invalid input" });
  const wallet = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.id, parParsed.data.walletId))
    .then((r) => r[0]);
  if (!wallet) return res.status(404).json({ error: "Wallet not found" });
  const { fromTokenSymbol, toTokenSymbol, amount } = bodyParsed.data;
  const priceFrom = fromTokenSymbol === "ETH" ? 3200 : fromTokenSymbol === "BTC" ? 62000 : 1;
  const priceTo = toTokenSymbol === "ETH" ? 3200 : toTokenSymbol === "BTC" ? 62000 : 1;
  const valueUsd = amount * priceFrom;
  const toAmount = valueUsd / priceTo;
  const [tx] = await db
    .insert(transactionsTable)
    .values({
      walletId: parParsed.data.walletId,
      type: "swap",
      status: "confirmed",
      fromAddress: wallet.address,
      toAddress: wallet.address,
      amount: amount.toString(),
      tokenSymbol: fromTokenSymbol,
      toTokenSymbol,
      toAmount: toAmount.toFixed(8),
      valueUsd: valueUsd.toFixed(2),
      networkId: wallet.networkId,
      hash: randomTxHash(),
      gasFeeEth: "0.002",
      gasFeeUsd: "6.40",
    })
    .returning();
  return res.status(201).json({
    ...tx,
    amount: parseFloat(tx.amount),
    toAmount: tx.toAmount ? parseFloat(tx.toAmount) : null,
    valueUsd: parseFloat(tx.valueUsd),
    gasFeeEth: tx.gasFeeEth ? parseFloat(tx.gasFeeEth) : null,
    gasFeeUsd: tx.gasFeeUsd ? parseFloat(tx.gasFeeUsd) : null,
    createdAt: tx.createdAt.toISOString(),
  });
});

router.get("/wallets/:walletId/nfts", async (req, res) => {
  const parsed = GetWalletNftsParams.safeParse({ walletId: parseInt(req.params.walletId) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid wallet ID" });
  const nfts = await db.select().from(nftsTable).where(eq(nftsTable.walletId, parsed.data.walletId));
  return res.json(
    nfts.map((n) => ({
      ...n,
      floorPriceEth: n.floorPriceEth ? parseFloat(n.floorPriceEth) : null,
      floorPriceUsd: n.floorPriceUsd ? parseFloat(n.floorPriceUsd) : null,
    })),
  );
});

export default router;
