import { NextResponse } from "next/server";
import { deleteCourse } from "@/db/queries/courses_queries"; // ✅ Путь к твоей функции

export async function POST(id: number) {
  const courses = await deleteCourse(id);
   return NextResponse.json(courses);
}