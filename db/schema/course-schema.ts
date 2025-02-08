import { pgTable, text, serial, bigint } from "drizzle-orm/pg-core";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  image_url: text("image_url"),
  subject: text("subject").array(),
  author_id: text("author_id").notNull(),
  description: text("description"),
  tags: text("tags"),
  presentation: text("presentation"),
  test_id: bigint("test_id", {mode: "number"}),
});

export type InsertCourse = typeof coursesTable.$inferInsert;
export type SelectCourse = typeof coursesTable.$inferSelect;