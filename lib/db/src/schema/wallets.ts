import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { networksTable } from "./networks";
import { usersTable } from "./users";

export const walletsTable = pgTable("wallets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull().unique(),
  networkId: integer("network_id").notNull().references(() => networksTable.id),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  encryptedPrivateKey: text("encrypted_private_key"),
  color: text("color").notNull().default("#627EEA"),
  totalValueUsd: numeric("total_value_usd", { precision: 20, scale: 2 }).default("0"),
  change24hPercent: numeric("change_24h_percent", { precision: 10, scale: 4 }).default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWalletSchema = createInsertSchema(walletsTable).omit({ id: true, createdAt: true });
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof walletsTable.$inferSelect;
