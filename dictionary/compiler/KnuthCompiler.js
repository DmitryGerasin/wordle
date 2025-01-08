const fs                = require(`fs`)
const path              = require(`path`)
const weighted64k       = require(`../compiled/fiveLetters_46k.json`)

// Set these 2 values
const KnuthDictionary   = require(`../downloaded/wordleDictionary_2k.json`)
const destinationFile = `../compiled/wordle_2k.json`

const outputPath = path.join(__dirname, destinationFile)

// Create a lookup map for weights from the larger dictionary
const weightMap = new Map(weighted64k.map(([word, weight]) => [word, weight]))

// Compile the new weighted dictionary
let outputString = `[\n`
for (let i = 0; i < KnuthDictionary.length; i++) {
   const word = KnuthDictionary[i]
   const weight = weightMap.get(word) || 1 // Default weight is 1 if not found
   const lastEntry = i === KnuthDictionary.length - 1

   outputString += `   ["${word}", ${weight}]${lastEntry? ``:`,`}\n`
}
outputString += `]`

// Save the compiled dictionary to the destination file
fs.writeFileSync(outputPath, outputString, `utf-8`)