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

  useEffect(() => {
    const checkRole = async () => {
      const role = await getUserRole()
      if (role !== 'teacher') {
        router.push('/classroom/choose')
      } else {
        setIsTeacher(true)
      }
    }
    
    checkRole()
  }, [router])

  if (!isTeacher) return null

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
        students: [], // Empty array since we're not collecting students anymore
      };

      console.log('Sending data:', classroomData);

      const result = await createClassroomAction(classroomData);

      console.log('Result:', result);

      if (result.status === "success") {
        router.push("/classroom/choose");
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
