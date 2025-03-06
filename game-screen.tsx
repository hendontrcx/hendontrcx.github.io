"use client"

import { useState, useEffect, useRef } from "react"
import type { Difficulty, Asteroid, Rocket, DifficultySettings } from "@/types/game"
import SpaceBackground from "./space-background"
import GameUI from "./game-ui"
import RocketSprite from "./rocket-sprite"
import AsteroidSprite from "./asteroid-sprite"
import MoonSprite from "./moon-sprite"

interface GameScreenProps {
  difficulty: Difficulty
  timeElapsed: number
  onGameOver: () => void
}

// Define difficulty settings
const difficultySettings: Record<Difficulty, DifficultySettings> = {
  easy: { slow: 90, medium: 0, fast: 10, veryFast: 0 },
  medium: { slow: 0, medium: 75, fast: 25, veryFast: 0 },
  hard: { slow: 0, medium: 0, fast: 60, veryFast: 40 },
}

// Define asteroid speeds (pixels per frame)
const asteroidSpeeds = {
  slow: 2,
  medium: 4,
  fast: 6,
  veryFast: 8,
}

export default function GameScreen({ difficulty, timeElapsed, onGameOver }: GameScreenProps) {
  const gameRef = useRef<HTMLDivElement>(null)
  const rocketRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const [rocket, setRocket] = useState<Rocket>({
    x: 100, // Fixed position on the left side
    y: 300, // Will be adjusted on mount
    width: 80,
    height: 40,
  })
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [showMoon, setShowMoon] = useState(false)
  const [isCollided, setIsCollided] = useState(false)
  const lastFrameTime = useRef(0)
  const animationRef = useRef<number>(0)
  const asteroidId = useRef(0)

  // Initialize game dimensions and position rocket
  useEffect(() => {
    if (gameRef.current) {
      const { height } = gameRef.current.getBoundingClientRect()
      setRocket((prev) => ({
        ...prev,
        y: height / 2 - prev.height / 2,
      }))
    }

    // Show moon near the end of the game
    if (timeElapsed >= 55) {
      setShowMoon(true)
    }
  }, [timeElapsed])

  // Handle asteroid generation
  useEffect(() => {
    const generateAsteroid = () => {
      if (!gameRef.current) return

      const { width, height } = gameRef.current.getBoundingClientRect()

      // Determine asteroid speed based on difficulty
      const settings = difficultySettings[difficulty]
      const rand = Math.random() * 100

      let speed: number
      let rotationSpeed: number

      if (rand < settings.slow) {
        speed = asteroidSpeeds.slow
        rotationSpeed = 0.5
      } else if (rand < settings.slow + settings.medium) {
        speed = asteroidSpeeds.medium
        rotationSpeed = 1
      } else if (rand < settings.slow + settings.medium + settings.fast) {
        speed = asteroidSpeeds.fast
        rotationSpeed = 2
      } else {
        speed = asteroidSpeeds.veryFast
        rotationSpeed = 3
      }

      // Random asteroid size (30-60px)
      const size = 30 + Math.random() * 30

      const newAsteroid: Asteroid = {
        id: asteroidId.current++,
        x: width + size, // Start from right side of screen
        y: Math.random() * (height - size),
        width: size,
        height: size,
        rotation: Math.random() * 360,
        speed,
        rotationSpeed,
        type: Math.floor(Math.random() * 5) + 1, // Random asteroid type (1-5)
      }

      setAsteroids((prev) => [...prev, newAsteroid])
    }

    // Generate asteroids at random intervals
    const asteroidInterval = setInterval(() => {
      if (timeElapsed >= 3) {
        // Start generating asteroids after 3 seconds
        generateAsteroid()
      }
    }, 800) // Adjust interval for asteroid density

    return () => {
      clearInterval(asteroidInterval)
    }
  }, [difficulty, timeElapsed])

  // Game loop
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastFrameTime.current) {
        lastFrameTime.current = timestamp
      }

      const deltaTime = timestamp - lastFrameTime.current
      lastFrameTime.current = timestamp

      // Update asteroid positions
      setAsteroids((prev) => {
        return prev
          .map((asteroid) => ({
            ...asteroid,
            x: asteroid.x - asteroid.speed,
            rotation: (asteroid.rotation + asteroid.rotationSpeed) % 360,
          }))
          .filter((asteroid) => asteroid.x + asteroid.width > 0) // Remove asteroids that are off-screen
      })

      // Check for collisions
      if (!isCollided) {
        const rocketHitbox = {
          x: rocket.x + 10, // Adjust hitbox to be smaller than sprite
          y: rocket.y + 5,
          width: rocket.width - 20,
          height: rocket.height - 10,
        }

        // Check collision with asteroids
        const collision = asteroids.some((asteroid) => {
          // Simple rectangular collision detection
          return (
            rocketHitbox.x < asteroid.x + asteroid.width &&
            rocketHitbox.x + rocketHitbox.width > asteroid.x &&
            rocketHitbox.y < asteroid.y + asteroid.height &&
            rocketHitbox.y + rocketHitbox.height > asteroid.y
          )
        })

        if (collision) {
          setIsCollided(true)
          setTimeout(() => {
            onGameOver()
          }, 1500) // Show explosion for 1.5 seconds before game over
        }

        // Check collision with moon (win condition)
        if (showMoon) {
          const moonX = gameRef.current?.getBoundingClientRect().width ?? 0
          const moonWidth = 200

          if (
            rocketHitbox.x + rocketHitbox.width > moonX - moonWidth &&
            rocketHitbox.y + rocketHitbox.height > 100 &&
            rocketHitbox.y < 500
          ) {
            // Win condition
            cancelAnimationFrame(animationRef.current)
            setTimeout(() => {
              onGameOver() // This will trigger win screen via parent component
            }, 500)
          }
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [rocket, isCollided, showMoon, onGameOver, asteroids])

  // Handle rocket dragging
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (rocketRef.current?.contains(e.target as Node)) {
        isDragging.current = true
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && gameRef.current) {
        const { top } = gameRef.current.getBoundingClientRect()
        const newY = e.clientY - top - rocket.height / 2

        // Keep rocket within game bounds
        const maxY = (gameRef.current.clientHeight || 0) - rocket.height
        const clampedY = Math.max(0, Math.min(newY, maxY))

        setRocket((prev) => ({
          ...prev,
          y: clampedY,
        }))
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [rocket])

  return (
    <div ref={gameRef} className="relative w-full h-full overflow-hidden">
      <SpaceBackground />

      {/* Game UI */}
      <GameUI difficulty={difficulty} timeRemaining={60 - timeElapsed} />

      {/* Rocket */}
      <div
        ref={rocketRef}
        className="absolute z-10 cursor-grab active:cursor-grabbing"
        style={{
          left: `${rocket.x}px`,
          top: `${rocket.y}px`,
          width: `${rocket.width}px`,
          height: `${rocket.height}px`,
          pointerEvents: isCollided ? "none" : "auto",
        }}
      >
        {isCollided ? (
          <div className="w-full h-full">
            <Image
              src="/images/explosion.gif"
              alt="Explosion"
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <RocketSprite />
        )}
      </div>

      {/* Asteroids */}
      {asteroids.map((asteroid) => (
        <AsteroidSprite key={asteroid.id} asteroid={asteroid} />
      ))}

      {/* Moon (finish line) */}
      {showMoon && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-5">
          <MoonSprite />
        </div>
      )}
    </div>
  )
}

