'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { getTestsAction } from '@/actions/tests-actions'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Test {
  id: number
  title: string
  description: string
  body: any[]
  name: string
}

export default function ChooseTestPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadTests() {
      const result = await getTestsAction()
      if (result.status === 'success' && result.data) {
        setTests(result.data)
      }
      setIsLoading(false)
    }
    loadTests()
  }, [])

  if (isLoading) {
    return <div className="p-8 text-white">Loading tests...</div>
  }

  if (!tests.length) {
    return <div className="p-8 text-white">No tests available.</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Choose a Test</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((test) => (
          <Card 
            key={test.id} 
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => router.push(`/test?id=${test.id}`)}
          >
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white">{test.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-gray-300">{test.description}</p>
              <p className="text-white mt-2">{test.name}</p>
              <p className="text-sm text-gray-400 mt-1">
                {test.body.length} questions
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
