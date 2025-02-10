'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@clerk/nextjs"
import { getUserRole, getProfileByUserIdAction } from '@/actions/profiles-actions'
import { Button } from "@/components/ui/button"
import { eq } from 'drizzle-orm'
import { classroomTable } from '@/db/schema'
import { db } from '@/db/db'
import { getClassroomByIdAction } from '@/actions/classroom-actions'


interface Classroom {
  id: number
  name: string
}

export default function ClassroomPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [isStudent, setIsStudent] = useState(false)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState('')

  useEffect(() => {
    const checkRoleAndLoadClassrooms = async () => {
      const role = await getUserRole()
      if (role !== 'student') {
        router.push('/classroom/choose')
      } else {
        setIsStudent(true)
        if (userId) {
          const response = await getProfileByUserIdAction(userId)
          if (response.status === 'success' && response.data) {
            const myClassrooms = response.data.my_classroom || []
            
            // Fetch classroom details for each ID
            const classroomPromises = myClassrooms.map(async (id: number) => {
              const result = await getClassroomByIdAction(id)
              return {
                id,
                name: result.status === 'success' ? result.data?.name : `Classroom ${id}`
              }
            })
            
            const classroomDetails = await Promise.all(classroomPromises)
            setClassrooms(classroomDetails)
          }
        }
        setLoading(false)
      }
    }
    
    checkRoleAndLoadClassrooms()
  }, [router, userId])

  if (!isStudent || loading) return null

  const handleJoinClassroom = () => {
    if (!searchId.trim()) return
    router.push(`/classroom/see?id=${searchId}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Classrooms</h1>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Enter classroom ID to join"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 rounded border flex-1"
        />
        <Button onClick={handleJoinClassroom}>Join</Button>
      </div>
      
      <div className="grid gap-4">
        {classrooms.map((classroom) => (
          <div key={classroom.id} className="flex gap-2">
            <Button
              onClick={() => router.push(`/classroom/see?id=${classroom.id}`)}
              variant="outline"
              className="h-auto p-4 flex-1 justify-start"
            >
              <div>
                <h2 className="text-xl font-semibold">{classroom.name}</h2>
              </div>
            </Button>
          </div>
        ))}

        {classrooms.length === 0 && (
          <p className="text-gray-500 text-center">Вы пока ни в одном классе</p>
        )}
      </div>
    </div>
  )
}
