"use server";

import { getMessages, createMessage, deleteMessage } from "@/db/queries/messages_queries";
import { InsertMessage } from "@/db/schema/messages-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";

export async function getMessagesAction(): Promise<ActionState> {
  try {
    const messages = await getMessages();
    return { status: "success", message: "Messages retrieved successfully", data: messages };
  } catch (error) {
    console.error("Error getting messages:", error);
    return { status: "error", message: "Failed to get messages" };
  }
}

export async function createMessageAction(message: InsertMessage): Promise<ActionState> {
  try {
    const newMessage = await createMessage(message);
    revalidatePath("/forum");
    return { status: "success", message: "Message created successfully", data: newMessage };
  } catch (error) {
    console.error("Error creating message:", error);
    return { status: "error", message: "Failed to create message" };
  }
}

export async function deleteMessageAction(id: number): Promise<ActionState> {
  try {
    await deleteMessage(id);
    revalidatePath("/forum");
    return { status: "success", message: "Message deleted successfully" };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { status: "error", message: "Failed to delete message" };
  }
}