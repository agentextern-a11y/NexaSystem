import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { walletsTable, tokenHoldingsTable, transactionsTable, nftsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { Wallet as EthersWallet } from "ethers";
import { randomBytes } from "crypto";
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
import { requireAuth, AuthRequest } from "../middleware/requireAuth.js";
import { encryptPrivateKey, decryptPrivateKey } from "../lib/auth.js";

const router = Router();

function randomTxHash(): string {
  return "0x" + randomBytes(32).toString("hex");
}

function generateRealWallet(): { address: string; privateKey: string } {
  const wallet = EthersWallet.createRandom();
  return { address: wallet.address, privateKey: wallet.privateKey };
}

function serializeWallet(w: typeof walletsTable.$inferSelect) {
  return {
    id: w.id,
    name: w.name,
    address: w.address,
    networkId: w.networkId,
    color: w.color,
    totalValueUsd: w.totalValueUsd ? parseFloat(w.totalValueUsd) : null,
    change24hPercent: w.change24hPercent ? parseFloat(w.change24hPercent) : null,
    createdAt: w.createdAt.toISOString(),
    hasPrivateKey: !!w.encryptedPrivateKey,
  };
}

router.get("/wallets", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const wallets = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.userId, userId))
    .orderBy(desc(walletsTable.createdAt));
  res.json(wallets.map(serializeWallet));
});

router.post("/wallets", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parsed = CreateWalletBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { name, networkId, color, importedAddress } = parsed.data;

  let address: string;
  let encryptedPrivateKey: string | null = null;

  if (importedAddress) {
    address = importedAddress;
  } else {
    const generated = generateRealWallet();
    address = generated.address;
    encryptedPrivateKey = encryptPrivateKey(generated.privateKey);
  }

  const [wallet] = await db
    .insert(walletsTable)
    .values({ name, networkId, color: color || "#627EEA", address, userId, encryptedPrivateKey })
    .returning();
  res.status(201).json(serializeWallet(wallet));
});

router.get("/wallets/:walletId", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parsed = GetWalletParams.safeParse({ walletId: parseInt(req.params.walletId) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid wallet ID" }); return; }
  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.id, parsed.data.walletId), eq(walletsTable.userId, userId)));
  if (!wallet) { res.status(404).json({ error: "Wallet not found" }); return; }
  res.json(serializeWallet(wallet));
});

router.get("/wallets/:walletId/private-key", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const walletId = parseInt(req.params.walletId);
  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.id, walletId), eq(walletsTable.userId, userId)));
  if (!wallet) { res.status(404).json({ error: "Wallet not found" }); return; }
  if (!wallet.encryptedPrivateKey) { res.status(404).json({ error: "No private key stored for this wallet" }); return; }
  const privateKey = decryptPrivateKey(wallet.encryptedPrivateKey);
  res.json({ privateKey, address: wallet.address });
});

router.patch("/wallets/:walletId", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parParsed = UpdateWalletParams.safeParse({ walletId: parseInt(req.params.walletId) });
  const bodyParsed = UpdateWalletBody.safeParse(req.body);
  if (!parParsed.success || !bodyParsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [wallet] = await db
    .update(walletsTable)
    .set(bodyParsed.data)
    .where(and(eq(walletsTable.id, parParsed.data.walletId), eq(walletsTable.userId, userId)))
    .returning();
  if (!wallet) { res.status(404).json({ error: "Wallet not found" }); return; }
  res.json(serializeWallet(wallet));
});

router.delete("/wallets/:walletId", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parsed = DeleteWalletParams.safeParse({ walletId: parseInt(req.params.walletId) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid wallet ID" }); return; }
  await db
    .delete(walletsTable)
    .where(and(eq(walletsTable.id, parsed.data.walletId), eq(walletsTable.userId, userId)));
  res.status(204).send();
});

router.get("/wallets/:walletId/tokens", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parsed = GetWalletTokensParams.safeParse({ walletId: parseInt(req.params.walletId) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid wallet ID" }); return; }
  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.id, parsed.data.walletId), eq(walletsTable.userId, userId)));
  if (!wallet) { res.status(404).json({ error: "Wallet not found" }); return; }
  const holdings = await db
    .select()
    .from(tokenHoldingsTable)
    .where(eq(tokenHoldingsTable.walletId, parsed.data.walletId));
  res.json(
    holdings.map((h) => ({
      ...h,
      balance: parseFloat(h.balance),
      valueUsd: parseFloat(h.valueUsd),
      priceUsd: parseFloat(h.priceUsd),
      change24hPercent: parseFloat(h.change24hPercent),
    })),
  );
});

router.post("/wallets/:walletId/send", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parParsed = SendTransactionParams.safeParse({ walletId: parseInt(req.params.walletId) });
  const bodyParsed = SendTransactionBody.safeParse(req.body);
  if (!parParsed.success || !bodyParsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.id, parParsed.data.walletId), eq(walletsTable.userId, userId)));
  if (!wallet) { res.status(404).json({ error: "Wallet not found" }); return; }
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
  res.status(201).json({
    ...tx,
    amount: parseFloat(tx.amount),
    toAmount: tx.toAmount ? parseFloat(tx.toAmount) : null,
    valueUsd: parseFloat(tx.valueUsd),
    gasFeeEth: tx.gasFeeEth ? parseFloat(tx.gasFeeEth) : null,
    gasFeeUsd: tx.gasFeeUsd ? parseFloat(tx.gasFeeUsd) : null,
    createdAt: tx.createdAt.toISOString(),
  });
});

router.post("/wallets/:walletId/swap", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parParsed = SwapTokensParams.safeParse({ walletId: parseInt(req.params.walletId) });
  const bodyParsed = SwapTokensBody.safeParse(req.body);
  if (!parParsed.success || !bodyParsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.id, parParsed.data.walletId), eq(walletsTable.userId, userId)));
  if (!wallet) { res.status(404).json({ error: "Wallet not found" }); return; }
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
  res.status(201).json({
    ...tx,
    amount: parseFloat(tx.amount),
    toAmount: tx.toAmount ? parseFloat(tx.toAmount) : null,
    valueUsd: parseFloat(tx.valueUsd),
    gasFeeEth: tx.gasFeeEth ? parseFloat(tx.gasFeeEth) : null,
    gasFeeUsd: tx.gasFeeUsd ? parseFloat(tx.gasFeeUsd) : null,
    createdAt: tx.createdAt.toISOString(),
  });
});

router.get("/wallets/:walletId/nfts", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const parsed = GetWalletNftsParams.safeParse({ walletId: parseInt(req.params.walletId) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid wallet ID" }); return; }
  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.id, parsed.data.walletId), eq(walletsTable.userId, userId)));
  if (!wallet) { res.status(404).json({ error: "Wallet not found" }); return; }
  const nfts = await db.select().from(nftsTable).where(eq(nftsTable.walletId, parsed.data.walletId));
  res.json(
    nfts.map((n) => ({
      ...n,
      floorPriceEth: n.floorPriceEth ? parseFloat(n.floorPriceEth) : null,
      floorPriceUsd: n.floorPriceUsd ? parseFloat(n.floorPriceUsd) : null,
    })),
  );
});

export default router;
