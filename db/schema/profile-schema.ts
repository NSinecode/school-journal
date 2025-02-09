import { bigint } from "drizzle-orm/pg-core";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["student", "teacher", "admin"]);

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  role: roleEnum("role").notNull().default("student"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  posts_liked: bigint("posts_liked", { mode: "number" }).array(),
  posts_disliked: bigint("posts_disliked", { mode: "number" }).array(),
  marked_courses: text("marked_courses").array().default([])
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;