import SpaceBackground from "./space-background"

interface WinScreenProps {
  onOk: () => void
}

export default function WinScreen({ onOk }: WinScreenProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <SpaceBackground />

      <div className="absolute z-10 bg-black/80 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-green-500 mb-4">Спасибо за игру, человек из Сириуса</h2>
        <button
          onClick={onOk}
          className="px-6 py-3 text-xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Ок
        </button>
      </div>
    </div>
  )
}

