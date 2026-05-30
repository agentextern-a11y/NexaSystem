import { pgTable, serial, text, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tokensTable = pgTable("tokens", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  priceUsd: numeric("price_usd", { precision: 20, scale: 8 }).notNull().default("0"),
  change24hPercent: numeric("change_24h_percent", { precision: 10, scale: 4 }).notNull().default("0"),
  logoUrl: text("logo_url").notNull(),
  marketCapUsd: numeric("market_cap_usd", { precision: 20, scale: 2 }).notNull().default("0"),
  volume24hUsd: numeric("volume_24h_usd", { precision: 20, scale: 2 }).notNull().default("0"),
  isPopular: boolean("is_popular").notNull().default(false),
});

export const insertTokenSchema = createInsertSchema(tokensTable).omit({ id: true });
export type InsertToken = z.infer<typeof insertTokenSchema>;
export type Token = typeof tokensTable.$inferSelect;
