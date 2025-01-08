const cliProgress       = require(`cli-progress`)
const config            = require(`../config/config.json`)
const dictionary        = require(`../dictionary`)
const fs                = require(`fs`)
const V0Engine          = require(`../models/v0`)
const WordleSimulator   = require(`../wordleSimulator`)
const { fips } = require("crypto")

// Introductions and reminders
console.log(`Preparing to run simulations on all dictionary words...`)
console.log(`IMPORTANT: Ensure all console logging in the engine and simulator is disabled for optimal performance.\n`)

const runBenchmark = () => {
   console.log(`Starting simulations...`)

   const results = []
   const simulator = new WordleSimulator(dictionary)
   const engine = new V0Engine(dictionary)

   // Set up progress bar
   const opt = {
      format: `progress [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} | Current word: {word} | {stats}`,
      stopOnComplete: true,
      clearOnComplete: true,
      barsize: 50,
      etaBuffer: 500,
   }
   const progBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_grey)
   progBar.start(dictionary.length, 0, {word: ``})

   // Loop over the dictionary, guessing each word and saving the result
   for (let i = 0; i < dictionary.length; i++) {
      const [word, weight] = dictionary[i]
      let guess = { reducedDictionaryLength: null }
      let result = { pastGuesses: [] }
      let success = false
      
      simulator.setTargetWord(word) // Set the target word for this run

      for (let round = 1; round <= config.maxGuesses; round++) {
         guess = engine.makeGuess(result.pastGuesses, { oldReducedDictionaryLength: guess.reducedDictionaryLength })
         result = simulator.guess(guess.plain.nextBestGuess)

         if (result.message === `Correct!`) {
            success = true
            results.push([word, weight, round]) // Log success
            break
         }
      }

      if (!success) results.push([word, weight, 0]) // Log failure
      
      if(i % 50) {
         const stats = {fail:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0}
         results.forEach(([word, weight, round]) => {
            if(round === 0) {
               stats.fail++
            } else {
               stats[round]++
            }
         })
         progBar.update(i+1, {word: word, stats: JSON.stringify(stats)})
      } else {
         progBar.update(i+1, {word: word})
      }
   }

   // Write results to a JSON file
   const outputFile = `simulation_results.json`
   fs.writeFileSync(outputFile, JSON.stringify(results, null, 2))
   console.log(`Simulations complete! Results saved to: ${outputFile}`)
}

setTimeout(runBenchmark, 3000) // 3-second delay