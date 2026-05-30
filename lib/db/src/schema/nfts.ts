import { pgTable, serial, integer, text, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { walletsTable } from "./wallets";

export const nftsTable = pgTable("nfts", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => walletsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  collection: text("collection").notNull(),
  tokenId: text("token_id").notNull(),
  imageUrl: text("image_url").notNull(),
  networkId: integer("network_id").notNull(),
  floorPriceEth: numeric("floor_price_eth", { precision: 20, scale: 8 }),
  floorPriceUsd: numeric("floor_price_usd", { precision: 20, scale: 2 }),
  traits: text("traits"),
});

export const insertNftSchema = createInsertSchema(nftsTable).omit({ id: true });
export type InsertNft = z.infer<typeof insertNftSchema>;
export type Nft = typeof nftsTable.$inferSelect;
