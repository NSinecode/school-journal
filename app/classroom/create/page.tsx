'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { createClassroomAction } from "@/actions/classroom-actions"
import { useAuth } from "@clerk/nextjs"
import { getUserRole } from '@/actions/profiles-actions'
import { TrashIcon } from "lucide-react"

export default function CreateClassroomPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [isTeacher, setIsTeacher] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [classroomName, setClassroomName] = useState('')
  const [students, setStudents] = useState<string[]>([])
  const [currentStudent, setCurrentStudent] = useState('')

  useEffect(() => {
    const checkRole = async () => {
      const role = await getUserRole()
      if (role !== 'teacher') {
        router.push('/classroom')
      } else {
        setIsTeacher(true)
      }
    }
    
    checkRole()
  }, [router])

  if (!isTeacher) return null

  const handleAddStudent = () => {
    if (currentStudent.trim()) {
      setStudents([...students, currentStudent.trim()])
      setCurrentStudent('')
    }
  }

  const handleDeleteStudent = (index: number) => {
    const newStudents = [...students]
    newStudents.splice(index, 1)
    setStudents(newStudents)
  }

  const handleCreate = async () => {
    if (!classroomName || !userId) {
      console.error('Missing required fields:', { classroomName, userId });
      return;
    }
    
    setIsCreating(true);
    
    try {
      const classroomData = {
        name: classroomName,
        teacher_id: userId,
        students: students || [],
      };

      console.log('Sending data:', classroomData);

      const result = await createClassroomAction(classroomData);

      console.log('Result:', result);

      if (result.status === "success") {
        router.push("/classroom");
      } else {
        console.error('Failed:', result.message);
      }
    } catch (error) {
      console.error('Error in handleCreate:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Classroom</h1>
      
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Classroom Name"
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add student email"
            value={currentStudent}
            onChange={(e) => setCurrentStudent(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <Button onClick={handleAddStudent}>Add Student</Button>
        </div>

        {students.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Added Students:</h2>
            {students.map((student, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded mb-2">
                <span>{student}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteStudent(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          onClick={handleCreate}
          className="w-full"
          disabled={!classroomName || isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Classroom'}
        </Button>
      </div>
    </div>
  )
}
