import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
      const { userId } = await auth(); // 🔹 Получаем userId из Clerk
  
      if (!userId) {
        return NextResponse.json(
          { error: "Пользователь не авторизован" },
          { status: 401 }
        );
      }
  
      return NextResponse.json({ userId });
    } catch (error) {
      console.error("❌ Ошибка при получении userId:", error);
      return NextResponse.json(
        { error: "Ошибка сервера" },
        { status: 500 }
      );
    }
  }