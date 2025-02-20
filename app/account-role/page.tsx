"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { setUserRoleAction } from "@/actions/profiles-actions";
import { useState, useEffect } from "react";
import { getUserRole } from "@/actions/profiles-actions";

export default function AccountRolePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasRole, setHasRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const role = await getUserRole();
      if (role === "student") {
        router.push("/statitics");
      } else if (role === "teacher") {
        router.push("/statistics");
      } else {
        setHasRole(false);
      }
    };
    
    checkRole();
  }, [router]);

  const handleRoleSelect = async (role: "student" | "teacher") => {
    try {
      setIsLoading(true);
      const result = await setUserRoleAction(role);
      
      if (result.status === "error") {
        throw new Error(result.message);
      }
      
      router.push(role === "teacher" ? "/statistics" : "/statistics");
    } catch (error) {
      console.error("Error setting role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasRole) {
    return null;
  }

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
          Учитель
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={() => handleRoleSelect("student")}
          className="w-48"
          disabled={isLoading}
        >
          Ученик
        </Button>
      </div>
    </div>
  );
}
