import Image from "next/image"

export default function MoonSprite() {
  return (
    <div className="relative">
      <Image src="/images/moon.png" alt="Moon" width={200} height={400} className="object-contain" />
    </div>
  )
}

