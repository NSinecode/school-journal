import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateClassroomStudents } from "@/db/queries/classroom-queries";
import { getUserRole } from "@/actions/profiles-actions";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a student
    const role = await getUserRole();
    if (role !== "student") {
      return NextResponse.json(
        { message: "Only students can join classrooms" }, 
        { status: 403 }
      );
    }

    const { inviteCode, classId } = await req.json();
    
    // TODO: Add actual invite code validation logic here
    // For now, we'll just add the student
    
    const updatedClassroom = await updateClassroomStudents(
      parseInt(classId), 
      userId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error joining classroom:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to join classroom" }, 
      { status: 500 }
    );
  }
}