const letters = require(`../config/letters.json`)
const {
   wordLength,
   showReg,
   showTargetWordLetterCount,
} = require(`../config/config.json`)


/**
 * Function that generates a regex describing all words that match the results of the previous guesses.
 * @param {{word, results}[]} pastGuesses - words already guessed and the results of those guesses
 */
const makeRegexOld = (pastGuesses) => {

   const wordStructure = generateWordStructure(letters, wordLength)

   /** Letters that must be contained in the word at least once */
   let lettersPresent = []
   /** Letters that must be contained in the word at least twice */
   const lettersPresentX2 = []
   /** Letters that must be contained in the word at least three times */
   const lettersPresentX3 = []
   /** Letters that must be contained in the word at least four times */
   const lettersPresentX4 = []

   // Iterate over every guessed word and the results that it yielded
   for (let i = 0; i < pastGuesses.length; i++) {
      const {word, results} = pastGuesses[i]
      let letterCounts = {}

      // Iterate over every letter in the words guessed so far
      for (let j = 0; j < word.length; j++) {
         const letter = word[j]
         const result = results[j]

         // 1. Count occurrences of each letter in the current guess
         if (result === true || result === false) {
            // Increment count only if the letter is present in any way (correct or misplaced)
            letterCounts[letter] = (letterCounts[letter] || 0) + 1
         }
         // 2. Adjust wordState based on results
         if(result === null) {
            // Remove letter from every position
            wordStructure.forEach((position, index) => {
               wordStructure[index] = position.filter(candidateLetter => candidateLetter !== letter)
            })
         }
         if(result === true) wordStructure[j] = [letter] // Set a given position to the letter
         if(result === false) {
            // Remove letter from the position is was tried in
            wordStructure[j] = wordStructure[j].filter(candidateLetter => candidateLetter !== letter)
            if(!lettersPresent.includes(letter)) lettersPresent.push(letter)
         }
      }

      // Analyze multiple occurances of letters
      for (const [letter, count] of Object.entries(letterCounts)) {
         if (count === 2 && !lettersPresentX2.includes(letter)) {
            lettersPresentX2.push(letter)
            // Remove the same letter from list of letters present once, to avoid redundancy in regex
            lettersPresent = lettersPresent.filter(e => e !== letter)

         } else if (count === 3 && !lettersPresentX3.includes(letter)) {
            lettersPresentX3.push(letter)
            // Remove the same letter from list of letters present once, to avoid redundancy in regex
            lettersPresent = lettersPresent.filter(e => e !== letter)
            
         } else if (count === 4 && !lettersPresentX4.includes(letter)) {
            lettersPresentX3.push(letter)
            // Remove the same letter from list of letters present once, to avoid redundancy in regex
            lettersPresent = lettersPresent.filter(e => e !== letter)
         }
      }
   }

   /** Compiling the regex */
   let finalForm = `^`
   // Positive lookaheads for letters that must be present in the word at least once, but we don't know their position yet
   for (let i = 0; i < lettersPresent.length; i++) {
      const letter = lettersPresent[i];
      finalForm += `(?=.*${letter})`
   }
   // Positive lookaheads for letters that must be present in the word at least twice, but we don't know their position yet
   for (let i = 0; i < lettersPresentX2.length; i++) {
      const letter = lettersPresentX2[i]
      finalForm += `(?=(.*${letter}.*${letter}))`
   }
   // Positive lookaheads for letters that must be present in the word at least 3 times, but we don't know their position yet
   for (let i = 0; i < lettersPresentX3.length; i++) {
      const letter = lettersPresentX3[i]
      finalForm += `(?=(.*${letter}.*${letter}.*${letter}))`
   }
   // Positive lookaheads for letters that must be present in the word at least 4 times, but we don't know their position yet
   for (let i = 0; i < lettersPresentX4.length; i++) {
      const letter = lettersPresentX4[i]
      finalForm += `(?=(.*${letter}.*${letter}.*${letter}.*${letter}))`
   }
   for (let i = 0; i < wordStructure.length; i++) {
      const position = wordStructure[i]
      finalForm += `[${position.join(``)}]`
   }
   finalForm += `$`

   const reg = new RegExp(finalForm)
   if(showReg) console.log(reg)
   return reg
}


