import { NextResponse } from "next/server";
import { getMessages } from "@/db/queries/messages_queries"; // ✅ Путь к твоей функции

export async function GET() {
  const msgs = await getMessages();
   return NextResponse.json(msgs);
}