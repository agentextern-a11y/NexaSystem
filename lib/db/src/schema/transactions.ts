import { pgTable, serial, integer, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { walletsTable } from "./wallets";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => walletsTable.id, { onDelete: "cascade" }),
  type: text("type").notNull().$type<"send" | "receive" | "swap" | "contract">(),
  status: text("status").notNull().default("confirmed").$type<"pending" | "confirmed" | "failed">(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: numeric("amount", { precision: 30, scale: 12 }).notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  toTokenSymbol: text("to_token_symbol"),
  toAmount: numeric("to_amount", { precision: 30, scale: 12 }),
  valueUsd: numeric("value_usd", { precision: 20, scale: 2 }).notNull().default("0"),
  networkId: integer("network_id").notNull(),
  hash: text("hash").notNull().unique(),
  gasFeeEth: numeric("gas_fee_eth", { precision: 20, scale: 12 }),
  gasFeeUsd: numeric("gas_fee_usd", { precision: 10, scale: 4 }),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
