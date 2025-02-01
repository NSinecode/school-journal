import { NextResponse } from "next/server";
import { createCourse } from "@/db/queries/courses_queries";

export async function POST(request) {
  const { title, author_id } = await request.json();

  if (!title || !author_id) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const newCourse = await createCourse({ title, author_id });

    return NextResponse.json(newCourse);
  } catch (error) {
    return NextResponse.json({ error: "Error creating course" }, { status: 500 });
  }
}