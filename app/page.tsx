"use client"

import { useState, useCallback } from "react"
import { LicensePlate } from "@/components/license-plate"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

// All 50 U.S. states
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

// Generate random uppercase letter
function randomLetter(): string {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26))
}

// Generate random digit
function randomDigit(): string {
  return Math.floor(Math.random() * 10).toString()
}

// Generate random 3-letter sequence
function generateRandomLetters(): string {
  return randomLetter() + randomLetter() + randomLetter()
}

// Generate random 3-digit number
function generateRandomNumbers(): string {
  return randomDigit() + randomDigit() + randomDigit()
}

// Get random U.S. state
function getRandomState(): string {
  return US_STATES[Math.floor(Math.random() * US_STATES.length)]
}

const COLOR_COMBINATIONS = [
  { backgroundColor: "bg-amber-50", textColor: "text-amber-700" },
  { backgroundColor: "bg-sky-100", textColor: "text-sky-700" },
  { backgroundColor: "bg-emerald-50", textColor: "text-emerald-700" },
  { backgroundColor: "bg-rose-50", textColor: "text-rose-600" },
  { backgroundColor: "bg-violet-50", textColor: "text-violet-700" },
  { backgroundColor: "bg-orange-50", textColor: "text-orange-600" },
  { backgroundColor: "bg-teal-50", textColor: "text-teal-700" },
  { backgroundColor: "bg-indigo-100", textColor: "text-indigo-700" },
  { backgroundColor: "bg-lime-50", textColor: "text-lime-700" },
  { backgroundColor: "bg-cyan-50", textColor: "text-cyan-700" },
  { backgroundColor: "bg-fuchsia-50", textColor: "text-fuchsia-700" },
  { backgroundColor: "bg-yellow-50", textColor: "text-yellow-700" },
]

function getRandomColorCombination() {
  return COLOR_COMBINATIONS[Math.floor(Math.random() * COLOR_COMBINATIONS.length)]
}

export default function Home() {
  // Parent owns all license plate data
  const [letters, setLetters] = useState("ABC")
  const [numbers, setNumbers] = useState("123")
  const [state, setState] = useState("California")
  const [colors, setColors] = useState({ backgroundColor: "bg-amber-50", textColor: "text-blue-600" })

  // Handler for randomize request from the component
  const handleRequestRandomize = useCallback(() => {
    setLetters(generateRandomLetters())
    setNumbers(generateRandomNumbers())
    setState(getRandomState())
    setColors(getRandomColorCombination())
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-8">
      <LicensePlate
        letters={letters}
        numbers={numbers}
        state={state}
        backgroundColor={colors.backgroundColor}
        textColor={colors.textColor}
      />

      {/* Randomize Button */}
      <Button onClick={handleRequestRandomize} variant="outline" className="mt-4 gap-2 bg-transparent">
        <Shuffle className="w-4 h-4" />
        Randomize Plate
      </Button>
    </main>
  )
}
