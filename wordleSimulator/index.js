class WordleSimulator {
   constructor(dictionary) {
      this.dictionary = dictionary
      this.targetWord = dictionary[Math.floor(Math.random() * dictionary.length)][0]
      this.pastGuesses = []
   }

   /**
    * Resets the past guesses, sets new target word.
    * @param {String} word - A word from `this.dictionary`.
    */
   setTargetWord(word) {
      // Check if suggested word is part of the dictionary
      const dictionaryContainsWord = this.dictionary.some(element => element[0] === word)
      if(!dictionaryContainsWord) {
         throw new Error(`Currently set dictionary does not contain the word ${word}`)
      }
      
      this.pastGuesses = []
      this.targetWord = word
   }

   /**
    * Makes a guess against the target word.
    * @param {String} word - Next guess to be made.
    * @returns feedback on the word that was guessed.
    */
   guess(word) {
      const results = determineResults(word, this.targetWord)

      this.pastGuesses.push({ word, results })

      if (word === this.targetWord) {
         return { message: "Correct!", pastGuesses: this.pastGuesses }
      }

      return { message: "Keep guessing", pastGuesses: this.pastGuesses }
   }
}


function determineResults(guess, targetWord) {
   const results = Array(guess.length).fill(undefined) // Initialize with null
   const targetLetterCounts = {} // Track remaining occurrences of each letter in the target word

   // Count occurrences of each letter in the target word
   for (const letter of targetWord) {
      targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1
   }

   // Step 1: Mark correctly placed letters (true)
   for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) {
         results[i] = true
         targetLetterCounts[guess[i]]-- // Decrement the count of that letter
      }
   }

   // Step 2: Mark absent letters (null)
   for (let i = 0; i < guess.length; i++) {
      if (results[i] === undefined && !targetWord.includes(guess[i])) {
         results[i] = null
      }
   }

   // Step 3: Mark misplaced letters (false)
   for (let i = 0; i < guess.length; i++) {
      if (results[i] === undefined) {
         const letter = guess[i]
         if (targetLetterCounts[letter] > 0) {
            results[i] = false // Mark as present but misplaced
            targetLetterCounts[letter]-- // Decrement the count for that letter
         } else {
            results[i] = null // Mark as absent if no occurrences left
         }
      }
   }

   return results
}


module.exports = WordleSimulator



// // Example usage:
// const simulator = new WordleSimulator(dictionary)

// console.log(simulator.targetWord)
// console.log(simulator.guess("aeons").pastGuesses)
// console.log(simulator.guess("later").pastGuesses)
// // Continue guessing...
