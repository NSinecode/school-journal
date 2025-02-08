"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function InvitePage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setClassId(params.get('id'));
  }, []);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/login");
    }
  }, [isLoaded, userId, router]);

  const handleJoin = async () => {
    setError("");
    
    if (!classId) {
      setError("Invalid classroom ID");
      return;
    }

    try {
      const response = await fetch("/api/classroom/validate-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          classId: parseInt(classId)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join classroom");
      }

      router.push(`/classroom/manage?id=${classId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to join classroom");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Join Classroom</h1>
        <div className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <Button
            onClick={handleJoin}
            className="w-full"
          >
            Join Classroom
          </Button>
        </div>
      </div>
    </div>
  );
}
