"use server";

import { db } from "@/db/db";
import { eq, sql } from "drizzle-orm";
import { InsertMessage, SelectMessage, messagesTable } from "../schema/messages-schema";

export const getMessages = async (): Promise<SelectMessage[]> => {
  try {
    return db.select().from(messagesTable);
  } catch (error) {
    console.error("Error getting messages:", error);
    throw new Error("Failed to get messages");
  }
};
export const getMessage = async (id: number) => {
  try {
    const message = await db.query.messages.findFirst({
      where: eq(messagesTable.id, id)
    });
    if (!message) {
      throw new Error("message not found");
    }
    return message;
  } catch (error) {
    console.error("Error getting message by ID:", error);
    throw new Error("Failed to get message");
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
export const updateMessage = async (id: number, data: Partial<InsertMessage>) => {
  try {
    const [updatedMessage] = await db.update(messagesTable).set(data).where(eq(messagesTable.id, id)).returning();
    return updatedMessage;
  } catch (error) {
    console.error("Error updating message:", error);
    throw new Error("Failed to update message");
  }
};

export const getMessageCountByAuthor = async (authorId: string): Promise<number> => {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messagesTable)
      .where(eq(messagesTable.author_id, authorId));
    return result[0].count;
  } catch (error) {
    console.error("Error counting messages:", error);
    throw new Error("Failed to count messages");
  }
};