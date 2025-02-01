"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertCourse, SelectCourse, coursesTable } from "../schema/course-schema";

export const getCourses = async (): Promise<SelectCourse[]> => {
  try {
    return db.select().from(coursesTable);
  } catch (error) {
    console.error("Error getting todos:", error);
    throw new Error("Failed to get todos");
  }
};