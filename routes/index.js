const { 
   makeRegex,
}                       = require(`../tools/regex.js`)
const getReducedDictionary = require(`../tools/reduceDictionary.js`)
const makeGuess         = require(`../models`)
const express           = require(`express`)
const router            = express.Router()
const {
   showPastGuesses,
}                       = require(`../config/config.json`)

/*============================================================================
= = = = = = = = = = = = = = = = = = ROUTES = = = = = = = = = = = = = = = = = =
============================================================================*/

router.get(`/get-help`, getHelp)

module.exports = router


/*============================================================================
= = = = = = = = = = = = = = = = = FUNCTIONS = = = = = = = = = = = = = = = = =
============================================================================*/

function getHelp(req, res) {
   try {
      const pastGuesses = JSON.parse(req.query.pastGuesses)
      if(showPastGuesses) console.log(pastGuesses)

      const dictionary        = require(`../dictionary`)

      // 1. Get reduced dictionary based on past guesses
      const reducedDictionary = getReducedDictionary(dictionary, pastGuesses)

      // 2. Find the word that matches the best
      const {weighted, plain} = makeGuess(dictionary, pastGuesses, reducedDictionary)
      

      console.log(`Best weighted guess: ${weighted.nextBestGuess} with score: ${weighted.score}`)
      console.log(`Best plain guess: ${plain.nextBestGuess} with score: ${plain.score}`)
      res.send(`Best weighted guess: ${weighted.nextBestGuess} with score: ${weighted.score}<br>Best plain guess: ${plain.nextBestGuess} with score: ${plain.score}`)


   } catch (error) {
      res.send(error)
   }

   // if(showFinalAnswer) console.log(weighted, plain)
   // res.send({
   //    result: {
   //       weighted: weighted,
   //       plain: plain,
   //    },
   //    wordStructure: wordStructure,
   //    wrongGuesses: wrongGuesses,
   // })
}