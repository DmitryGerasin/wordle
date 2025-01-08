const {
   dictionary: {
      enabled,
      available,
   },
}                       = require(`../config/config.json`)

const dictionary = require(`./compiled/${enabled}`)

module.exports = dictionary