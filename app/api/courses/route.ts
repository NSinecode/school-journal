import { NextResponse } from "next/server";
import { getCourses } from "@/db/queries/courses_queries"; // ✅ Путь к твоей функции

export async function GET() {
  try {
    const courses = await getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при получении данных" }, { status: 500 });
  }
}