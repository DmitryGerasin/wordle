const BaseEngine        = require(`./BaseEngine`)


/**
 * v0 engine: Suggests the next word based on which word's letters overlap 
 * the most with the letters of the other words in the reduced dictionary.
 * 
 * In other words, it finds the word in the reduced dictionary that has the most 
 * letters in common with the rest of the reduced dictionary and returns it.
 */
class V0Engine extends BaseEngine {
   constructor(dictionary) {
      super(dictionary)
   }
   /**
    * Make a guess based on the current game state.
    * @returns {Object} The next best guesses (plain and weighted).
    */
   makeGuess(pastGuesses=[], {progBar, oldReducedDictionaryLength, makeFirstGuess=false}={}) {
      // Handle the first guess case
      if (pastGuesses.length === 0 && !makeFirstGuess) return this.firstGuess(makeFirstGuess)

      // Calculate reduced dictionary based on previous guesses
      const reducedDictionary = this.getReducedDictionary(this.dictionary, pastGuesses, {oldReducedDictionaryLength})
      const reducedDictionaryLength = reducedDictionary.length

      const result = {
         plain: { word: null, score: -1 },
         weighted: { word: null, score: -1 },
      }

      // Compare every word to every word in the reduced dictionary
      for (let i = 0; i < reducedDictionaryLength; i++) {
         // 1. Pick a word
         const [word, weight] = reducedDictionary[i]
         const uniqueLetters = new Set(word) // Get unique letters in the current word
         let plainScore = 0
         let weightedScore = 0

         // Updare progress bar
         if(progBar) progBar.update(i+1, {word: word})

         // 2. Compare to every other word by looping over the entire dictionary
         for (let j = 0; j < reducedDictionaryLength; j++) {
            const [otherWord, otherFrequency] = reducedDictionary[j]
            const otherUniqueLetters = new Set(otherWord)
            const overlap = [...uniqueLetters].filter(letter => otherUniqueLetters.has(letter)).length

            plainScore += overlap / reducedDictionaryLength
            weightedScore += overlap * (otherFrequency / this.metadata.sumOfWeights)
         }
         // if(i < 10) console.log(i, word, plainScore.toPrecision(3), weight)

         // 3. Update the best word if scores are higher
         if (plainScore > result.plain.score) {
            result.plain.score = plainScore
            result.plain.word = word
         }
         if (weightedScore > result.weighted.score) {
            result.weighted.score = weightedScore
            result.weighted.word = word
         }
      }

      return {
         weighted: { nextBestGuess: result.weighted.word, score: result.weighted.score },
         plain: { nextBestGuess: result.plain.word, score: result.plain.score },
         reducedDictionaryLength: reducedDictionaryLength, // @TODO rename this to sth better like "candidate words remaining" 
      }
   }
}

module.exports = V0Engine