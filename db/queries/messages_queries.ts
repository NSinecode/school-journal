"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertMessage, SelectMessage, messagesTable } from "../schema/messages-schema";

export const getMessages = async (): Promise<SelectMessage[]> => {
  try {
    return db.select().from(messagesTable);
  } catch (error) {
    console.error("Error getting messages:", error);
    throw new Error("Failed to get messages");
  }
};
export const createMessage = async (data: InsertMessage) => {
  try {
    const [newMessage] = await db.insert(messagesTable).values(data).returning();
    return newMessage;
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error("Failed to create message");
  }
};
export const deleteMessage = async (id: number) => {
  try {
    await db.delete(messagesTable).where(eq(messagesTable.id, id));
  } catch (error) {
    console.error("Error deleting message:", error);
    throw new Error("Failed to delete message");
  }
};