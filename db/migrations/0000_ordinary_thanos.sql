CREATE TYPE "public"."role" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"role" "role" DEFAULT 'student' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "courses" (
	"id" SERIAL PRIMARY KEY,
	"title" TEXT NOT NULL, 
	"image_url" TEXT,
	"subject" TEXT[] NOT NULL,
	"author_id" TEXT NOT NULL,
	"description" TEXT,
	"tags" TEXT,
);

CREATE TABLE "messages" (
	"id" SERIAL PRIMARY KEY,
	"author_id" TEXT NOT NULL, 
	"message" TEXT NOT NULL,
	"score" BIGINT DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
)

CREATE TABLE "tests" (
	"id" SERIAL PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"body" JSONB NOT NULL,
	"completion" JSONB NOT NULL,
);