const { makeRegex }     = require(`./regex`)
const {
   showDictionaryReduction,
   showRemainingDictionary,
   showRemainingDictionaryLength,
}                       = require(`../config/config.json`)

/**
 * Function that accepts a weighted dictionary and filters out all words that can be excluded under 
 * wordle rules based on the previous guesses.
 * 
 * @param {{word:string, results:(boolean|null)[]}[]} pastGuesses - words already guessed and the results of those guesses
 * @returns {[word, weight][]} reducedDictionary
 */
const getReducedDictionary = (dictionary, pastGuesses, {oldReducedDictionaryLength}) => {

   // STEP 1: Make regex
   const reductionRegex = makeRegex(pastGuesses)

   // STEP 2: Filter dictionary using RegEx
   const reducedDictionary = dictionary.filter(word => reductionRegex.test(word[0]))

   if(reducedDictionary.length === 0) throw `No more words in the dictionary`

   if(showDictionaryReduction) {
      const baseDictLength = oldReducedDictionaryLength? oldReducedDictionaryLength : dictionary.length
      const reductionPercent = 100 - Math.round( 10000 * reducedDictionary.length / baseDictLength )/100
      console.log(baseDictLength, ` --> `, reducedDictionary.length, ` (${reductionPercent}%)`)
   }
   if(showRemainingDictionary) console.log(reducedDictionary)
   if(showRemainingDictionaryLength) console.log(`Words remaining: `, reducedDictionary.length)

   return reducedDictionary
}

module.exports = {
   getReducedDictionary,
}