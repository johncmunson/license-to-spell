import { describe, it, expect } from "vitest"
import {
  isValidWord,
  getValidWords,
  calculateScore,
  calculateStats,
  generateValidPlate,
} from "./game-logic"

describe("isValidWord", () => {
  describe("valid words", () => {
    it("accepts a word with plate letters in order (BAM -> BECAME)", () => {
      expect(isValidWord("BAM", "BECAME")).toBe(true)
    })

    it("accepts a word with all letters present consecutively (CAT -> CATAPULT)", () => {
      expect(isValidWord("CAT", "CATAPULT")).toBe(true)
    })

    it("accepts a word with letters spread throughout (CAT -> COMMUNICATE)", () => {
      expect(isValidWord("CAT", "COMMUNICATE")).toBe(true)
    })

    it("handles case insensitivity for both plate and word", () => {
      expect(isValidWord("ABC", "AbCdEf")).toBe(true)
      expect(isValidWord("abc", "ABCDEF")).toBe(true)
      expect(isValidWord("Abc", "aBcDeF")).toBe(true)
    })

    it("accepts words with repeated plate letters (AAA -> AARDVARK)", () => {
      expect(isValidWord("AAA", "AARDVARK")).toBe(true)
    })

    it("accepts minimum valid word (exactly contains plate letters)", () => {
      expect(isValidWord("CAT", "CAT")).toBe(true)
    })
  })

  describe("invalid words", () => {
    it("rejects a word with plate letters out of order (BAM -> BEMOAN)", () => {
      // BEMOAN has B, then M, then O, A, N - A comes after M, not before
      expect(isValidWord("BAM", "BEMOAN")).toBe(false)
    })

    it("rejects a word not starting with the first plate letter (BAM -> EMBALM)", () => {
      // EMBALM starts with E, not B
      expect(isValidWord("BAM", "EMBALM")).toBe(false)
    })

    it("rejects a word that is too short to contain all plate letters", () => {
      expect(isValidWord("ABC", "AB")).toBe(false)
    })

    it("rejects a word missing a plate letter", () => {
      expect(isValidWord("BAM", "BAD")).toBe(false) // missing M
    })

    it("rejects an empty word", () => {
      expect(isValidWord("BAM", "")).toBe(false)
    })

    it("rejects a word that has wrong first letter", () => {
      expect(isValidWord("CAT", "SCATTER")).toBe(false)
    })
  })
})

describe("getValidWords", () => {
  const testDictionary = [
    "became",
    "bemoan",
    "embalm",
    "bamboo",
    "balm",
    "beam",
    "bam",
    "cat",
    "catapult",
    "communicate",
    "scatter",
  ]

  it("returns an array of valid words for a given plate", () => {
    const validWords = getValidWords("BAM", testDictionary)
    expect(validWords).toContain("became")
    expect(validWords).toContain("balm")
    expect(validWords).toContain("bam")
  })

  it("excludes invalid words", () => {
    const validWords = getValidWords("BAM", testDictionary)
    expect(validWords).not.toContain("bemoan") // A must come before M
    expect(validWords).not.toContain("embalm") // Must start with B
  })

  it("returns empty array for impossible letter combinations", () => {
    const validWords = getValidWords("XQZ", testDictionary)
    expect(validWords).toEqual([])
  })

  it("returns empty array for empty dictionary", () => {
    const validWords = getValidWords("BAM", [])
    expect(validWords).toEqual([])
  })

  it("handles case insensitivity", () => {
    const validWords = getValidWords("CAT", testDictionary)
    expect(validWords).toContain("cat")
    expect(validWords).toContain("catapult")
    expect(validWords).toContain("communicate")
    expect(validWords).not.toContain("scatter") // starts with S
  })
})

describe("calculateScore", () => {
  it("returns score equal to word length for a single word", () => {
    expect(calculateScore(["BECAME"])).toBe(6)
  })

  it("calculates total score for multiple words", () => {
    // CAT (3) + CATCH (5) + CATAPULT (8) = 16
    expect(calculateScore(["CAT", "CATCH", "CATAPULT"])).toBe(16)
  })

  it("returns 0 for empty guesses", () => {
    expect(calculateScore([])).toBe(0)
  })

  it("handles single character words", () => {
    expect(calculateScore(["A", "I"])).toBe(2)
  })

  it("handles long words", () => {
    expect(calculateScore(["COMMUNICATION"])).toBe(13)
  })
})

