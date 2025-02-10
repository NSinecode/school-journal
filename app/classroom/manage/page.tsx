"use client"

import { getTeacherClassrooms } from "@/actions/classroom-actions";
import { notFound } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type Props = {
  searchParams: Promise<{ id?: number }>
}

interface Classroom {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  teacher_id: string;
  students: string[];
}

export default function ClassroomDetailsPage({ 
  searchParams 
}: Props) {
  const { userId } = useAuth();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  
  useEffect(() => {
    async function loadData() {
      if (!userId) return notFound();
      const params = await searchParams;
      const id = params.id;
      if (!id) return notFound();

      const classrooms = await getTeacherClassrooms(userId);
      const found = classrooms?.find((c) => c.id === id);
      if (!found) {
        console.log('No classroom found');
        return notFound();
      }
      setClassroom(found);
    }
    loadData();
  }, [userId, searchParams]);

  if (!classroom) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{classroom.name}</h1>
      
      <div className="shadow rounded-lg p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Classroom Details</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-white/60">ID:</div>
            <div className="text-white flex items-center gap-2">
              {classroom.id}
              <button
                onClick={() => {
                  const link = `${window.location.origin}/classroom/invite?id=${classroom.id}`;
                  navigator.clipboard.writeText(link);
                }}
                className="ml-2 px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 rounded-md"
              >
                Copy Invite Link
              </button>
            </div>
            <div className="text-white/60">Created:</div>
            <div className="text-white">{new Date(classroom.created_at).toLocaleDateString()}</div>
            <div className="text-white/60">Teacher ID:</div>
            <div className="text-white">{classroom.teacher_id}</div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Students</h2>
          {classroom.students.length > 0 ? (
            <ul className="list-disc pl-5 text-white">
              {classroom.students.map((student: string, index: number) => (
                <li key={index}>{student}</li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60">No students enrolled yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
