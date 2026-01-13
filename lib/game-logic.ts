/**
 * Core game logic for License To Spell
 *
 * Rules:
 * - Words must start with the first letter of the license plate
 * - All letters in the license plate must appear in the word, in order
 */

/**
 * Checks if a word is valid for a given license plate
 * @param plate - 3-letter license plate (e.g., "BAM")
 * @param word - Word to validate (e.g., "BECAME")
 * @returns true if the word is valid for the plate
 */
export function isValidWord(plate: string, word: string): boolean {
  // Normalize to uppercase for case-insensitive comparison
  const upperPlate = plate.toUpperCase()
  const upperWord = word.toUpperCase()

  // Word must be at least as long as the plate
  if (upperWord.length < upperPlate.length) {
    return false
  }

  // Word must start with the first letter of the plate
  if (upperWord[0] !== upperPlate[0]) {
    return false
  }

  // All plate letters must appear in the word, in order
  let plateIndex = 0
  for (let i = 0; i < upperWord.length && plateIndex < upperPlate.length; i++) {
    if (upperWord[i] === upperPlate[plateIndex]) {
      plateIndex++
    }
  }

  // All plate letters were found in order
  return plateIndex === upperPlate.length
}

/**
 * Gets all valid words from a dictionary for a given license plate
 * @param plate - 3-letter license plate
 * @param dictionary - Array of words to check against
 * @returns Array of valid words
 */
export function getValidWords(plate: string, dictionary: string[]): string[] {
  return dictionary.filter((word) => isValidWord(plate, word))
}

/**
 * Calculates the score for a list of guessed words
 * Score = sum of word lengths
 * @param words - Array of guessed words
 * @returns Total score
 */
export function calculateScore(words: string[]): number {
  return words.reduce((total, word) => total + word.length, 0)
}

/**
 * Calculates statistics for a set of valid words
 * @param words - Array of valid words
 * @returns Object containing totalPoints and averageLength
 */
export function calculateStats(words: string[]): {
  totalPoints: number
  averageLength: number
} {
  if (words.length === 0) {
    return { totalPoints: 0, averageLength: 0 }
  }

  const totalPoints = calculateScore(words)
  const averageLength = totalPoints / words.length

  return { totalPoints, averageLength }
}

/**
 * Generates a random uppercase letter
 */
function randomLetter(): string {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26))
}

/**
 * Generates a random 3-letter plate that has between minWords and maxWords valid words
 * @param dictionary - Array of words to check against
 * @param minWords - Minimum number of valid words required (default: 100)
 * @param maxWords - Maximum number of valid words allowed (default: 999)
 * @returns Object containing the plate letters and the count of valid words
 */
export function generateValidPlate(
  dictionary: string[],
  minWords: number = 100,
  maxWords: number = 999,
): { letters: string; wordCount: number; validWords: string[] } {
  let letters: string
  let validWords: string[]

  do {
    letters = randomLetter() + randomLetter() + randomLetter()
    validWords = getValidWords(letters, dictionary)
  } while (validWords.length < minWords || validWords.length > maxWords)

  return {
    letters,
    wordCount: validWords.length,
    validWords,
  }
}
