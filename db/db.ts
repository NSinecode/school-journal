import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profilesTable, todosTable, coursesTable, messagesTable } from "./schema";

config({ path: ".env.local" });

const schema = {
  profiles: profilesTable,
  todos: todosTable,
  courses: coursesTable,
  messages: messagesTable
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });