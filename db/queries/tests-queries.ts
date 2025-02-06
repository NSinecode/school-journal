"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertTest, SelectTest, testsTable } from "../schema/tests-schema";

export const getTests = async (): Promise<SelectTest[]> => {
  try {
    return db.select().from(testsTable);
  } catch (error) {
    console.error("Error getting todos:", error);
    throw new Error("Failed to get todos");
  }
};
export const createTest = async (data: InsertTest) => {
  try {
    const [newTest] = await db.insert(testsTable).values(data).returning();
    return newTest;
  } catch (error) {
    console.error("Error creating test:", error);
    throw new Error("Failed to create test");
  }
};
export const deleteTest = async (id: number) => {
  try {
    await db.delete(testsTable).where(eq(testsTable.id, id));
  } catch (error) {
    console.error("Error deleting test:", error);
    throw new Error("Failed to delete test");
  }
};

export async function updateTestCompletion(testId: number, completionStr: string) {
  return await db
    .update(testsTable)
    .set({ completion: completionStr })
    .where(eq(testsTable.id, testId))
    .returning();
}