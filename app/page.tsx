"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { LicensePlate } from "@/components/license-plate"
import { WordInput } from "@/components/word-input"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/confetti"
import { Play, Eye, EyeOff, CircleStop, Info } from "lucide-react"
import { calculateScore, calculateStats, isValidWord } from "@/lib/game-logic"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import type confetti from "canvas-confetti"

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

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

type GameState = 'idle' | 'playing' | 'ended'

export default function Home() {
  // License plate state - start empty until data loads
  const [letters, setLetters] = useState("ABC")
  const [numbers, setNumbers] = useState("123")
  const [state, setState] = useState("")
  const [motto, setMotto] = useState("")
  const [colors, setColors] = useState({ backgroundColor: "bg-amber-50", textColor: "text-blue-600" })
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  // Game state
  const [gameState, setGameState] = useState<GameState>('idle')
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [validWords, setValidWords] = useState<string[]>([])
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorKey, setErrorKey] = useState(0)
  const [successMessage, setSuccessMessage] = useState("")
  const [successKey, setSuccessKey] = useState(0)
  const [showAllWords, setShowAllWords] = useState(false)
  const [dictionary, setDictionary] = useState<string[]>([])
  const [stateMottos, setStateMottos] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  // Word input state
  const [isShaking, setIsShaking] = useState(false)
  const [shouldSelect, setShouldSelect] = useState(false)
  const [shouldClearAndFocus, setShouldClearAndFocus] = useState(false)
  
  // Rules dialog state
  const [showRulesDialog, setShowRulesDialog] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const confettiFireRef = useRef<((opts?: confetti.Options) => void) | null>(null)

  // Load dictionary and state mottos on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [dictResponse, mottosResponse] = await Promise.all([
          fetch('/api/dictionary'),
          fetch('/api/mottos')
        ])
        const dictData = await dictResponse.json()
        const mottosData = await mottosResponse.json()
        const mottos = mottosData.mottos || {}
        
        setDictionary(dictData.words || [])
        setStateMottos(mottos)
        
        // Set random initial state, motto, and colors
        const states = Object.keys(mottos)
        if (states.length > 0) {
          const randomState = states[Math.floor(Math.random() * states.length)]
          const stateMottoList = mottos[randomState] || ["LICENSE TO SPELL"]
          const randomMotto = stateMottoList[Math.floor(Math.random() * stateMottoList.length)]
          setState(randomState)
          setMotto(randomMotto)
          setColors(getRandomColorCombination())
          setInitialDataLoaded(true)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        // Still mark as loaded to show fallback
        setInitialDataLoaded(true)
      }
    }
    loadData()
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

  // Auto-clear success message after fade animation (2 seconds)
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("")
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
    
    // Get random state and motto
    const states = Object.keys(stateMottos)
    const randomState = states.length > 0 
      ? states[Math.floor(Math.random() * states.length)]
      : "CALIFORNIA"
    const mottos = stateMottos[randomState] || ["LICENSE TO SPELL"]
    const randomMotto = mottos[Math.floor(Math.random() * mottos.length)]
    
    setLetters(result.letters)
    setNumbers(result.wordCount.toString().padStart(3, '0'))
    setState(randomState)
    setMotto(randomMotto)
    setColors(getRandomColorCombination())
    setValidWords(result.validWords)
    setCorrectGuesses([])
    setCurrentGuess("")
    setErrorMessage("")
    setShowAllWords(false)
    setTimeRemaining(300)
    setGameState('playing')
    setShouldClearAndFocus(true)
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
      setSuccessMessage("")
      setIsShaking(true)
      setShouldSelect(true)
      return
    }
    
    // Check if word is valid for the plate
    if (!isValidWord(letters, guess)) {
      setErrorMessage("Invalid word!")
      setErrorKey(k => k + 1)
      setSuccessMessage("")
      setIsShaking(true)
      setShouldSelect(true)
      return
    }
    
    // Check if word is in dictionary (valid words list)
    if (!validWords.some(w => w.toLowerCase() === guess)) {
      setErrorMessage("Invalid word!")
      setErrorKey(k => k + 1)
      setSuccessMessage("")
      setIsShaking(true)
      setShouldSelect(true)
      return
    }
    
    // Valid guess!
    setCorrectGuesses(prev => [...prev, guess])
    setCurrentGuess("")
    setErrorMessage("")
    setSuccessMessage("Success!")
    setSuccessKey(k => k + 1)
    setShouldClearAndFocus(true)
    
    // Fire confetti from the submit button
    if (confettiFireRef.current) {
      let origin = { x: 0.5, y: 0.5 } // Default to center
      
      if (submitButtonRef.current) {
        const rect = submitButtonRef.current.getBoundingClientRect()
        origin = {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        }
      } else {
        console.log('Submit button ref is null!')
      }
      
      confettiFireRef.current({
        particleCount: 80,
        spread: 70,
        origin,
      })
    }
  }, [currentGuess, correctGuesses, gameState, letters, validWords])

  // Calculate current score and stats
  const currentScore = calculateScore(correctGuesses)
  const stats = calculateStats(validWords)

  return (
    <Confetti>
      {({ fire }) => {
        // Store fire function in ref (safe because fire is stable)
        confettiFireRef.current = fire
        
        return (
    <main className="flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 sm:gap-8">
        {/* Header */}
        <div className="flex items-center gap-2">
          <h1 
            className="font-bold text-slate-800 text-center"
            style={{ fontSize: 'clamp(1.25rem, 5vw, 2.25rem)' }}
          >
            LICENSE TO SPELL
          </h1>
          <button
            onClick={() => setShowRulesDialog(true)}
            className="text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Game rules and scoring"
          >
            <Info style={{ width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)' }} />
          </button>
        </div>

        {/* Rules Drawer */}
        <Drawer open={showRulesDialog} onOpenChange={setShowRulesDialog}>
          <DrawerContent className="font-mono min-w-[310px]">
            <DrawerHeader>
              <DrawerTitle className="text-xl">How to Play</DrawerTitle>
            </DrawerHeader>
            <div className="space-y-4 text-sm text-slate-600 px-4 pb-8 text-left max-w-[512px] mx-auto">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Objective</h3>
                <p>
                  Guess as many words as possible that match the license plate letters 
                  before time runs out!
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Rules</h3>
                <ul className="list-disc space-y-1 ml-6">
                  <li>Words must <strong>start</strong> with the first letter of the plate</li>
                  <li>All three plate letters must appear in the word, <strong>in order</strong></li>
                  <li>The license plate number indicates the <strong>number of possible words</strong> that can be spelled given the plate letters.</li>
                  <li>You have <strong>5 minutes</strong> per round</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Scoring</h3>
                <p>
                  Each valid word scores points <strong>equal to its length</strong>. A 5-letter word = 5 points, 
                  an 8-letter word = 8 points, etc.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Example</h3>
                <p>
                  For plate <span className="font-semibold">BAM</span>, valid words include: 
                  <span> BECAME, BEAM, BASEMENT, etc.</span>
                </p>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* License Plate */}
        {initialDataLoaded ? (
          <LicensePlate
            letters={letters}
            numbers={numbers}
            state={state}
            motto={motto}
            backgroundColor={colors.backgroundColor}
            textColor={colors.textColor}
          />
        ) : (
          <div className="w-full max-w-[512px] aspect-[2/1] bg-slate-200 rounded-lg sm:rounded-xl animate-pulse" />
        )}

        {/* Word Input */}
        <WordInput
          ref={submitButtonRef}
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

        {/* Message Area - positioned absolutely to prevent CLS */}
        <div className="h-6 relative w-full max-w-lg -my-2">
          {errorMessage && (
            <div 
              key={errorKey}
              data-testid="error-message" 
              className="absolute inset-0 flex items-center justify-center text-red-600 font-medium animate-fade-out"
            >
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div 
              key={successKey}
              data-testid="success-message" 
              className="absolute inset-0 flex items-center justify-center text-emerald-600 font-medium animate-fade-out"
            >
              {successMessage}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg text-center">
          {/* Game Control Box */}
          {gameState === 'idle' && (
            <button
              onClick={generatePlate}
              disabled={isLoading}
              className="bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}
            >
              <div className="text-slate-500 mb-1" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                {isLoading ? 'Loading...' : 'Start Game'}
              </div>
              <div className="flex justify-center">
                <Play className="text-emerald-500 fill-emerald-500" style={{ width: 'clamp(1.5rem, 5vw, 2rem)', height: 'clamp(1.5rem, 5vw, 2rem)' }} />
              </div>
            </button>
          )}
          
          {gameState === 'playing' && (
            <button
              onClick={stopRound}
              data-testid="timer"
              className={cn(`bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer group`,
                timeRemaining <= 60 ? 'border-red-200' : ''
              )}
              style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}
            >
              <div
                // use cn helper
                className={cn(`font-bold mb-1`, 
                  timeRemaining <= 60 ? 'text-red-600' : 'text-slate-500 group-hover:text-slate-600'
                )}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
              >
                {formatTime(timeRemaining)}
              </div>
              <div className="flex justify-center">
                <CircleStop className="text-red-500" style={{ width: 'clamp(1.5rem, 5vw, 2rem)', height: 'clamp(1.5rem, 5vw, 2rem)' }} />
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
                className="bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}
              >
                <div className="text-slate-500 mb-1" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>New Round</div>
                <div className="flex justify-center">
                  <Play className="text-emerald-500 fill-emerald-500" style={{ width: 'clamp(1.5rem, 5vw, 2rem)', height: 'clamp(1.5rem, 5vw, 2rem)' }} />
                </div>
              </button>
            </>
          )}
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <div className="text-slate-500 mb-1" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>Score</div>
            <div data-testid="current-score" className="font-bold text-blue-600" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              {currentScore.toLocaleString()}
            </div>
            {/* Hidden element for test compatibility */}
            {gameState === 'ended' && (
              <div data-testid="final-score" className="hidden">
                {currentScore}
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <div className="text-slate-500 mb-1" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>Possible</div>
            <div data-testid="total-possible-points" className="font-bold text-emerald-600" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              {stats.totalPoints.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200" style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <div className="text-slate-500 mb-1" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>Avg Length</div>
            <div data-testid="average-word-length" className="font-bold text-violet-600" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              {stats.averageLength.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Words Section */}
        <div className="w-full max-w-lg">
          {/* Header with toggle */}
          <div className="flex items-center justify-between mb-3">
            <h2 
              className="font-semibold text-slate-700"
              style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
            >
              {showAllWords ? `All Words (${validWords.length})` : `Your Words (${correctGuesses.length})`}
            </h2>
            <Button
              onClick={() => setShowAllWords(!showAllWords)}
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1 cursor-pointer text-slate-500 hover:text-slate-700",
                gameState !== 'ended' && "invisible"
              )}
              style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
            >
              {showAllWords ? (
                <>
                  <EyeOff style={{ width: 'clamp(0.75rem, 2vw, 1rem)', height: 'clamp(0.75rem, 2vw, 1rem)' }} />
                  Your Words
                </>
              ) : (
                <>
                  <Eye style={{ width: 'clamp(0.75rem, 2vw, 1rem)', height: 'clamp(0.75rem, 2vw, 1rem)' }} />
                  All Words
                </>
              )}
            </Button>
          </div>
          
          {/* Words container */}
          <div 
            data-testid="correct-guesses"
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
          >
            {/* Your Words view */}
            <div 
              className={`overflow-y-auto transition-all duration-300 ${
                showAllWords ? 'hidden' : 'block'
              } ${correctGuesses.length === 0 ? 'flex items-center justify-center' : ''}`}
              style={{ 
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                minHeight: 'clamp(80px, 15vw, 100px)',
                maxHeight: 'clamp(200px, 40vw, 300px)'
              }}
            >
              {correctGuesses.length === 0 ? (
                <p 
                  className="text-slate-400 text-center italic"
                  style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                >No correct guesses yet!</p>
              ) : (
                <div className="flex flex-wrap" style={{ gap: 'clamp(0.375rem, 1vw, 0.5rem)' }}>
                  {correctGuesses.map((word, index) => (
                    <span 
                      key={index}
                      className="bg-emerald-100 text-emerald-700 rounded-full font-medium"
                      style={{ 
                        padding: 'clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.5rem, 1.5vw, 0.75rem)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}
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
              className={`overflow-y-auto transition-all duration-300 ${
                showAllWords ? 'block animate-in fade-in slide-in-from-top-2' : 'hidden'
              }`}
              style={{ 
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                maxHeight: 'clamp(200px, 40vw, 300px)'
              }}
            >
              <div className="flex flex-wrap" style={{ gap: 'clamp(0.375rem, 1vw, 0.5rem)' }}>
                {validWords.sort().map((word, index) => {
                  const wasGuessed = correctGuesses.some(g => g.toLowerCase() === word.toLowerCase())
                  return (
                    <span 
                      key={index}
                      className={`rounded-full font-medium transition-all duration-200 ${
                        wasGuessed 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                      style={{ 
                        padding: 'clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.5rem, 1.5vw, 0.75rem)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        animationDelay: `${index * 10}ms` 
                      }}
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
      }}
    </Confetti>
  )
}