/**
 * If [0, 0] - remove from all positions, no lookaheads
 * If [n, n] - may or may not know all exact positions
 *    If we know `n` exact positions - place it, remove from all other positions, no lookaheads
 *    If we don't - remove it where it was `false` (and also possibly `null`) + lookahead between `min` and `max` times
 * If [n, 5] - we might or might not know the exact location
 *    If we do - place it, no lookaheads
 *    If we don't - remove it where it was `false` (and also possibly `null`) + lookahead between `min` and `max` times
 * 
 */
const makeRegex = (pastGuesses) => {
   const wordStructure = generateWordStructure(letters, wordLength)
   const targetWordLetterCount = {}
   const lookaheads = []

   /**
    * Build the letter count constraints by iterating over every 
    * guessed word and the results that it yielded
    */
   for (let i = 0; i < pastGuesses.length; i++) {
      const { word, results } = pastGuesses[i]
      const currentCounts = {}

      // Count occurrences of each letter in the current guess
      for (let j = 0; j < word.length; j++) {
         const letter = word[j]
         const result = results[j]

         if (!currentCounts[letter]) currentCounts[letter] = { true: 0, false: 0, null: 0 }
         if (result === true) currentCounts[letter][`true`]++
         if (result === false) currentCounts[letter][`false`]++
         if (result === null) currentCounts[letter][`null`]++
      }

      // Update the global targetWordLetterCount based on currentCounts
      for (const [letter, counts] of Object.entries(currentCounts)) {
         // For reference: 
         // letter: "a"
         // counts: { true: 0, false: 0, null: 0 }

         // Initialize letter if it was not known yet
         if (!targetWordLetterCount[letter]) {
            targetWordLetterCount[letter] = [0, wordLength]
         }

         // Get currently set min and max occurences of this letter
         const [min, max] = targetWordLetterCount[letter]


         if (counts.null > 0 && counts.true + counts.false === 0) {
            // All occurrences are "null": max occurrences is therefore 0
            targetWordLetterCount[letter] = [0, 0]
         } else if (counts.null > 0) {
            // Some "null" and some "true"/"false": min and max are the number of true/false
            const count = counts.true + counts.false
            targetWordLetterCount[letter] = [count, count]
            if(min > count || max < count) throw {
               errorName: `makeRegex() failure`, 
               errorMessage: `the currently set min or max value of a letter should in no cases contradict the true count of the given letter`,
               data: { wordStructure, targetWordLetterCount, pastGuesses, word, currentCounts }
            }
         } else {
            // All "true"/"false": set min occurrences
            const count = counts.true + counts.false
            targetWordLetterCount[letter] = [Math.max(min, count), max]
         }
      }

      // Adjust wordStructure based on current word
      for (let j = 0; j < word.length; j++) {
         const letter = word[j]
         const result = results[j]

         if(result === true) {
            // Set correctly placed letters
            wordStructure[j] = [letter]
         }
         if(result === false) {
            // Remove letter from the position is was tried in
            wordStructure[j] = wordStructure[j].filter(candidateLetter => candidateLetter !== letter)
         }
         if(result === null) {
            /**
             * At this stage the letter cannot be removed form all positions, only from the 
             * one it was currently tried in. Removing them now will cause a bug: 
             * - target word is "apple", guess word is "arepa" [true, null, false, false, null]
             * - while processing the "a" in the first position the wordStructure for it will
             *   be set to `["a"]`, but when processing the "a" in the 5th position, if you remove
             *   the "a" based on its `null` value the wordStructure for the first position will
             *   become `[]`.
             * The letter will be removed from all other positions at a later step if it is
             * confirmed that the max number of occurances of this letter is zero.
             */
            // Remove letter from the position is was tried in
            wordStructure[j] = wordStructure[j].filter(candidateLetter => candidateLetter !== letter)
         }
      }
   }
   
   if(showTargetWordLetterCount) console.log(targetWordLetterCount) // { a: [ 1, 1 ], p: [ 2, 5 ], i: [ 0, 0 ], d: [ 0, 0 ], e: [ 1, 5 ] }
   
   /**
    * Adjust wordStructure based on targetWordLetterCount
    * 
    * Summary of adjustments to `wordStructure` and `lookaheads` based
    * on `targetWordLetterCount` as implemented in the for-loop below: 
    * 
    * If [0, 0] - remove from all positions, no lookaheads
    * If [n, n] - may or may not know all `n` exact positions
    *    If we do - remove letter from all other positions, no lookaheads
    *    If we don't - lookahead between `min` and `max` times
    * If [n, wordLength] - may or may not know all `n` exact positions
    *    If we do - no lookaheads
    *    If we don't - lookahead between `min` and `max` times
    */
   for (const [letter, [min, max]] of Object.entries(targetWordLetterCount)) {
      const knownNumberOfOccurances = countExactPositions(wordStructure, letter)

      if (max === 0) {
         // [0, 0] - Remove the letter from all positions, no lookaheads
         wordStructure.forEach((position, index) => {
            wordStructure[index] = position.filter(candidateLetter => candidateLetter !== letter)
         })
      } else if (min === max) {
         // [n, n] - Check if all positions are known
         if (knownNumberOfOccurances === min) {
            // All positions located, remove letter from other positions
            wordStructure.forEach((position, index) => {
               if(position.length === 1 && position[0] === letter) {
                  // this position is already occupied solely by the current letter - skip
                  // No change required
               } else {
                  // this position is not occupied solely by the current letter - filter it out from its candidate letters
                  wordStructure[index] = position.filter(candidateLetter => candidateLetter !== letter)
               }
            })
         } else {
            // Not all positions located, add lookahead between `min` and `max` times
            lookaheads.push([letter, min, max])
         }
      } else {
         // [n, wordLength] - Check if all positions are known
         if (knownNumberOfOccurances === min) {
            // All `min` positions located, no action required, no lookaheads needed
         } else {
            // Not all positions located, add lookahead between `min` and `max` times
            lookaheads.push([letter, min, max])
         }
      }
   }

   // Build the regex
   const positionConstraints = wordStructure
      .map(position => `[${position.join(``)}]`)
      .join(``)
   
   const letterCountConstraints = lookaheads
      .sort((a, b) => a[0].localeCompare(b[0])) // Sort alphabetically by the letter (first element of each sub-array)
      .map(element => {
         const [letter, min, max] = element
         /**
          * A single positive lookahead specifying a min and max number of
          * occurances of a given letter in curly brackets will not work 
          * Ex: /(?=(?:.*a){1,2})[a-z]{5}/
          * This pattern will allow words with multiple "a"s, as long as there
          * are more than the minimum. Therefore a second negative lookahead 
          * is required to exclude any words with (max + 1) or more of that
          * letter.
          */
         const positive = `(?=(?:.*${letter}){${min}})`
         const negative = `(?!(?:.*${letter}){${max + 1}})`
         // If the max === wordLength, we don't need a negative lookahead

         return `${positive}${max === wordLength? `` : negative}`
      })
      .join(``)


   const reg = new RegExp(`^${letterCountConstraints}${positionConstraints}$`)
   
   if(showReg) console.log(reg)
   return reg 
}

// (?=(?:.*p){2})(?!(?:.*p){3})
/**
 * Function generates the word stucture, which is an array containing 
 * a number of arrays of letters in alphabetical order corresponding to 
 * the wordLength.
 * 
 * @param {String[]} letters - lowercase letters of the alphabet
 * @returns wordStructure
 */
const generateWordStructure = (letters, wordLength) => {
   const wordStructure = []
   
   for (let i = 0; i < wordLength; i++) {
      wordStructure.push(letters)
   }

   return wordStructure
}


/**
 * Helper function to count known positions
 * @param {[string[]]} wordStructure - Array of allowed letters for each of the positions.
 * @param {string} letter
 * @returns {Number} number of known positions of the letter in the wordStructure
 */
function countExactPositions(wordStructure, letter) {
   return wordStructure.filter(position => position.length === 1 && position[0] === letter).length
}

module.exports = {
   makeRegex: makeRegex,
   // makeRegex: makeRegexOld,
}