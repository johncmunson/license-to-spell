"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatedCharacter } from "./animated-character"

// TODO - Better Bolts
// <div className="absolute"><Bolt className="top-[4px] left-[4px] md:h-6 md:w-6" rotation={12} /></div>
// function Bolt({ className, rotation = 0 }: { className?: string; rotation?: number }) {
//   return (
//     <div
//       className={cn(
//         "absolute rounded-full",
//         // Default fixed size
//         "w-4 h-4",
//         // Metallic gradient effect
//         "bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600",
//         // Inner shadow for depth
//         "shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),inset_0_-1px_2px_rgba(0,0,0,0.3)]",
//         // Border for definition
//         "border border-zinc-500",
//         className,
//       )}
//     >
//       {/* Bolt cross/slot - rotation applied here */}
//       <div
//         className="absolute inset-0 flex items-center justify-center"
//         style={{ transform: `rotate(${rotation}deg)` }}
//       >
//         <div className="absolute bg-zinc-600 w-1/2 h-[8%] rounded-full" />
//         <div className="absolute bg-zinc-600 h-1/2 w-[8%] rounded-full" />
//       </div>
//     </div>
//   )
// }

interface LicensePlateProps {
  letters: string
  numbers: string
  state: string
  motto?: string
  backgroundColor?: string
  textColor?: string
}

export function LicensePlate({
  letters,
  numbers,
  state,
  motto = "LICENSE TO SPELL",
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
    <div className="flex flex-col items-center gap-4 w-full px-2 sm:px-0">
      {/* License Plate - 2:1 aspect ratio like real US plates */}
      <div
        className={`relative w-full max-w-[512px] aspect-[2/1] ${backgroundColor} border-[3px] sm:border-[5px] border-slate-700 rounded-lg sm:rounded-xl shadow-xl flex flex-col items-center justify-center px-2 sm:px-0`}
      >
        {/* Bolt holes */}
        <div className="absolute top-1.5 sm:top-2.5 left-2 sm:left-4 w-2.5 sm:w-4 h-2.5 sm:h-4 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute top-1.5 sm:top-2.5 right-2 sm:right-4 w-2.5 sm:w-4 h-2.5 sm:h-4 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute bottom-1.5 sm:bottom-2.5 left-2 sm:left-4 w-2.5 sm:w-4 h-2.5 sm:h-4 rounded-full bg-slate-400 border border-slate-500" />
        <div className="absolute bottom-1.5 sm:bottom-2.5 right-2 sm:right-4 w-2.5 sm:w-4 h-2.5 sm:h-4 rounded-full bg-slate-400 border border-slate-500" />

        {/* State name with fade animation */}
        <div
          className="text-center overflow-hidden"
          style={{
            height: "clamp(1.5rem, 5vw, 2.25rem)",
            marginBottom: "clamp(0.5rem, 2vw, 1rem)",
          }}
        >
          <p
            className={`
              font-bold tracking-widest ${textColor} uppercase
              transition-all duration-200 ease-in-out
              ${isStateAnimating ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}
            `}
            style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
          >
            {displayState}
          </p>
        </div>

        {/* Plate characters */}
        <div className="flex items-center justify-center gap-0.5 sm:gap-1.5">
          {/* Letters */}
          <div data-testid="plate-letters" className="flex gap-0.5 sm:gap-1">
            {letterChars.map((char, index) => (
              <AnimatedCharacter
                key={`letter-${index}`}
                character={char}
                delay={index * 50}
              />
            ))}
          </div>

          {/* Separator */}
          <div
            className="flex items-center justify-center"
            style={{
              width: "clamp(1rem, 3vw, 1.5rem)",
              height: "clamp(50px, 16vw, 82px)",
            }}
          >
            <span
              className="font-bold text-slate-600"
              style={{ fontSize: "clamp(2.25rem, 8vw, 3.75rem)" }}
            >
              -
            </span>
          </div>

          {/* Numbers */}
          <div data-testid="plate-number" className="flex gap-0.5 sm:gap-1">
            {numberChars.map((char, index) => (
              <AnimatedCharacter
                key={`number-${index}`}
                character={char}
                delay={(index + 3) * 50}
              />
            ))}
          </div>
        </div>

        {/* State motto */}
        <p
          className="text-center italic text-slate-500 tracking-wide px-2"
          style={{
            fontSize: "clamp(0.75rem, 2.5vw, 1.125rem)",
            marginTop: "clamp(0.75rem, 3vw, 1.5rem)",
          }}
        >
          "{motto}"
        </p>
      </div>
    </div>
  )
}
