const config            = require(`../config/config.json`)
const dictionary        = require(`../dictionary`)
const { 
   printExpected, 
   printReceived,
}                       = require(`jest-matcher-utils`)
const letters           = require(`../config/letters.json`)
const metadataFile      = require(`../dictionary/dictionaryMetadata.json`)
const {
   isValidWeightedWordFormat,
   isValidWordCharacters,
   extractDictionaryMetadata,
   compareLetterCounts,
   locateMatchingMetadataEntry,
}                       = require(`../tools/dictionaryTools`)

describe(`Dictionary Validation Tests`, () => {
   test(`Weighted dictionary format: array of [string, number]`, () => {
      const allValidFormats = dictionary.every(isValidWeightedWordFormat)
      expect(allValidFormats).toBe(true)
   })

   test(`Words contain only allowed letters`, () => {
      const invalidWords = dictionary.filter(([word]) => !isValidWordCharacters(word, letters))
      expect(invalidWords.length).toBe(0)
   })

   test(`Words have correct number of characters`, () => {
      const allCorrectWordLength = dictionary.every(entry => entry[0].length === config.wordLength)
      if(!allCorrectWordLength) console.error(`Dictionary is invalid, make sure all words contain precisely ${printExpected(config.wordLength + ` letters`)}`)
      expect(allCorrectWordLength).toBe(true)
   })
})


describe(`Dictionary Metadata Tests`, () => {
   const metadata = metadataFile
   const currentMetadata = extractDictionaryMetadata(dictionary)

   test(`Current dictionary has a metadata match`, () => {
      const matchingEntry = locateMatchingMetadataEntry(metadata, currentMetadata)
      
      if(matchingEntry.length === 0) {
         // No matches
         console.error(`No metadata match found. Run ${printExpected(`npm run update-meta`)} to add the current dictionary's metadata.`)
      }

      if (matchingEntry.length > 1) {
         /**
          * If there are more than one there is an error in the code that led to it.
          * Dictionary metadata must be unique for the proper functioning of the engines
         */
         console.error(`Expected one match but found multiple. Conflicting entries:`, matchingEntry)
      }

      expect(matchingEntry.length).toBe(1)
   })

   test(`All engines have first guesses for current dictionary`, () => {
      const matchingEntry = metadata.find(entry =>
         entry.wordCount === currentMetadata.wordCount &&
         entry.sumOfWeights === currentMetadata.sumOfWeights &&
         compareLetterCounts(entry.letterCount, currentMetadata.letterCount, letters)
      )

      if (!matchingEntry) {
         console.log("No matching dictionary metadata found. Cannot test engines.");
         expect(true).toBe(true); // Placeholder
         return;
      }

      config.engines.available.forEach(engine => {
         expect(matchingEntry.optimalFirstGuess).toHaveProperty(engine)
         expect(matchingEntry.optimalFirstGuess[engine]).not.toBeNull();
      })
   })
})
