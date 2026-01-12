"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { LicensePlate } from "@/components/license-plate"
import { WordInput } from "@/components/word-input"
import { Button } from "@/components/ui/button"
import { Play, Eye, EyeOff, CircleStop } from "lucide-react"
import { calculateScore, calculateStats, isValidWord } from "@/lib/game-logic"

// All 50 U.S. states
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
]

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

// Get random U.S. state
function getRandomState(): string {
  return US_STATES[Math.floor(Math.random() * US_STATES.length)]
}

function getRandomColorCombination() {
  return COLOR_COMBINATIONS[Math.floor(Math.random() * COLOR_COMBINATIONS.length)]
}

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

type GameState = 'idle' | 'playing' | 'ended'

export default function Home() {
  // License plate state
  const [letters, setLetters] = useState("ABC")
  const [numbers, setNumbers] = useState("123")
  const [state, setState] = useState("California")
  const [colors, setColors] = useState({ backgroundColor: "bg-amber-50", textColor: "text-blue-600" })

  // Game state
  const [gameState, setGameState] = useState<GameState>('idle')
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [validWords, setValidWords] = useState<string[]>([])
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorKey, setErrorKey] = useState(0)
  const [showAllWords, setShowAllWords] = useState(false)
  const [dictionary, setDictionary] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Word input state
  const [isShaking, setIsShaking] = useState(false)
  const [shouldSelect, setShouldSelect] = useState(false)
  const [shouldClearAndFocus, setShouldClearAndFocus] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load dictionary on mount
  useEffect(() => {
    async function loadDictionary() {
      try {
        const response = await fetch('/api/dictionary')
        const data = await response.json()
        setDictionary(data.words || [])
      } catch (error) {
        console.error('Failed to load dictionary:', error)
      }
    }
    loadDictionary()
  }, [])

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - end the round
            setGameState('ended')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [gameState, timeRemaining])

  // Reset shake/select states after animation
  useEffect(() => {
    if (isShaking) {
      const timeout = setTimeout(() => {
        setIsShaking(false)
        setShouldSelect(false)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [isShaking])

  // Reset clear and focus state
  useEffect(() => {
    if (shouldClearAndFocus) {
      const timeout = setTimeout(() => {
        setShouldClearAndFocus(false)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [shouldClearAndFocus])

  // Auto-clear error message after fade animation (2 seconds)
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage("")
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [errorMessage])

  // Generate a valid plate with at least 100 words
  const generatePlate = useCallback(async () => {
    if (dictionary.length === 0) {
      setIsLoading(true)
      // Wait for dictionary to load
      const response = await fetch('/api/dictionary')
      const data = await response.json()
      const words = data.words || []
      setDictionary(words)
      setIsLoading(false)
      generatePlateWithDictionary(words)
    } else {
      generatePlateWithDictionary(dictionary)
    }
  }, [dictionary])

  const generatePlateWithDictionary = (words: string[]) => {
    // Import dynamically to avoid issues
    const { generateValidPlate } = require('@/lib/game-logic')
    const result = generateValidPlate(words, 100)
    
    setLetters(result.letters)
    setNumbers(result.wordCount.toString().padStart(3, '0'))
    setState(getRandomState())
    setColors(getRandomColorCombination())
    setValidWords(result.validWords)
    setCorrectGuesses([])
    setCurrentGuess("")
    setErrorMessage("")
    setShowAllWords(false)
    setTimeRemaining(300)
    setGameState('playing')
  }

  // Stop the round early
  const stopRound = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setGameState('ended')
  }, [])

  // Start a new round
  const startNewRound = useCallback(() => {
    generatePlate()
  }, [generatePlate])

  // Handle word submission
  const handleSubmit = useCallback(() => {
    if (gameState !== 'playing') return
    
    const guess = currentGuess.trim().toLowerCase()
    
    if (!guess) return
    
    // Check if already guessed
    if (correctGuesses.some(w => w.toLowerCase() === guess)) {
      setErrorMessage("Already guessed!")
      setErrorKey(k => k + 1)
      setIsShaking(true)
      setShouldSelect(true)
      return
    }
    
    // Check if word is valid for the plate
    if (!isValidWord(letters, guess)) {
      setErrorMessage("Invalid word!")
      setErrorKey(k => k + 1)
      setIsShaking(true)
      setShouldSelect(true)
      return
    }
    
    // Check if word is in dictionary (valid words list)
    if (!validWords.some(w => w.toLowerCase() === guess)) {
      setErrorMessage("Invalid word!")
      setErrorKey(k => k + 1)
      setIsShaking(true)
      setShouldSelect(true)
      return
    }
    
    // Valid guess!
    setCorrectGuesses(prev => [...prev, guess])
    setCurrentGuess("")
    setErrorMessage("")
    setShouldClearAndFocus(true)
  }, [currentGuess, correctGuesses, gameState, letters, validWords])

  // Calculate current score and stats
  const currentScore = calculateScore(correctGuesses)
  const stats = calculateStats(validWords)

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 p-4 md:p-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
          License To Spell
        </h1>

        {/* License Plate */}
        <LicensePlate
          letters={letters}
          numbers={numbers}
          state={state}
          backgroundColor={colors.backgroundColor}
          textColor={colors.textColor}
        />

        {/* Word Input */}
        <WordInput
          value={currentGuess}
          onChange={(value) => {
            setCurrentGuess(value)
            setErrorMessage("")
          }}
          onSubmit={handleSubmit}
          isShaking={isShaking}
          shouldSelect={shouldSelect}
          shouldClearAndFocus={shouldClearAndFocus}
          disabled={gameState !== 'playing'}
        />

        {/* Error Message - positioned absolutely to prevent CLS */}
        <div className="h-6 relative w-full max-w-md">
          {errorMessage && (
            <div 
              key={errorKey}
              data-testid="error-message" 
              className="absolute inset-0 flex items-center justify-center text-red-600 font-medium animate-fade-out"
            >
              {errorMessage}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-xl text-center">
          {/* Game Control Box */}
          {gameState === 'idle' && (
            <button
              onClick={generatePlate}
              disabled={isLoading}
              className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="text-sm text-slate-500 mb-1">
                {isLoading ? 'Loading...' : 'Start Game'}
              </div>
              <div className="flex justify-center">
                <Play className="w-8 h-8 text-emerald-500 fill-emerald-500" />
              </div>
            </button>
          )}
          
          {gameState === 'playing' && (
            <button
              onClick={stopRound}
              data-testid="timer"
              className={`bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer group ${
                timeRemaining <= 60 ? 'border-red-200' : ''
              }`}
            >
              <div className={`text-sm font-mono font-bold mb-1 ${
                timeRemaining <= 60 ? 'text-red-600' : 'text-slate-500 group-hover:text-slate-600'
              }`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="flex justify-center">
                <CircleStop className="w-8 h-8 text-red-500" />
              </div>
            </button>
          )}
          
          {gameState === 'ended' && (
            <>
              <div data-testid="timer" className="hidden">
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={startNewRound}
                className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="text-sm text-slate-500 mb-1">New Round</div>
                <div className="flex justify-center">
                  <Play className="w-8 h-8 text-emerald-500 fill-emerald-500" />
                </div>
              </button>
            </>
          )}
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Score</div>
            <div data-testid="current-score" className="text-2xl font-bold text-blue-600">
              {currentScore.toLocaleString()}
            </div>
            {/* Hidden element for test compatibility */}
            {gameState === 'ended' && (
              <div data-testid="final-score" className="hidden">
                {currentScore}
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Possible</div>
            <div data-testid="total-possible-points" className="text-2xl font-bold text-emerald-600">
              {stats.totalPoints.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Avg Length</div>
            <div data-testid="average-word-length" className="text-2xl font-bold text-violet-600">
              {stats.averageLength.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Words Section */}
        <div className="w-full max-w-md">
          {/* Header with toggle */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-700">
              {showAllWords ? `All Words (${validWords.length})` : `Your Words (${correctGuesses.length})`}
            </h2>
            {gameState === 'ended' && (
              <Button
                onClick={() => setShowAllWords(!showAllWords)}
                variant="ghost"
                size="sm"
                className="gap-1 text-slate-500 hover:text-slate-700"
              >
                {showAllWords ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Your Words
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    All Words
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* Words container */}
          <div 
            data-testid="correct-guesses"
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
          >
            {/* Your Words view */}
            <div 
              className={`p-4 min-h-[100px] max-h-[300px] overflow-y-auto transition-all duration-300 ${
                showAllWords ? 'hidden' : 'block'
              }`}
            >
              {correctGuesses.length === 0 ? (
                <p className="text-slate-400 text-center italic">No words guessed yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {correctGuesses.map((word, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                    >
                      {word.toUpperCase()} (+{word.length})
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* All Words view */}
            <div 
              data-testid="valid-words-list"
              className={`p-4 max-h-[300px] overflow-y-auto transition-all duration-300 ${
                showAllWords ? 'block animate-in fade-in slide-in-from-top-2' : 'hidden'
              }`}
            >
              <div className="flex flex-wrap gap-2">
                {validWords.sort().map((word, index) => {
                  const wasGuessed = correctGuesses.some(g => g.toLowerCase() === word.toLowerCase())
                  return (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        wasGuessed 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                      style={{ animationDelay: `${index * 10}ms` }}
                    >
                      {word.toUpperCase()}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
