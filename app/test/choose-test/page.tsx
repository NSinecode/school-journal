'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTestsAction } from '@/actions/tests-actions'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Test {
  id: number
  title: string
  description: string
  body: JSON[]
  name: string
}

export default function ChooseTestPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchId, setSearchId] = useState('')
  const [error, setError] = useState('')
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

  const handleSearch = () => {
    if (!searchId.trim()) return
    // Just redirect - the test page will handle invalid IDs
    router.push(`/test?id=${searchId}`)
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <p className="text-white text-xl mb-4">{error}</p>
        <Button onClick={() => setError('')}>
          Choose Another Test
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-8 text-white">Loading tests...</div>
  }

  if (!tests.length) {
    return <div className="p-8 text-white">No tests available.</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4">
        <input
          type="number"
          placeholder="Enter test ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 rounded bg-white/5 border border-white/10 text-white"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">Choose a Test</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((test) => (
          <Card 
            key={test.id} 
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => router.push(`/test?id=${test.id}`)}
          >
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white">
                {test.title} (ID: {test.id})
              </CardTitle>
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
