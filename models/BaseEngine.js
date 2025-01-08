
const config            = require(`../config/config.json`)
const metadata          = require(`../dictionary/dictionaryMetadata.json`)
const { 
   extractDictionaryMetadata, 
   locateMatchingMetadataEntry,
}                       = require(`../tools/dictionaryTools`)
const {
   getReducedDictionary,
}                       = require(`../tools/reduceDictionary`)


/**
 * Base class for word-guessing engines.
 * All engines should extend this class and implement their unique guessing logic.
 */
class BaseEngine {
   /**
    * Constructor for the BaseEngine.
    * @param {Array} dictionary - The full dictionary of words.
    */
   constructor(dictionary) {
      if (!Array.isArray(dictionary) || dictionary.length === 0) {
         throw new Error(`A valid dictionary must be provided.`)
      }

      this.dictionary = dictionary
      this.dictionaryLength = dictionary.length
      this.engineName = config.engines.enabled

      this.metadata = extractDictionaryMetadata(this.dictionary)
      this.matchingMetadata = locateMatchingMetadataEntry(metadata, this.metadata)

      this.getReducedDictionary = getReducedDictionary
   }

   /**
    * Retrieves the first guess based on pre-calculated metadata.
    * Throws an error if the metadata is incomplete.
    * @returns {Object} The first guess (plain and weighted).
    */
   firstGuess() {
      const precalculatedResult = this.matchingMetadata[0]?.optimalFirstGuess?.[this.engineName]

      if (precalculatedResult?.plain?.nextBestGuess && precalculatedResult?.weighted?.nextBestGuess) {
         return precalculatedResult
      } else {
         throw new Error(
            `First guess has not been pre-calculated for the current engine (${this.engineName}) using the current dictionary (${config.dictionary.enabled}).\n` +
            `Calculating this will take time. Please run the command \`npm run update-meta\` to generate the required metadata.`
         )
      }
   }

   /**
    * Abstract method to make a guess based on the current state of the game.
    * To be implemented by subclasses.
    * @abstract
    */
   makeGuess() {
      throw new Error(`makeGuess method must be implemented by subclasses.`)
   }
}


module.exports = BaseEngine
