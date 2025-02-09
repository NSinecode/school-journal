"use server";

  import { getTests, createTest, deleteTest, updateTestCompletion } from "@/db/queries/tests-queries";
import { InsertTest } from "@/db/schema/tests-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";



interface TestCompletion {
  user_id: string;
  choices: Record<number, number>;
}

export async function getTestsAction(): Promise<ActionState> {
  try {
    const tests = await getTests();
    const transformedTests = tests.map(test => ({
      ...test,
      body: typeof test.body === 'string' ? JSON.parse(test.body) : test.body
    }));
    return { status: "success", message: "Tests retrieved successfully", data: transformedTests };
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

export async function saveTestCompletionAction(
  testId: number, 
  completion: TestCompletion
): Promise<ActionState> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const result = await getTestsAction();
    if (result.status !== 'success' || !result.data) throw new Error("Failed to get tests");
    
    const test = result.data.find((test: any) => Number(test.id) === Number(testId));
    if (!test) throw new Error("Test not found");
    
    let existingCompletions: TestCompletion[] = [];
    
    // Handle existing completions more robustly
    if (test.completion) {
      try {
        const parsed = JSON.parse(test.completion as string);
        existingCompletions = Array.isArray(parsed) ? parsed : [];
      } catch {
        // If parsing fails, treat as empty array
        existingCompletions = [];
      }
    }

    // Update or add new completion
    const userIndex = existingCompletions.findIndex(c => c.user_id === userId);
    if (userIndex >= 0) {
      existingCompletions[userIndex] = { ...completion, user_id: userId };
    } else {
      existingCompletions.push({ ...completion, user_id: userId });
    }
    
    // Save as stringified array
    const updatedTest = await updateTestCompletion(testId, JSON.stringify(existingCompletions));
    
    revalidatePath("/Tests");
    return { 
      status: "success", 
      message: "Test completion saved successfully",
      data: updatedTest
    };
  } catch (error) {
    console.error("Error in saveTestCompletionAction:", error);
    return { 
      status: "error", 
      message: error instanceof Error ? error.message : "Failed to save test completion" 
    };
  }
}