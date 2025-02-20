"use server";

import { createProfile, deleteProfile, getAllProfiles, getProfileByUserId, updateProfile } from "@/db/queries/profiles-queries";
import { InsertProfile } from "@/db/schema/profile-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";

export async function createProfileAction(data: InsertProfile): Promise<ActionState> {
  try {
    const newProfile = await createProfile(data);
    revalidatePath("/profile");
    return { status: "success", message: "Profile created successfully", data: newProfile };
  } catch (error) {
    return { status: "error", message: "Failed to create profile" };
  }
}

export async function getProfileByUserIdAction(userId: string): Promise<ActionState> {
  try {
    const profile = await getProfileByUserId(userId);
    return { status: "success", message: "Profile retrieved successfully", data: profile };
  } catch (error) {
    return { status: "error", message: "Failed to get profile" };
  }
}

export async function getAllProfilesAction(): Promise<ActionState> {
  try {
    const profiles = await getAllProfiles();
    return { status: "success", message: "Profiles retrieved successfully", data: profiles };
  } catch (error) {
    return { status: "error", message: "Failed to get profiles" };
  }
}

export async function updateProfileAction(userId: string, data: Partial<InsertProfile>, path: string): Promise<ActionState> {
  try {
    const updatedProfile = await updateProfile(userId, data);
    revalidatePath(path);
    return { status: "success", message: "Profile updated successfully", data: updatedProfile };
  } catch (error) {
    return { status: "error", message: "Failed to update profile" };
  }
}

export async function deleteProfileAction(userId: string): Promise<ActionState> {
  try {
    await deleteProfile(userId);
    revalidatePath("/profile");
    return { status: "success", message: "Profile deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete profile" };
  }
}

export async function setUserRoleAction(role: "student" | "teacher"): Promise<ActionState> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    const updatedProfile = await updateProfile(userId, { role });
    revalidatePath("/profile");
    return { status: "success", message: "Role updated successfully", data: updatedProfile };
  } catch (error) {
    return { status: "error", message: "Failed to update role" };
  }
}

export async function getUserRole() {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    
    const profile = await db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.userId, userId)
    });
    
    return profile?.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export async function getUserScore(userId: string) {
  try {
    const profile = await db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.userId, userId)
    });
    
    return profile?.score ?? 0;
  } catch (error) {
    console.error("Error fetching user score:", error);
    return 0;
  }
}

export async function updateUserScoreAction(userId: string, additionalScore: number): Promise<ActionState> {
  try {
    const profile = await getProfileByUserId(userId);
    if (!profile) throw new Error("Profile not found");

    const currentScore = profile.score || 0;
    const updatedProfile = await updateProfile(userId, { 
      score: currentScore + additionalScore 
    });

    revalidatePath("/test");
    return { 
      status: "success", 
      message: "Score updated successfully", 
      data: updatedProfile 
    };
  } catch (error) {
    return { 
      status: "error", 
      message: "Failed to update score" 
    };
  }
}

export async function addClassroomToUserAction(classroomId: string): Promise<ActionState> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const profile = await getProfileByUserId(userId);
    if (!profile) throw new Error("Profile not found");

    const currentClassrooms = profile.my_classroom || [];
    const updatedProfile = await updateProfile(userId, {
      my_classroom: [...currentClassrooms, Number(classroomId)]
    });

    revalidatePath("/classroom");
    return {
      status: "success",
      message: "Classroom added successfully",
      data: updatedProfile
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to add classroom"
    };
  }
}