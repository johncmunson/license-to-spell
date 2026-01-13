"use client"

import type React from "react"

import { useRef, useEffect, forwardRef } from "react"
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

export const WordInput = forwardRef<HTMLButtonElement, WordInputProps>(
  function WordInput(
    {
      value,
      onChange,
      onSubmit,
      isShaking = false,
      shouldSelect = false,
      shouldClearAndFocus = false,
      maxLength = 31,
      disabled = false,
    },
    ref,
  ) {
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

    // Calculate font size based on character count (responsive with clamp)
    const getFontSize = () => {
      const length = value.length
      if (length <= 10) return "clamp(1.5rem, 5vw, 2.25rem)"
      if (length <= 15) return "clamp(1.25rem, 4vw, 1.875rem)"
      if (length <= 20) return "clamp(1.125rem, 3.5vw, 1.5rem)"
      if (length <= 25) return "clamp(1rem, 3vw, 1.25rem)"
      return "clamp(0.875rem, 2.5vw, 1.125rem)"
    }

    return (
      <div
        className="w-full max-w-lg flex items-center gap-2 px-1"
        style={{ marginTop: "clamp(1.5rem, 5vw, 3rem)" }}
      >
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
            w-full rounded-lg border-2 border-slate-300
            bg-white text-center font-bold uppercase tracking-wider
            placeholder:text-slate-300 placeholder:font-normal
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400
            transition-all duration-200
            ${isShaking ? "animate-shake border-red-500 bg-red-50" : ""}
          `}
            style={{
              height: "clamp(3rem, 10vw, 4rem)",
              padding: "clamp(0.75rem, 2vw, 1rem)",
              fontSize: getFontSize(),
            }}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
          />
        </div>

        <Button
          ref={ref}
          onClick={onSubmit}
          size="icon"
          disabled={disabled}
          className="shrink-0 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
          style={{
            width: "clamp(3rem, 10vw, 4rem)",
            height: "clamp(3rem, 10vw, 4rem)",
          }}
        >
          <SendHorizontal
            style={{
              width: "clamp(1.5rem, 5vw, 2rem)",
              height: "clamp(1.5rem, 5vw, 2rem)",
            }}
          />
        </Button>
      </div>
    )
  },
)
