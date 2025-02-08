"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertClassroom, SelectClassroom, classroomTable } from "../schema/classroom-schema";

export const getClassrooms = async (): Promise<SelectClassroom[]> => {
  try {
    return db.select().from(classroomTable);
  } catch (error) {
    console.error("Error getting classrooms:", error);
    throw new Error("Failed to get classrooms");
  }
};

export const createClassroom = async (data: InsertClassroom) => {
  try {
    console.log('Received data in query:', data);
    
    // Validate required fields
    if (!data.name || !data.teacher_id) {
      throw new Error('Missing required fields: name and teacher_id are required');
    }

    const sanitizedData = {
      name: data.name,
      teacher_id: data.teacher_id,
      students: Array.isArray(data.students) ? data.students : [],
    };

    console.log('Sanitized data in query:', sanitizedData);

    const result = await db
      .insert(classroomTable)
      .values(sanitizedData)
      .returning();

    if (!result || result.length === 0) {
      throw new Error('No data returned from database');
    }

    return result[0];
  } catch (error) {
    console.error("Detailed error in createClassroom:", error);
    throw error;
  }
};

export const deleteClassroom = async (id: number) => {
  try {
    await db.delete(classroomTable).where(eq(classroomTable.id, id));
  } catch (error) {
    console.error("Error deleting classroom:", error);
    throw new Error("Failed to delete classroom");
  }
};

export const updateClassroomStudents = async (classroomId: number, students: string[]) => {
  try {
    return await db
      .update(classroomTable)
      .set({ students })
      .where(eq(classroomTable.id, classroomId))
      .returning();
  } catch (error) {
    console.error("Error updating classroom students:", error);
    throw new Error("Failed to update classroom students");
  }
};

export async function updateClassroom(id: number, data: Partial<InsertClassroom>) {
  return await db
    .update(classroomTable)
    .set(data)
    .where(eq(classroomTable.id, id))
    .returning();
}