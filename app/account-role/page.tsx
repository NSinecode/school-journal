"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccountRolePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-2xl font-semibold">Choose your role</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          onClick={() => router.push("/teacher-dashboard")}
          className="w-48"
        >
          Teacher
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={() => router.push("/student-dashboard")}
          className="w-48"
        >
          Student
        </Button>
      </div>
    </div>
  );
}
