const dictionary = require(`../dictionary/compiled/fiveLetters_46k.json`)

function getTopWords(weightedDictionary, n) {
   // Sort the dictionary by weight in descending order
   const sortedDictionary = weightedDictionary.sort((a, b) => b[1] - a[1])

   // Extract the top n words
   return sortedDictionary.slice(0, n)
}

console.log(getTopWords(dictionary, 10))