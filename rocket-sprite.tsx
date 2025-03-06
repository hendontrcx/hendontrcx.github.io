"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function RocketSprite() {
  const [spriteIndex, setSpriteIndex] = useState(0)
  const sprites = ["/images/rocket1.jpg", "/images/rocket2.jpg", "/images/rocket3.jpg"]

  // Animate rocket flame
  useEffect(() => {
    const interval = setInterval(() => {
      setSpriteIndex((prev) => (prev + 1) % sprites.length)
    }, 300) // Change sprite every 0.3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full">
      <Image
        src={sprites[spriteIndex] || "/placeholder.svg"}
        alt="Rocket"
        width={80}
        height={40}
        className="w-full h-full object-contain"
      />
    </div>
  )
}

