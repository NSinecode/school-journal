import { pgTable, text, serial, bigint, timestamp } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  author_id: text("author_id").notNull(),
  message: text("message").notNull(),
  score: bigint("score", { mode: "number" }).default(0),
  created_at: timestamp("created_at").defaultNow(),
});

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;