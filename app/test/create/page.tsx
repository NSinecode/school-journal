'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { createTestAction } from "@/actions/tests-actions"
import { useAuth } from "@clerk/nextjs"
import { getUserRole } from '@/actions/profiles-actions'
import { TrashIcon } from "lucide-react"

interface Question {
  title: string
  answers: string[]
  correctAnswer: number
  topic: string
}

export default function CreatePage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [isTeacher, setIsTeacher] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    title: '',
    answers: ['', '', '', ''],
    correctAnswer: 0,
    topic: ''
  })
  const [testName, setTestName] = useState('')

  useEffect(() => {
    const checkRole = async () => {
      const role = await getUserRole()
      if (role !== 'teacher') {
        router.push('/test/choose-test')
      } else {
        setIsTeacher(true)
      }
    }
    
    checkRole()
  }, [router])

  if (!isTeacher) return null

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


  const handlePublish = async () => {
    if (!testName || questions.length === 0 || !userId) return
    
    setIsPublishing(true)
    
    const test = {
      name: testName,
      body: questions,
      user_id: userId,
      created_at: new Date(),
      completion: {}
    }

    try {
      const result = await createTestAction(test)
      if (result.status === "success") {
        router.push("/test/choose-test")
      }
      setIsPublishing(false)
    } catch (error) {
      console.error('Failed to create test:', error)
      setIsPublishing(false)
    }
  }

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Создайте вопросы</h1>
      
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Название теста"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Вопрос"
          value={currentQuestion.title}
          onChange={(e) => setCurrentQuestion({ ...currentQuestion, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Тема"
          value={currentQuestion.topic}
          onChange={(e) => setCurrentQuestion({ ...currentQuestion, topic: e.target.value })}
          className="w-full p-2 border rounded"
        />
        
        {currentQuestion.answers.map((answer, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder={`Ответ ${index + 1}`}
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
          Добавить вопрос
        </button>
      </div>

      {questions.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Вопросы:</h2>
            {questions.map((q, i) => (
              <div key={i} className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>Вопрос:</strong> {q.title}</p>
                      <p><strong>Тема:</strong> {q.topic}</p>
                      <p><strong>Ответы:</strong></p>
                      <ul className="list-disc pl-6">
                        {q.answers.map((a, j) => (
                          <li key={j} className={j === q.correctAnswer ? 'font-bold' : ''}>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteQuestion(i)}
                        >
                          <TrashIcon />
                          Удалить вопрос
                        </Button>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setCurrentQuestion(q)
                            handleDeleteQuestion(i)
                          }}
                        >
                          Изменить вопрос
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handlePublish}
            className="w-full"
            disabled={!testName || questions.length === 0 || isPublishing}
          >
            {isPublishing ? 'Публикация...' : 'Опубликовать тест'}
          </Button>
        </>
      )}
    </div>
  )
}
