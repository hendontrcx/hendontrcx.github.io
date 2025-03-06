import SpaceBackground from "./space-background"

interface EndScreenProps {
  onRestart: () => void
}

export default function EndScreen({ onRestart }: EndScreenProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <SpaceBackground />

      <div className="absolute z-10 bg-black/80 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Вы проиграли</h2>
        <button
          onClick={onRestart}
          className="px-6 py-3 text-xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Заново
        </button>
      </div>
    </div>
  )
}

