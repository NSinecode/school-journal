import { NextResponse } from "next/server";
import { db } from "@/db/db"
import { eq } from "drizzle-orm";
import { coursesTable } from "@/db/schema";

export async function POST(req) {
  try {
    const { delId } = await req.json(); // Получаем ID курса

    if (!delId) {
      return NextResponse.json({ error: "ID не передан" }, { status: 400 });
    }

    // Удаляем курс из базы
    await db.delete(coursesTable).where(eq(coursesTable.id, delId));

    return NextResponse.json({ success: true, deletedId: delId });
  } catch (error) {
    console.error("Ошибка удаления курса:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}