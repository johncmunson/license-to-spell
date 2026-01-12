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
  // TODO: Implement
  throw new Error('Not implemented')
}

/**
 * Gets all valid words from a dictionary for a given license plate
 * @param plate - 3-letter license plate
 * @param dictionary - Array of words to check against
 * @returns Array of valid words
 */
export function getValidWords(plate: string, dictionary: string[]): string[] {
  // TODO: Implement
  throw new Error('Not implemented')
}

/**
 * Calculates the score for a list of guessed words
 * Score = sum of word lengths
 * @param words - Array of guessed words
 * @returns Total score
 */
export function calculateScore(words: string[]): number {
  // TODO: Implement
  throw new Error('Not implemented')
}

/**
 * Calculates statistics for a set of valid words
 * @param words - Array of valid words
 * @returns Object containing totalPoints and averageLength
 */
export function calculateStats(words: string[]): { totalPoints: number; averageLength: number } {
  // TODO: Implement
  throw new Error('Not implemented')
}

/**
 * Generates a random 3-letter plate that has at least minWords valid words
 * @param dictionary - Array of words to check against
 * @param minWords - Minimum number of valid words required (default: 100)
 * @returns Object containing the plate letters and the count of valid words
 */
export function generateValidPlate(
  dictionary: string[],
  minWords: number = 100
): { letters: string; wordCount: number; validWords: string[] } {
  // TODO: Implement
  throw new Error('Not implemented')
}

