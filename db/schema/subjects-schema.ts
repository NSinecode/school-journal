import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";

export const subjectsTable = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  is_confirmed: boolean("is_confirmed").default(false).notNull()
});

export type InsertSubject = typeof subjectsTable.$inferInsert;
export type SelectSubject = typeof subjectsTable.$inferSelect;