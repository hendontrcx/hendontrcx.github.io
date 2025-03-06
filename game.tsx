"use client"

import { useState, useEffect, useRef } from "react"
import StartScreen from "./start-screen"
import GameScreen from "./game-screen"
import EndScreen from "./end-screen"
import WinScreen from "./win-screen"
import type { GameState, Difficulty } from "@/types/game"

export default function Game() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const gameTimer = useRef<NodeJS.Timeout | null>(null)

  // Reset game state when game ends
  useEffect(() => {
    if (gameState === "playing") {
      // Start timer for game duration
      gameTimer.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1
          // Game lasts about 60 seconds
          if (newTime >= 60) {
            clearInterval(gameTimer.current as NodeJS.Timeout)
            setGameState("win")
          }
          return newTime
        })
      }, 1000)
    } else if (gameTimer.current) {
      clearInterval(gameTimer.current)
    }

    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current)
      }
    }
  }, [gameState])

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty)
    setTimeElapsed(0)
    setGameState("playing")
  }

  const handleGameOver = () => {
    setGameState("gameover")
  }

  const resetGame = () => {
    setGameState("start")
  }

  return (
    <div className="relative w-full h-full">
      {gameState === "start" && <StartScreen onStart={startGame} />}
      {gameState === "playing" && (
        <GameScreen difficulty={difficulty} timeElapsed={timeElapsed} onGameOver={handleGameOver} />
      )}
      {gameState === "gameover" && <EndScreen onRestart={resetGame} />}
      {gameState === "win" && <WinScreen onOk={resetGame} />}
    </div>
  )
}

