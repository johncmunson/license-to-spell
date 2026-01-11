"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatedCharacter } from "./animated-character"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

interface LicensePlateProps {
  letters: string
  numbers: string
  state: string
  onRequestRandomize?: () => void
  backgroundColor?: string
  textColor?: string
}

export function LicensePlate({
  letters,
  numbers,
  state,
  onRequestRandomize,
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
      {/* License Plate */}
      <div className={`relative ${backgroundColor} border-4 border-slate-700 rounded-lg p-4 shadow-xl`}>
        {/* Bolt holes */}
        <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute top-2 right-3 w-3 h-3 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute bottom-2 left-3 w-3 h-3 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute bottom-2 right-3 w-3 h-3 rounded-full bg-slate-400 border border-slate-500" />

        {/* State name with fade animation */}
        <div className="text-center mb-2 h-6 overflow-hidden">
          <p
            className={`
              text-sm font-bold tracking-widest ${textColor} uppercase
              transition-all duration-200 ease-in-out
              ${isStateAnimating ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}
            `}
          >
            {displayState}
          </p>
        </div>

        {/* Plate characters */}
        <div className="flex items-center gap-1">
          {/* Letters */}
          {letterChars.map((char, index) => (
            <AnimatedCharacter key={`letter-${index}`} character={char} delay={index * 50} />
          ))}

          {/* Separator */}
          <div className="w-4 h-14 flex items-center justify-center">
            <span className="text-3xl font-bold text-slate-600">-</span>
          </div>

          {/* Numbers */}
          {numberChars.map((char, index) => (
            <AnimatedCharacter key={`number-${index}`} character={char} delay={(index + 3) * 50} />
          ))}
        </div>

        {/* Decorative bottom text */}
        <p className="text-center mt-2 text-xs text-slate-500 tracking-wider">LICENSE TO SPELL</p>
      </div>

      {/* Randomize Button */}
      {onRequestRandomize && (
        <Button onClick={onRequestRandomize} variant="outline" className="gap-2 bg-transparent">
          <Shuffle className="w-4 h-4" />
          Randomize Plate
        </Button>
      )}
    </div>
  )
}
