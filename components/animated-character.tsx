"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCharacterProps {
  character: string
  delay?: number
}

export function AnimatedCharacter({ character, delay = 0 }: AnimatedCharacterProps) {
  const [displayChar, setDisplayChar] = useState(character)
  const [isFlipping, setIsFlipping] = useState(false)
  const prevCharRef = useRef(character)

  useEffect(() => {
    if (prevCharRef.current !== character) {
      // Start flip animation
      const flipTimeout = setTimeout(() => {
        setIsFlipping(true)

        // Change character at midpoint of flip
        const changeTimeout = setTimeout(() => {
          setDisplayChar(character)
        }, 150)

        // End flip animation
        const endTimeout = setTimeout(() => {
          setIsFlipping(false)
          prevCharRef.current = character
        }, 300)

        return () => {
          clearTimeout(changeTimeout)
          clearTimeout(endTimeout)
        }
      }, delay)

      return () => clearTimeout(flipTimeout)
    }
  }, [character, delay])

  return (
    <div className="relative w-[38px] h-[50px] sm:w-[62px] sm:h-[82px] perspective-[400px]">
      <div
        className={`
          w-full h-full flex items-center justify-center
          bg-white border sm:border-2 border-slate-300 rounded-sm sm:rounded-md
          text-[38px] sm:text-[64px] font-mono font-bold text-slate-800
          shadow-sm
          transition-transform duration-300 ease-in-out
          ${isFlipping ? "rotate-x-90" : "rotate-x-0"}
        `}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {displayChar}
      </div>
    </div>
  )
}
