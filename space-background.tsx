"use client"

import { useEffect, useRef } from "react"

export default function SpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgPosition = useRef(0)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const animate = () => {
      if (!containerRef.current) return

      // Move background slightly to create scrolling effect
      bgPosition.current -= 0.5
      containerRef.current.style.backgroundPosition = `${bgPosition.current}px 0`

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 bg-repeat-x"
      style={{
        backgroundImage: `url('/images/space-bg.jpg')`,
        backgroundSize: "auto 100%",
      }}
    />
  )
}

