const config            = require(`../config/config.json`)
const dictionary        = require(`../dictionary`)
const V0Engine          = require(`../models/v0`)
const WordleSimulator   = require(`./index`)


const simulator = new WordleSimulator(dictionary)
const engine = new V0Engine(dictionary)
let guess = {reducedDictionaryLength: null}
let result = {pastGuesses: []}

// simulator.setTargetWord(`baddy`)


// Introductions
console.log(`Running Wordle simulation...`)
console.log(`Dictionary:                     ${config.dictionary.enabled}`)
console.log(`Number of words:                ${dictionary.length.toLocaleString()}`)
console.log(`Engine:                         ${config.engines.enabled}`)
console.log(`Mode:                           ${config.engines.mode}`)
console.log(`Target word:                    ${simulator.targetWord}`)
console.log(`Allowed attempts:               ${config.maxGuesses}`)

for (let round = 1; round <= config.maxGuesses; round++) {
   console.log(`\nRound ${round}`)
   
   guess = engine.makeGuess(result.pastGuesses, {oldReducedDictionaryLength: guess.reducedDictionaryLength})
   result = simulator.guess(guess.plain.nextBestGuess)

   console.log(result.pastGuesses)
   console.log(result.message)
   if(result.message === `Correct!`) return
}
console.log(`Failed - out of guesses.`)
