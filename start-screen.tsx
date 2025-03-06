"use client"

import { useState } from "react"
import type { Difficulty } from "@/types/game"
import SpaceBackground from "./space-background"

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [showDifficulty, setShowDifficulty] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handlePlay = () => {
    setShowDifficulty(true)
  }

  const handleDifficultySelect = (difficulty: Difficulty) => {
    onStart(difficulty)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <SpaceBackground />

      <div className="absolute z-10 flex flex-col items-center">
        {!showDifficulty ? (
          <button
            onClick={handlePlay}
            className="px-8 py-4 text-2xl font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
          >
            Играть
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-8 py-4 text-xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Выберите сложность
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleDifficultySelect("easy")}
                  className="w-full px-4 py-2 text-white hover:bg-gray-700 text-left"
                >
                  Легкая
                </button>
                <button
                  onClick={() => handleDifficultySelect("medium")}
                  className="w-full px-4 py-2 text-white hover:bg-gray-700 text-left"
                >
                  Средняя
                </button>
                <button
                  onClick={() => handleDifficultySelect("hard")}
                  className="w-full px-4 py-2 text-white hover:bg-gray-700 text-left"
                >
                  Тяжелая
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

