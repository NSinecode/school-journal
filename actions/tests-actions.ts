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

    const completionStr = JSON.stringify(completion);
    const updatedTest = await updateTestCompletion(testId, completionStr);
    revalidatePath("/Tests");
    return { 
      status: "success", 
      message: "Test completion saved successfully",
      data: updatedTest
    };
  } catch (error) {
    console.error("Error saving test completion:", error);
    return { 
      status: "error", 
      message: "Failed to save test completion" 
    };
  }
}