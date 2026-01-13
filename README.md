# License To Spell

## Overview

License To Spell is a word game where the goal is to spell as many words as possible given a license plate. Words must start with the first letter of the license plate and every letter in the license plate must appear in the word at least once, in the same order.

The license plate number indicates how many words are possible to create.

License Plate Format: ABC123

Example: BAM123

There are 123 possible words to create.

- ✓ BECAME
- ✗ BEMOAN (A must come before M)
- ✗ EMBALM (B must come first)

## Scoring

Each valid word scores points equal to its length. A 5-letter word = 5 points, an 8-letter word = 8 points, etc.

## Tech Stack

- TypeScript
- Next.js (app router, API routes, etc.)
- Tailwind CSS
- Shadcn UI
- Vitest / Playwright

---

![License To Spell](./public/screenshot.png)

---

## Random Ideas and Notes

- Config Option: Word doesn't have to start with the first letter of the license plate
- Config Option: Word just needs to contain the license plate letters, but they don't have to be in order
- Config Option: Reject common words
- Get a hint button: Randomly selects an easy-ish word from the solution space and gives a hint
- Filter out 3-letter words and below. Maybe even 4-letter words and below.
- Make the score a function of: terseness of word (i.e. shorter is better) + rarity of word (i.e. less common is better)
  - This way, short words get points because it's harder to make the license plate letters work with real short words
  - But also, long words can also get points because longer words are often rare and unique.
  - https://github.com/rspeer/wordfreq
- New game mode: 50 States Cruise. The license plate cycles to the next state when you get a word correct.
- Disable spellcheck or autocomplete
- Use the official scrabble word list
- Setting to control the solution space:
  - Easy: Only solution spaces larger than 999
  - Medium: Only solution spaces larger than 500 but less than 1000
  - Hard: Only solution spaces larger than 99 but less than 500
  - Insane: Only solution spaces larger than 20 but less than 100
- Plate of the day
- Cruise of the day
- User login and tracking of best scores
- Leaderboard
- Word Duel:
  - Two or more players in the same room compete for highest score
  - Plate cycles every 30s
  - If a word is guessed by one player, no other player can use that word
  - Rounds last for 3-5m
- Plate Poker: After seeing a plate, players secretly bid on how many words they can find in 60 seconds. Highest bidder must deliver—if they hit their number, they win the pot. Miss it, and the challenger wins. Bluffing encouraged.
- Cross-Country Race: Players race through all 50 states. Each correct word advances you to the next state. First to complete all 50 wins. Plates get progressively harder as you go.
- Hive Mind: Two players, one plate, shared score.
