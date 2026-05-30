import { pgTable, serial, integer, text, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { walletsTable } from "./wallets";

export const tokenHoldingsTable = pgTable("token_holdings", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => walletsTable.id, { onDelete: "cascade" }),
  tokenSymbol: text("token_symbol").notNull(),
  tokenName: text("token_name").notNull(),
  balance: numeric("balance", { precision: 30, scale: 12 }).notNull().default("0"),
  valueUsd: numeric("value_usd", { precision: 20, scale: 2 }).notNull().default("0"),
  priceUsd: numeric("price_usd", { precision: 20, scale: 8 }).notNull().default("0"),
  logoUrl: text("logo_url").notNull(),
  change24hPercent: numeric("change_24h_percent", { precision: 10, scale: 4 }).notNull().default("0"),
});

export const insertTokenHoldingSchema = createInsertSchema(tokenHoldingsTable).omit({ id: true });
export type InsertTokenHolding = z.infer<typeof insertTokenHoldingSchema>;
export type TokenHolding = typeof tokenHoldingsTable.$inferSelect;
