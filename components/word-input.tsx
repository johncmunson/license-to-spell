"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SendHorizontal } from "lucide-react"

interface WordInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isShaking?: boolean
  shouldSelect?: boolean
  shouldClearAndFocus?: boolean
  maxLength?: number
  disabled?: boolean
}

export function WordInput({
  value,
  onChange,
  onSubmit,
  isShaking = false,
  shouldSelect = false,
  shouldClearAndFocus = false,
  maxLength = 31,
  disabled = false,
}: WordInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle text selection on invalid guess
  useEffect(() => {
    if (shouldSelect && inputRef.current) {
      inputRef.current.select()
    }
  }, [shouldSelect])

  // Handle clear and focus on correct guess
  useEffect(() => {
    if (shouldClearAndFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [shouldClearAndFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[^a-zA-Z]/g, "")
    const uppercaseValue = filteredValue.toUpperCase()
    if (uppercaseValue.length <= maxLength) {
      onChange(uppercaseValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onSubmit()
    }
  }

  // Calculate font size based on character count
  const getFontSize = () => {
    const length = value.length
    if (length <= 10) return "text-4xl"
    if (length <= 15) return "text-3xl"
    if (length <= 20) return "text-2xl"
    if (length <= 25) return "text-xl"
    return "text-lg"
  }

  return (
    <div className="w-full max-w-lg flex items-center gap-2 mt-12">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={maxLength}
          placeholder="TYPE A WORD"
          disabled={disabled}
          className={`
            w-full px-4 py-4 rounded-lg border-2 border-slate-300
            bg-white text-center font-bold uppercase tracking-wider
            placeholder:text-slate-300 placeholder:font-normal
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400
            transition-all duration-200
            h-16
            ${getFontSize()}
            ${isShaking ? "animate-shake border-red-500 bg-red-50" : ""}
          `}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
        />
      </div>

      <Button 
        onClick={onSubmit} 
        size="icon"
        disabled={disabled}
        className="h-16 w-16 shrink-0 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
      >
        <SendHorizontal className="w-8 h-8" />
      </Button>
    </div>
  )
}
