'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { getTestsAction } from '@/actions/tests-actions'
import { useSession } from '@clerk/nextjs'
import { saveTestCompletionAction } from '@/actions/tests-actions'

export default function TestPage({test_id, goToPres}) {
  const { session } = useSession()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set())

  const [userAnswers, setUserAnswers] = useState({})
  const [showSummary, setShowSummary] = useState(false)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [testTitle, setTestTitle] = useState('')
  const testId = test_id;
  useEffect(() => {
    async function loadQuestions() {
      if (!testId) return
      
      const result = await getTestsAction()
      if (result.status === 'success' && result.data) {
        const selectedTest = result.data.find((test) => Number(test.id) === Number(testId));
        if (selectedTest) {
          setQuestions(selectedTest.body || [])
          setTestTitle(selectedTest.title)
          setIsLoading(false)
          
          localStorage.removeItem('quizScore');
          localStorage.removeItem('answeredQuestions');
          localStorage.removeItem('userAnswers');
        } else {
          // Test not found - redirect back
        }
      }
    }
    loadQuestions()
  }, [testId])

  useEffect(() => {
    setSelectedAnswer(userAnswers[currentQuestion] ?? null)
  }, [currentQuestion, userAnswers])

  useEffect(() => {
    const savedScore = localStorage.getItem('quizScore')
    const savedAnswered = localStorage.getItem('answeredQuestions') 
    const savedUserAnswers = localStorage.getItem('userAnswers')

    if (savedScore) setScore(parseInt(savedScore))
    if (savedAnswered) setAnsweredQuestions(new Set(JSON.parse(savedAnswered)))
    if (savedUserAnswers) setUserAnswers(JSON.parse(savedUserAnswers))
  }, [])

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index)
    if (!answeredQuestions.has(currentQuestion)) {
      if (index === questions[currentQuestion].correctAnswer) {
        const newScore = score + 1
        setScore(newScore)
        localStorage.setItem('quizScore', newScore.toString())
      }
      
      const newAnswered = new Set(answeredQuestions).add(currentQuestion)
      setAnsweredQuestions(newAnswered)
      localStorage.setItem('answeredQuestions', JSON.stringify(Array.from(newAnswered)))

      const newUserAnswers = { ...userAnswers, [currentQuestion]: index }
      setUserAnswers(newUserAnswers)
      localStorage.setItem('userAnswers', JSON.stringify(newUserAnswers))
    }
  }

  const getButtonStyle = (index) => {
    if (!answeredQuestions.has(currentQuestion)) {
      return selectedAnswer === index ? "bg-white/10 text-white" : "text-white hover:text-white hover:bg-white/10"
    }

    if (index === questions[currentQuestion].correctAnswer) {
      return "bg-green-500 text-white hover:bg-green-500"
    }
    
    return selectedAnswer === index 
      ? "bg-red-500 text-white hover:bg-red-500" 
      : "text-white hover:text-white hover:bg-white/10"
  }

  const handleFinishTest = async () => {
    if (!session?.user?.id || !testId) return
    
    const completion = {
      user_id: session.user.id,
      choices: userAnswers
    }
    
    await saveTestCompletionAction(Number(testId), completion)
    setShowSummary(true)
  }

  if (isLoading) {
    return <div className="p-8 text-white">Loading questions...</div>
  }

  if (!questions.length) {
    return <div className="p-8 text-white">No questions available.</div>
  }

  if (showSummary) {
    const incorrectQuestions = questions.filter((q, idx) => userAnswers[idx] !== q.correctAnswer)
    const topicMistakes = incorrectQuestions.reduce((acc, q) => {
      acc[q.topic] = (acc[q.topic] || 0) + 1
      return acc
    }, {})

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-2xl">Quiz Summary</h2>
          <div className="text-white text-xl">
            Final Score: {score}/{questions.length}
          </div>
        </div>

        {Object.keys(topicMistakes).length > 0 && (
          <div className="mb-8 p-4 rounded-lg border border-yellow-500 bg-yellow-500/10">
            <h3 className="text-white mb-2">Topics to Review:</h3>
            <ul className="space-y-1">
              {Object.entries(topicMistakes).map(([topic, count]) => (
                <li key={topic} className="text-yellow-200">
                  {topic}: {count} mistake{count > 1 ? 's' : ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6">
          {questions.map((question, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg border ${
                userAnswers[idx] === question.correctAnswer
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-red-500 bg-red-500/10'
              }`}
            >
              <p className="text-white mb-2">{idx + 1}. {question.title}</p>
              <div className="text-sm">
                <p className="text-green-400">
                  Correct: {String.fromCharCode(65 + question.correctAnswer)}: {question.answers[question.correctAnswer]}
                </p>
                {userAnswers[idx] !== question.correctAnswer && (
                  <p className="text-red-400">
                    Your answer: {String.fromCharCode(65 + userAnswers[idx])}: {question.answers[userAnswers[idx]]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => setShowSummary(false)}
          >
            Return to Questions
          </Button>
          <Button
            variant="secondary"
            onClick={() => goToPres()}
          >
            Go back to presentation
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{testTitle}</h1>
          <h2 className="text-lightgray-600">Question {currentQuestion + 1} of {questions.length}</h2>
        </div>
        <div className="text-white">
          Score: {score}
        </div>
      </div>

      <div className="border-t border-b border-dashed border-gray-300 py-8">
        <div className="mb-8">
          <p className="text-white text-lg">
            {questions[currentQuestion].title}
          </p>
        </div>

        <div className="space-y-4">
          {questions[currentQuestion].answers.map((answer, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-between ${getButtonStyle(index)}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <span>
                {String.fromCharCode(65 + index)}: {answer}
              </span>
              <span className="text-gray-400">↺</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button 
          variant="outline"
          className="text-white hover:text-white hover:bg-white/10"
          onClick={() => {
            setCurrentQuestion(Math.max(0, currentQuestion - 1))
            setSelectedAnswer(null)
          }}
          disabled={currentQuestion === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (currentQuestion === questions.length - 1) {
              if (answeredQuestions.size === questions.length) {
                handleFinishTest()
              }
            } else {
              setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))
              setSelectedAnswer(null)
            }
          }}
          disabled={!answeredQuestions.has(currentQuestion) && selectedAnswer === null}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
