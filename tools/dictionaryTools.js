const letters           = require(`../config/letters.json`)
const config            = require(`../config/config.json`)

/** Helper function to validate weighted word format */
const isValidWeightedWordFormat = (entry) => {
   return (
      Array.isArray(entry) &&

      entry.length === 2 &&

      typeof entry[0] === `string` &&
      typeof entry[1] === `number`
   )
}

/** Helper function to validate word characters */
const isValidWordCharacters = (word, letters) => {
   const allowedLetters = new Set(letters)
   return [...word].every((char) => allowedLetters.has(char))
}

/** Helper function to extract wordCount, letterCount, and sumOfWeights form a given dictionary */
function extractDictionaryMetadata(dict) {
   const wordCount = dict.length
   const letterCount = {}
   let sumOfWeights = 0

   dict.forEach(([word, weight]) => {
      [...word].forEach(letter => {
         letterCount[letter] = (letterCount[letter] || 0) + 1
      })
      sumOfWeights += weight
   })

   return { wordCount, letterCount, sumOfWeights }
}

/** Helper function to compare 2 objects of letters and their counts based on a list of allowed letters */
function compareLetterCounts(letterCount1, letterCount2, allowedLetters) {
   return allowedLetters.every(letter => letterCount1[letter] === letterCount2[letter])
}

/**
 * Helper function to locate the metadata object for the currently enabled dictionary
 * @param {*} metadataFile - the JSON metadata file
 * @param {*} dictionaryMetadataToMatch - metadata of the current dictionary. Can be obtained via
 * @returns matching metadata entry
 */
const locateMatchingMetadataEntry = (metadataFile, dictionaryMetadataToMatch) => {
   const matchingEntry = metadataFile.filter(entry =>
      entry.wordCount === dictionaryMetadataToMatch.wordCount &&
      entry.sumOfWeights === dictionaryMetadataToMatch.sumOfWeights &&
      compareLetterCounts(entry.letterCount, dictionaryMetadataToMatch.letterCount, letters)
   )
   return matchingEntry
}

module.exports = {
   isValidWeightedWordFormat,
   isValidWordCharacters,
   extractDictionaryMetadata,
   compareLetterCounts,
   locateMatchingMetadataEntry,
}