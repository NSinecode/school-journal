import { sql } from "drizzle-orm";
import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";

export const testsTable = pgTable("tests", {
  id: serial("id").primaryKey(),
  created_at: timestamp("created_at").default(sql`now()`).notNull(),
  user_id: text("user_id").notNull(),
  body: jsonb("body").notNull(),
});

export type InsertTest = typeof testsTable.$inferInsert;
export type SelectTest = typeof testsTable.$inferSelect;