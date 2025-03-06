import type { Difficulty } from "@/types/game"
import Image from "next/image"

interface GameUIProps {
  difficulty: Difficulty
  timeRemaining: number
}

export default function GameUI({ difficulty, timeRemaining }: GameUIProps) {
  // Map difficulty to display text
  const difficultyText = {
    easy: "Легкая",
    medium: "Средняя",
    hard: "Тяжелая",
  }

  return (
    <div className="absolute top-4 right-4 z-20 bg-black/70 text-white p-2 rounded-lg flex items-center space-x-4">
      <div>
        <span className="mr-2">Сложность:</span>
        <span className="font-bold">{difficultyText[difficulty]}</span>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Осталось до</span>
        <Image src="/images/moon-icon.png" alt="Moon" width={20} height={20} className="inline-block mr-1" />
        <div className="w-24 h-4 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(timeRemaining / 60) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

