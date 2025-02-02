import { NextResponse } from "next/server";
import { getCourses } from "@/db/queries/courses_queries"; // ✅ Путь к твоей функции

export async function GET() {
  const courses = await getCourses();
   return NextResponse.json(courses);
}