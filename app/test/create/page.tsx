'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { createTestAction } from "@/actions/tests-actions"
import { useAuth } from "@clerk/nextjs"

interface Question {
  title: string
  answers: string[]
  correctAnswer: number
  topic: string
}

export default function CreatePage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    title: '',
    answers: ['', '', '', ''],
    correctAnswer: 0,
    topic: ''
  })
  const [testName, setTestName] = useState('')

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...currentQuestion.answers]
    newAnswers[index] = value
    setCurrentQuestion({ ...currentQuestion, answers: newAnswers })
  }

  const addQuestion = () => {
    setQuestions([...questions, currentQuestion])
    setCurrentQuestion({
      title: '',
      answers: ['', '', '', ''],
      correctAnswer: 0,
      topic: ''
    })
  }

  const downloadJSON = () => {
    const jsonString = JSON.stringify(questions, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = 'questions.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  }

  const handlePublish = async () => {
    if (!testName || questions.length === 0 || !userId) return
    
    setIsPublishing(true)
    
    const test = {
      name: testName,
      body: questions,
      user_id: userId,
      created_at: new Date()
    }

    try {
      const result = await createTestAction(test)
      if (result.status === "success") {
        router.push("/test")
      }
      setIsPublishing(false)
    } catch (error) {
      console.error('Failed to create test:', error)
      setIsPublishing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Questions</h1>
      
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Test Name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Question"
          value={currentQuestion.title}
          onChange={(e) => setCurrentQuestion({ ...currentQuestion, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Topic"
          value={currentQuestion.topic}
          onChange={(e) => setCurrentQuestion({ ...currentQuestion, topic: e.target.value })}
          className="w-full p-2 border rounded"
        />
        
        {currentQuestion.answers.map((answer, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder={`Answer ${index + 1}`}
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="radio"
              name="correctAnswer"
              checked={currentQuestion.correctAnswer === index}
              onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
            />
          </div>
        ))}
        
        <button
          onClick={addQuestion}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Question
        </button>
      </div>

      {questions.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Added Questions:</h2>
            {questions.map((q, i) => (
              <div key={i} className="p-2 border rounded mb-2">
                <p><strong>Question:</strong> {q.title}</p>
                <p><strong>Topic:</strong> {q.topic}</p>
                <p><strong>Answers:</strong></p>
                <ul className="list-disc pl-6">
                  {q.answers.map((a, j) => (
                    <li key={j} className={j === q.correctAnswer ? 'font-bold' : ''}>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handlePublish}
            className="w-full"
            disabled={!testName || questions.length === 0 || isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish Test'}
          </Button>
        </>
      )}
    </div>
  )
}
