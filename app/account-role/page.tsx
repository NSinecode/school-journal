"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { setUserRoleAction } from "@/actions/profiles-actions";
import { useState } from "react";

export default function AccountRolePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = async (role: "student" | "teacher") => {
    try {
      setIsLoading(true);
      const result = await setUserRoleAction(role);
      
      if (result.status === "error") {
        throw new Error(result.message);
      }
      
      router.push(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
    } catch (error) {
      console.error("Error setting role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-2xl font-semibold">Choose your role</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          onClick={() => handleRoleSelect("teacher")}
          className="w-48"
          disabled={isLoading}
        >
          Teacher
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={() => handleRoleSelect("student")}
          className="w-48"
          disabled={isLoading}
        >
          Student
        </Button>
      </div>
    </div>
  );
}
