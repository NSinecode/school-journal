"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertSubject, SelectSubject, subjectsTable } from "../schema/subjects-schema";

export const getSubjects = async (): Promise<SelectSubject[]> => {
  try {
    return db.select().from(subjectsTable);
  } catch (error) {
    console.error("Error getting subject:", error);
    throw new Error("Failed to get subject");
  }
};
export const getSubject = async (id: number) => {
  try {
    const subject = await db.query.subjects.findFirst({
      where: eq(subjectsTable.id, id)
    });
    if (!subject) {
      throw new Error("subject not found");
    }
    return subject;
  } catch (error) {
    console.error("Error getting subject by ID:", error);
    throw new Error("Failed to get subject");
  }
};
export const createSubject = async (data: InsertSubject) => {
  try {
    const [newSubject] = await db.insert(subjectsTable).values(data).returning();
    return newSubject;
  } catch (error) {
    console.error("Error creating subject:", error);
    throw new Error("Failed to create subject");
  }
};
export const deleteSubject = async (id: number) => {
  try {
    await db.delete(subjectsTable).where(eq(subjectsTable.id, id));
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw new Error("Failed to delete subject");
  }
};
export const updateSubject = async (id: number, data: Partial<InsertSubject>) => {
  try {
    const [updatedSubject] = await db.update(subjectsTable).set(data).where(eq(subjectsTable.id, id)).returning();
    return updatedSubject;
  } catch (error) {
    console.error("Error updating subject:", error);
    throw new Error("Failed to update subject");
  }
};