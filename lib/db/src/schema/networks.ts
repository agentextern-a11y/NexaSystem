import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const networksTable = pgTable("networks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  chainId: integer("chain_id").notNull(),
  rpcUrl: text("rpc_url").notNull(),
  explorerUrl: text("explorer_url").notNull(),
  logoUrl: text("logo_url").notNull(),
  isTestnet: boolean("is_testnet").notNull().default(false),
  color: text("color").notNull().default("#627EEA"),
});

export const insertNetworkSchema = createInsertSchema(networksTable).omit({ id: true });
export type InsertNetwork = z.infer<typeof insertNetworkSchema>;
export type Network = typeof networksTable.$inferSelect;
