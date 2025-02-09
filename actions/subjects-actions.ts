"use server";

import { getSubjects, createSubject, deleteSubject, getSubject, updateSubject } from "@/db/queries/subjects_queries";
import { InsertSubject } from "@/db/schema/subjects-schema";
import { ActionState } from "@/types";

export async function getSubjectsAction(): Promise<ActionState> {
  try {
    const subjects = await getSubjects();
    return { status: "success", message: "Courses retrieved successfully", data: subjects };
  } catch (error) {
    console.error("Error getting subjects:", error);
    return { status: "error", message: "Failed to get subjects" };
  }
}

export async function getSubjectAction(id: number): Promise<ActionState> {
  try {
    const subject = await getSubject(id);
    return { status: "success", message: "subject retrieved successfully", data: subject };
  } catch (error) {
    console.error("Error getting subject by ID:", error);
    return { status: "error", message: "Failed to get subject" };
  }
}

export async function createSubjectAction(course: InsertSubject): Promise<ActionState> {
  try {
    const newSubject = await createSubject(course);
    return { status: "success", message: "Subject created successfully", data: newSubject };
  } catch (error) {
    console.error("Error creating subject:", error);
    return { status: "error", message: "Failed to create subject" };
  }
}

export async function deleteSubjectAction(id: number): Promise<ActionState> {
  try {
    await deleteSubject(id);
    return { status: "success", message: "Subject deleted successfully" };
  } catch (error) {
    console.error("Error deleting subject:", error);
    return { status: "error", message: "Failed to delete subject" };
  }
}

export async function updateSubjectAction(id: number, data: Partial<InsertSubject>): Promise<ActionState> {
  try {
    const updatedSubject = await updateSubject(id, data);
    return { status: "success", message: "Subject updated successfully", data: updatedSubject };
  } catch (error) {
    console.error("Error updating subject:", error);
    return { status: "error", message: "Failed to update subject" };
  }
}