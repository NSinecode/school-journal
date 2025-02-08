import { getTeacherClassrooms } from "@/actions/classroom-actions";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
  searchParams: { id?: number };
}


export default async function ClassroomDetailsPage({ 
  searchParams 
}: PageProps) {
  const { userId } = await auth();
  if (!userId) return notFound();
  
  const params = await searchParams;
  const id = params.id;
  if (!id) return notFound();

  const classrooms = await getTeacherClassrooms(userId);
  const classroom = classrooms?.find((c) => c.id === id);



  if (!classroom) {
    console.log('No classroom found');
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{classroom.name}</h1>
      
      <div className="shadow rounded-lg p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Classroom Details</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-white/60">ID:</div>
            <div className="text-white">{classroom.id}</div>
            <div className="text-white/60">Created:</div>
            <div className="text-white">{new Date(classroom.created_at).toLocaleDateString()}</div>
            <div className="text-white/60">Last Updated:</div>
            <div className="text-white">{new Date(classroom.updated_at).toLocaleDateString()}</div>
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