describe("calculateStats", () => {
  it("calculates total possible points as sum of word lengths", () => {
    const words = ["CAT", "CATCH", "CATAPULT"]
    const stats = calculateStats(words)
    expect(stats.totalPoints).toBe(16) // 3 + 5 + 8
  })

  it("calculates average word length correctly", () => {
    const words = ["CAT", "CATCH", "CATAPULT"] // lengths: 3, 5, 8
    const stats = calculateStats(words)
    expect(stats.averageLength).toBeCloseTo(5.33, 1) // (3 + 5 + 8) / 3
  })

  it("handles empty word array", () => {
    const stats = calculateStats([])
    expect(stats.totalPoints).toBe(0)
    expect(stats.averageLength).toBe(0)
  })

  it("handles single word", () => {
    const stats = calculateStats(["BECAME"])
    expect(stats.totalPoints).toBe(6)
    expect(stats.averageLength).toBe(6)
  })

  it("handles words of same length", () => {
    const words = ["CAT", "BAT", "HAT"]
    const stats = calculateStats(words)
    expect(stats.totalPoints).toBe(9)
    expect(stats.averageLength).toBe(3)
  })
})

describe("generateValidPlate", () => {
  const testDictionary = [
    // Words starting with A
    "aardvark",
    "abalone",
    "abandon",
    "abashed",
    "abate",
    "abbey",
    // Words starting with B
    "babble",
    "babel",
    "baboon",
    "baby",
    "bachelor",
    "back",
    "backbone",
    "backdrop",
    "backer",
    "backfire",
    "background",
    // Words starting with C
    "cab",
    "cabal",
    "cabana",
    "cabbage",
    "cabin",
    "cabinet",
    "cable",
    "cache",
    "cackle",
    "cactus",
    "cadaver",
    "caddie",
    // Add more words to ensure we can meet the 100 threshold
    ...Array.from({ length: 100 }, (_, i) => `cat${i}`), // cat0, cat1, ...
  ]

  it("generates a plate with exactly 3 letters", () => {
    const result = generateValidPlate(testDictionary, 1)
    expect(result.letters).toHaveLength(3)
  })

  it("generates a plate with all uppercase letters", () => {
    const result = generateValidPlate(testDictionary, 1)
    expect(result.letters).toMatch(/^[A-Z]{3}$/)
  })

  it("generates a plate that produces at least the minimum word count", () => {
    // Use a lower threshold for this test with our limited dictionary
    const result = generateValidPlate(testDictionary, 5)
    expect(result.wordCount).toBeGreaterThanOrEqual(5)
  })

  it("returns the correct word count matching the valid words array", () => {
    const result = generateValidPlate(testDictionary, 1)
    expect(result.wordCount).toBe(result.validWords.length)
  })

  it("returns valid words that actually match the generated plate", () => {
    const result = generateValidPlate(testDictionary, 1)
    result.validWords.forEach((word) => {
      expect(isValidWord(result.letters, word)).toBe(true)
    })
  })

  it("regenerates if word count is below the threshold", () => {
    // With minWords = 100, the function should keep trying until it finds a valid plate
    // This tests that the regeneration logic works
    const largeDictionary = [
      ...Array.from(
        { length: 200 },
        (_, i) => `cat${String(i).padStart(3, "0")}`,
      ),
    ]
    const result = generateValidPlate(largeDictionary, 100)
    expect(result.wordCount).toBeGreaterThanOrEqual(100)
  })

  it("regenerates if word count is above the maximum threshold", () => {
    // Create a dictionary where "CAT" matches many words but we want to limit to 50 max
    const largeDictionary = [
      ...Array.from(
        { length: 200 },
        (_, i) => `cat${String(i).padStart(3, "0")}`,
      ),
      ...Array.from(
        { length: 30 },
        (_, i) => `bat${String(i).padStart(3, "0")}`,
      ),
    ]
    // With maxWords = 50, the function should reject plates with > 50 words (like CAT with 200)
    // and keep trying until it finds one within range
    const result = generateValidPlate(largeDictionary, 20, 50)
    expect(result.wordCount).toBeGreaterThanOrEqual(20)
    expect(result.wordCount).toBeLessThanOrEqual(50)
  })

  it("generates a plate with word count between 100 and 999 by default", () => {
    // Create a controlled dictionary
    const dictionary = [
      ...Array.from(
        { length: 150 },
        (_, i) => `cat${String(i).padStart(3, "0")}`,
      ),
    ]
    const result = generateValidPlate(dictionary, 100, 999)
    expect(result.wordCount).toBeGreaterThanOrEqual(100)
    expect(result.wordCount).toBeLessThanOrEqual(999)
  })
})
