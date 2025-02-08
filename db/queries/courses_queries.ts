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
export const getCourse = async (id: number) => {
  try {
    const course = await db.query.courses.findFirst({
      where: eq(coursesTable.id, id)
    });
    if (!course) {
      throw new Error("course not found");
    }
    return course;
  } catch (error) {
    console.error("Error getting course by ID:", error);
    throw new Error("Failed to get course");
  }
};
export const createCourse = async (data: InsertCourse) => {
  try {
    const [newCourse] = await db.insert(coursesTable).values(data).returning();
    return newCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Failed to create course");
  }
};
export const deleteCourse = async (id: number) => {
  try {
    await db.delete(coursesTable).where(eq(coursesTable.id, id));
  } catch (error) {
    console.error("Error deleting course:", error);
    throw new Error("Failed to delete course");
  }
};