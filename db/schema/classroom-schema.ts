import { sql } from "drizzle-orm";
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";



export const classroomTable = pgTable("classroom", {
  id: serial("id").primaryKey(),
  created_at: timestamp("created_at").default(sql`now()`).notNull(),
  updated_at: timestamp("updated_at").default(sql`now()`).notNull(),
  teacher_id: text("teacher_id").notNull(),
  students: text("students").array().default([]).notNull(),
  name: text("name").notNull(),
  homework: text("homework").array().default([]).notNull()
});

export type InsertClassroom = typeof classroomTable.$inferInsert;
export type SelectClassroom = typeof classroomTable.$inferSelect;