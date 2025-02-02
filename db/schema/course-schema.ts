import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  image_url: text("image_url"),
  subject: text("subject").array(),
  author_id: text("author_id").notNull(),
  description: text("description"),
  tags: text("tags"),
});

export type InsertCourse = typeof coursesTable.$inferInsert;
export type SelectCourse = typeof coursesTable.$inferSelect;