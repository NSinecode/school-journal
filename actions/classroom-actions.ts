"use server";

import { getClassrooms, createClassroom, deleteClassroom, updateClassroom } from "@/db/queries/classroom-queries";
import { InsertClassroom } from "@/db/schema/classroom-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { classroomTable } from "@/db/schema/classroom-schema";
import { db } from "@/db/db";
import { getCoursesById } from "@/db/queries/courses_queries";


export async function getClassroomsAction(): Promise<ActionState> {
  try {
    const classrooms = await getClassrooms();
    return { status: "success", message: "Classrooms retrieved successfully", data: classrooms };
  } catch (error) {
    console.error("Error getting classrooms:", error);
    return { status: "error", message: "Failed to get classrooms" };
  }
}

export async function createClassroomAction(classroom: InsertClassroom): Promise<ActionState> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    console.log('Incoming classroom data:', classroom);

    // Validate required fields
    if (!classroom.name) {
      return { 
        status: "error", 
        message: "Classroom name is required" 
      };
    }

    const sanitizedClassroom = {
      name: classroom.name,
      teacher_id: userId,
      students: Array.isArray(classroom.students) 
        ? classroom.students.filter(s => typeof s === 'string')
        : [],
    };

    console.log('Sanitized classroom data:', sanitizedClassroom);

    const newClassroom = await createClassroom(sanitizedClassroom);
    
    if (!newClassroom) {
      throw new Error("Failed to create classroom - no data returned");
    }

    revalidatePath("/classrooms");
    return { 
      status: "success", 
      message: "Classroom created successfully", 
      data: newClassroom 
    };
  } catch (error) {
    console.error("Full error details:", error);
    return { 
      status: "error", 
      message: error instanceof Error ? error.message : "Failed to create classroom" 
    };
  }
}

export async function deleteClassroomAction(id: number): Promise<ActionState> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await deleteClassroom(id);
    revalidatePath("/classrooms");
    return { status: "success", message: "Classroom deleted successfully" };

  } catch (error) {
    console.error("Error deleting classroom:", error);
    return { status: "error", message: "Failed to delete classroom" };
  }
}

export async function updateClassroomAction(
  id: number,
  data: Partial<InsertClassroom>
): Promise<ActionState> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const updatedClassroom = await updateClassroom(id, data);
    revalidatePath("/classrooms");
    return { 
      status: "success", 
      message: "Classroom updated successfully",
      data: updatedClassroom
    };
  } catch (error) {
    console.error("Error updating classroom:", error);
    return { 
      status: "error", 
      message: "Failed to update classroom" 
    };
  }
}

export async function getTeacherClassrooms(teacherId: string) {
  try {
    const classrooms = await db
      .select()
      .from(classroomTable)
      .where(eq(classroomTable.teacher_id, teacherId));
    return classrooms;
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    return [];
  }
}

export async function addStudentToClassroom(classroomId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const classroom = await db
      .select()
      .from(classroomTable)
      .where(eq(classroomTable.id, parseInt(classroomId)))
      .then(rows => rows[0]);

    if (!classroom) {
      return { status: "error", message: "Classroom not found" };
    }

    // Check if student is already in the classroom
    if (classroom.students.includes(userId)) {
      return { status: "already_enrolled", message: "Already enrolled in classroom" };
    }

    const updatedStudents = [...(classroom.students || []), userId];
    
    await db.update(classroomTable)
      .set({ students: updatedStudents })
      .where(eq(classroomTable.id, parseInt(classroomId)));

    revalidatePath('/classroom');
    return { status: "success", message: "Added to classroom" };
  } catch (error) {
    return { status: "error", message: "Failed to join classroom" };
  }
}

export async function getClassroomByIdAction(id: number) {
  try {
    const classroom = await db
      .select()
      .from(classroomTable)
      .where(eq(classroomTable.id, id))
      .then((rows) => rows[0]);
    
    if (!classroom) {
      return {
        status: 'error',
        message: 'Classroom not found'
      };
    }

    // Get course details for homework - add null check and validation
    const homeworkIds = classroom.homework?.filter(id => !isNaN(parseInt(id)))
      .map(id => parseInt(id)) || [];
    
    const courses = await getCoursesById(homeworkIds);
    
    return {
      status: 'success',
      data: {
        ...classroom,
        homeworkDetails: courses
      }
    };
  } catch (error) {
    console.error('Classroom fetch error:', error);
    return {
      status: 'error',
      message: 'Failed to fetch classroom'
    };
  }
}
