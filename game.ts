export type GameState = "start" | "playing" | "gameover" | "win"
export type Difficulty = "easy" | "medium" | "hard"

export interface Asteroid {
  id: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  speed: number
  rotationSpeed: number
  type: number // 1-5 for different asteroid images
}

export interface Rocket {
  x: number
  y: number
  width: number
  height: number
}

export interface AsteroidSpeed {
  slow: number
  medium: number
  fast: number
  veryFast: number
}

export interface DifficultySettings {
  slow: number
  medium: number
  fast: number
  veryFast: number
}

