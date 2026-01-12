"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatedCharacter } from "./animated-character"

interface LicensePlateProps {
  letters: string
  numbers: string
  state: string
  backgroundColor?: string
  textColor?: string
}

export function LicensePlate({
  letters,
  numbers,
  state,
  backgroundColor = "bg-gradient-to-b from-amber-50 to-amber-100",
  textColor = "text-blue-800",
}: LicensePlateProps) {
  const [displayState, setDisplayState] = useState(state)
  const [isStateAnimating, setIsStateAnimating] = useState(false)
  const prevStateRef = useRef(state)

  // Animate state text changes
  useEffect(() => {
    if (prevStateRef.current !== state) {
      setIsStateAnimating(true)

      const timeout = setTimeout(() => {
        setDisplayState(state)
        setIsStateAnimating(false)
        prevStateRef.current = state
      }, 200)

      return () => clearTimeout(timeout)
    }
  }, [state])

  // Ensure letters and numbers are properly formatted
  const letterChars = letters.toUpperCase().padEnd(3, " ").slice(0, 3).split("")
  const numberChars = numbers.padStart(3, "0").slice(0, 3).split("")

  return (
    <div className="flex flex-col items-center gap-4">
      {/* License Plate - 2:1 aspect ratio like real US plates */}
      <div className={`relative w-[448px] aspect-[2/1] ${backgroundColor} border-[5px] border-slate-700 rounded-xl shadow-xl flex flex-col items-center justify-center`}>
        {/* Bolt holes */}
        <div className="absolute top-2 left-3 w-3.5 h-3.5 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute top-2 right-3 w-3.5 h-3.5 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute bottom-2 left-3 w-3.5 h-3.5 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute bottom-2 right-3 w-3.5 h-3.5 rounded-full bg-slate-400 border border-slate-500" />

        {/* State name with fade animation */}
        <div className="text-center h-7 overflow-hidden mb-4">
          <p
            className={`
              text-xl font-bold tracking-widest ${textColor} uppercase
              transition-all duration-200 ease-in-out
              ${isStateAnimating ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}
            `}
          >
            {displayState}
          </p>
        </div>

        {/* Plate characters */}
        <div className="flex items-center justify-center gap-1">
          {/* Letters */}
          <div data-testid="plate-letters" className="flex gap-0.5">
            {letterChars.map((char, index) => (
              <AnimatedCharacter key={`letter-${index}`} character={char} delay={index * 50} />
            ))}
          </div>

          {/* Separator */}
          <div className="w-5 h-[72px] flex items-center justify-center">
            <span className="text-5xl font-bold text-slate-600">-</span>
          </div>

          {/* Numbers */}
          <div data-testid="plate-number" className="flex gap-0.5">
            {numberChars.map((char, index) => (
              <AnimatedCharacter key={`number-${index}`} character={char} delay={(index + 3) * 50} />
            ))}
          </div>
        </div>

        {/* Decorative bottom text */}
        <p className="text-center text-base text-slate-500 tracking-wider mt-4">LICENSE TO SPELL</p>
      </div>
    </div>
  )
}
