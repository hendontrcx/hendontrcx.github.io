import type { Asteroid } from "@/types/game"
import Image from "next/image"

interface AsteroidSpriteProps {
  asteroid: Asteroid
}

export default function AsteroidSprite({ asteroid }: AsteroidSpriteProps) {
  // Map asteroid type to image path
  const asteroidImages = [
    "/images/asteroid1.png",
    "/images/asteroid2.png",
    "/images/asteroid3.png",
    "/images/asteroid4.png",
    "/images/asteroid5.png",
  ]

  return (
    <div
      className="absolute"
      style={{
        left: `${asteroid.x}px`,
        top: `${asteroid.y}px`,
        width: `${asteroid.width}px`,
        height: `${asteroid.height}px`,
        transform: `rotate(${asteroid.rotation}deg)`,
        transition: "transform 0.1s linear",
      }}
    >
      <Image
        src={asteroidImages[asteroid.type - 1] || "/placeholder.svg"}
        alt="Asteroid"
        width={60}
        height={60}
        className="w-full h-full object-contain"
      />
    </div>
  )
}

