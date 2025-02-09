"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertTest, SelectTest, testsTable } from "../schema/tests-schema";

export const getTests = async (): Promise<SelectTest[]> => {
  try {
    const tests = await db.select().from(testsTable);
    console.log('Retrieved tests:', tests.map(t => ({
      id: t.id,
      name: t.name,
      user_id: t.user_id
    })));
    return tests;
  } catch (error) {
    console.error("Error getting tests:", error);
    throw new Error("Failed to get tests");
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
  try {
    const [updatedTest] = await db
      .update(testsTable)
      .set({ completion: completionStr })
      .where(eq(testsTable.id, testId))
      .returning();
    
    if (!updatedTest) {
      throw new Error(`No test found with id ${testId}`);
    }
    
    return updatedTest;
  } catch (error) {
    console.error("Error updating test completion:", error);
    throw error;
  }
}