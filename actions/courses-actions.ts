"use server";

import { getCourses } from "@/db/queries/courses_queries";
import { InsertCourse } from "@/db/schema/course-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCoursesAction(): Promise<ActionState> {
  try {
    const courses = await getCourses();
    return { status: "success", message: "Courses retrieved successfully", data: courses };
  } catch (error) {
    console.error("Error getting courses:", error);
    return { status: "error", message: "Failed to get Courses" };
  }
}