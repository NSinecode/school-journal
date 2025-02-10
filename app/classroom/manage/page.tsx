"use client"

import { getTeacherClassrooms } from "@/actions/classroom-actions";
import { notFound } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { updateClassroomAction } from "@/actions/classroom-actions";
import { getCoursesAction } from "@/actions/courses-actions";

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
  homework: string[];
}


export default function ClassroomDetailsPage({ 
  searchParams 
}: Props) {
  const { userId } = useAuth();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [homeworkInput, setHomeworkInput] = useState("");
  const [isErrorHomework, setIsErrorHomework] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Array<{id: number, title: string}>>([]);
  
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

      const coursesResponse = await getCoursesAction();
      if (coursesResponse.status === "success" && coursesResponse.data) {
        setAvailableCourses(coursesResponse.data.map((course: { id: number, title: string }) => ({
          id: course.id,
          title: course.title
        })));
      }
    }
    loadData();
  }, [userId, searchParams]);

  const handleHomeworkSubmit = async () => {
    if (!classroom || !homeworkInput) return;
    
    const selectedCourse = availableCourses.find(c => c.title === homeworkInput);
    if (!selectedCourse) {
      setIsErrorHomework(true);
      return;
    }

    const currentHomework = classroom.homework || [];
    const updatedHomework = [...currentHomework, selectedCourse.id.toString()];
    
    const response = await updateClassroomAction(classroom.id, {
      homework: updatedHomework
    });

    if (response.status === "success" && response.data) {
      setClassroom(response.data);
      setHomeworkInput("");
    } else {
      setIsErrorHomework(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHomeworkInput(e.target.value);
    setIsErrorHomework(false);
  };

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

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-2">Homework</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              value={homeworkInput}
              onChange={handleInputChange}
              list="homework-list"
              name="homework"
              className={`flex-1 p-2 border rounded ${
                isErrorHomework ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Choose a course for homework"
            />
            <button
              onClick={handleHomeworkSubmit}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Add Homework
            </button>
          </div>
          <datalist id="homework-list">
            {availableCourses.map((course) => (
              <option key={course.id} value={course.title} />
            ))}
          </datalist>

          {classroom?.homework && classroom.homework.length > 0 ? (
            <ul className="list-disc pl-5 text-white">
              {classroom.homework.map((courseId: string, index: number) => {
                const course = availableCourses.find(c => c.id.toString() === courseId);
                return <li key={index}>{course ? course.title : `Course ${courseId}`}</li>;
              })}
            </ul>
          ) : (
            <p className="text-white/60">No homework assigned yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
