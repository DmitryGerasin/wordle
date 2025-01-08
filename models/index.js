const config            = require(`../config/config.json`)

const models = {
   v0: require(`./v0`),
}


// module.exports = models[config.engines.enabled]
module.exports = models.v0