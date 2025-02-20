'use client'

import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'
import { useAuth } from "@clerk/nextjs"
import { getUserRole, getUserScore } from '@/actions/profiles-actions'
import { getTeacherClassrooms } from '@/actions/classroom-actions'
import { Button } from "@/components/ui/button"

interface Classroom {
  id: string
  name: string
  students?: string[]
  score?: number
}

export default function ChooseClassroomPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [isTeacher, setIsTeacher] = useState(false)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState('')

  useEffect(() => {
    const checkRoleAndLoadClassrooms = async () => {
      const role = await getUserRole()
      if (role !== 'teacher') {
        router.push('/classroom')
      } else {
        setIsTeacher(true)
        if (userId) {
          const teacherClassrooms = await getTeacherClassrooms(userId)
          const score = await getUserScore(userId)
          setClassrooms(teacherClassrooms.map(classroom => ({
            id: classroom.id.toString(),
            name: classroom.name,
            students: classroom.students,
            score: score
          })))
        }
        setLoading(false)
      }
    }
    
    checkRoleAndLoadClassrooms()
  }, [router, userId])

  if (!isTeacher || loading) return null

  const handleSearch = () => {
    if (!searchId.trim()) return
    router.push(`/classroom/manage/${searchId}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ваши классы</h1>
        <Button onClick={() => router.push('/classroom/create')}>
          Создать класс
        </Button>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Введите ID класса"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 rounded border flex-1"
        />
        <Button onClick={handleSearch}>Поиск</Button>
      </div>
      
      <div className="grid gap-4">
        {classrooms.map((classroom) => (
          <div key={classroom.id} className="flex gap-2">
            <Button
              onClick={() => router.push(`/classroom/manage?id=${classroom.id}`)}
              variant="outline"
              className="h-auto p-4 flex-1 justify-start"
            >
              <div>
                <h2 className="text-xl font-semibold">{classroom.name}</h2>
                <p className="text-gray-600">
                  {classroom.students?.length || 0} учеников | Успеваемость: {classroom.score}
                </p>
              </div>
            </Button>
            <Button 
              variant="secondary"
              className="px-3 h-auto"
              onClick={() => navigator.clipboard.writeText(classroom.id)}
            >
              Скопировать ID
            </Button>
          </div>
        ))}

        {classrooms.length === 0 && (
          <p className="text-gray-500 text-center">У вас нету классов. Создайте новый!</p>
        )}
      </div>
    </div>
  )
}
