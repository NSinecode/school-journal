'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getClassroomByIdAction } from '@/actions/classroom-actions'
import { SelectClassroom } from '@/db/schema/classroom-schema'
import { SelectCourse } from '@/db/schema/course-schema'

type ClassroomWithHomework = SelectClassroom & {
  homeworkDetails?: SelectCourse[];
}

export default function ClassroomViewPage() {
  const searchParams = useSearchParams()
  const [classroom, setClassroom] = useState<ClassroomWithHomework | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const classroomId = parseInt(searchParams.get('id') as string)
        const response = await getClassroomByIdAction(classroomId)
        
        if (response.status === 'success' && response.data) {
          setClassroom(response.data)
        } else {
          setError('Failed to load classroom')
        }
      } catch (err) {
        console.error('Error fetching classroom:', err)
        setError('An error occurred while fetching classroom data')
      } finally {
        setLoading(false)
      }

    }

    if (searchParams.get('id')) {
      fetchClassroom()
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !classroom) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
          <p className="text-destructive">{error || 'Classroom not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-card shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">{classroom.name}</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Class Details</h2>
            <p className="text-muted-foreground">Teacher ID: {classroom.teacher_id}</p>
            <p className="text-muted-foreground">Created: {new Date(classroom.created_at).toLocaleDateString()}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Students</h2>
            {classroom.students && classroom.students.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {classroom.students.map((studentId, index) => (
                  <li key={index} className="text-muted-foreground">{studentId}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No students enrolled yet</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Homework</h2>
            {classroom.homeworkDetails && classroom.homeworkDetails.length > 0 ? (
              <ul className="divide-y">
                {(classroom.homeworkDetails as SelectCourse[]).map((course) => (
                  <li key={course.id} className="py-2">
                    <div className="flex items-center space-x-3">
                      {course.image_url && (
                        <img 
                          src={course.image_url} 
                          alt={course.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        {course.description && (
                          <p className="text-sm text-muted-foreground">{course.description}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No homework assigned yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
