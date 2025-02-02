'use client'

import questions from './questions.json'
import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lightgray-600">Question {currentQuestion + 1} of {questions.length}</h2>
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
              className={`w-full justify-between ${
                selectedAnswer === index 
                  ? "bg-blue-500 text-white hover:bg-blue-500" 
                  : "text-white hover:text-white hover:bg-white/10"
              }`}
              onClick={() => setSelectedAnswer(index)}
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
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
