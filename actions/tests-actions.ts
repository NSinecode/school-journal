"use server";

import { getTests, createTest, deleteTest } from "@/db/queries/tests-queries";
import { InsertTest } from "@/db/schema/tests-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";

export async function getTestsAction(): Promise<ActionState> {
  try {
    const tests = await getTests();
    return { status: "success", message: "Tests retrieved successfully", data: tests };
  } catch (error) {
    console.error("Error getting tests:", error);
    return { status: "error", message: "Failed to get tests" };
  }
}

export async function createTestAction(test: InsertTest): Promise<ActionState> {
  try {
    const newTest = await createTest(test);
    revalidatePath("/Tests");
    return { status: "success", message: "Test created successfully", data: newTest };
  } catch (error) {
    console.error("Error creating test:", error);
    return { status: "error", message: "Failed to create test" };
  }
}

export async function deleteTestAction(id: number): Promise<ActionState> {
  try {
    await deleteTest(id);
    revalidatePath("/Tests");
    return { status: "success", message: "Test deleted successfully" };
  } catch (error) {
    console.error("Error deleting test:", error);
    return { status: "error", message: "Failed to delete test" };
  }
}