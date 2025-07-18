import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

// Parse DATABASE_URL if it exists
function parseDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port || "5432"),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      ssl: process.env.NODE_ENV === "production" ? "require" as const : false,
    };
  }
  
  return {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "school_journal",
    ssl: process.env.NODE_ENV === "production" ? "require" as const : false,
  };
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: parseDatabaseUrl(),
} satisfies Config;