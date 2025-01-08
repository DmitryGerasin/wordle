const cliProgress       = require(`cli-progress`)
const config            = require(`../config/config.json`)
const dictionary        = require(`../dictionary`)
const {
   extractDictionaryMetadata,
   locateMatchingMetadataEntry,
}                       = require(`./dictionaryTools`)
const fs                = require(`fs`)
const metadata          = require(`../dictionary/dictionaryMetadata.json`)
const path              = require(`path`)

/** Absolute path to the dictionary metadata file. */
const outputPath = path.join(__dirname, `../dictionary/dictionaryMetadata.json`)


const ensureDictionaryHasMetadata = (metadata, dictionary) => {
   const currentMetadata = extractDictionaryMetadata(dictionary)
   const matchingEntry = locateMatchingMetadataEntry(metadata, currentMetadata)

   // The current dictionary already seems to have an entry in the metadata
   if(matchingEntry.length === 1) return metadata

   // matchingEntry.length === 0, meaning no entry so far, we need to create one
   currentMetadata.optimalFirstGuess = {}
   config.engines.available.forEach(engine => {
      currentMetadata.optimalFirstGuess[engine] = null
   })
   metadata.push(currentMetadata)

   fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 3), `utf-8`)

   return metadata
}

/**
 * 
 * @param {String} engineName - Engine name.
 * @param {JSON} dictionary - The Weighted dictionary object.
 * @returns 
 */
const generateFirstGuess = (engineName, dictionary) => {

   const Engine = require(`../models/${engineName}`)
   // const Engine = require(`../models/v0`)
   const engine = new Engine(dictionary)

   // Set up progress bar
   const opt = {
      format: `progress [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} | Current word: {word}`,
      stopOnComplete: true,
      clearOnComplete: true,
      barsize: 75,
      etaBuffer: 250,
   }
   const progBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_grey)
   progBar.start(dictionary.length, 0, {word: ``})

   const {weighted, plain} = engine.makeGuess([], {progBar:progBar, makeFirstGuess:true})
   console.log(`Solution:`, weighted, plain)

   return {weighted, plain}
}

const ensureAllEnginesHaveFirstGuessEntries = (metadata, engineList) => {
   const currentMetadata = extractDictionaryMetadata(dictionary)
   const matchingEntry = locateMatchingMetadataEntry(metadata, currentMetadata)

   // Ensure that each engine has an entry in `optimalFirstGuess` corresponding to its name and a value is associated with it
   engineList.forEach(engineName => {
      // If first guess is set up for this engine
      if( 
         matchingEntry[0].optimalFirstGuess.hasOwnProperty(engineName) && // key is set
         Boolean(matchingEntry[0].optimalFirstGuess[engineName]) // Value is truthy (not empty string, not null)
      ) {
         console.log(`Every available engine has a first guess entry for the current dictionary.`)
         return
      }

      // If first guess is not set up for this engine
      console.log(`The ${engineName} engine does not have a first guess entry for the current dictionary. Generating...`)
      
      const {weighted, plain} = generateFirstGuess(engineName, dictionary)
      matchingEntry[0].optimalFirstGuess[engineName] = {weighted, plain}
      
      console.log(`First guess set to ${JSON.stringify({weighted, plain})} for the ${engineName} engine.`)
   })

   // Update the the metadata in the JSON file
   fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 3), `utf-8`)
   
   return metadata
}



const updateDictionaryMetadata = () => {
   // 1. Make sure the current dictionary has an entry in the metadata
   const metadataWithCurrentDictionaryEntry = ensureDictionaryHasMetadata(metadata, dictionary)

   // 2. Make sure each engine has an entry for the first guess
   const completeMetadata = ensureAllEnginesHaveFirstGuessEntries(metadataWithCurrentDictionaryEntry, config.engines.available)
}
updateDictionaryMetadata()
