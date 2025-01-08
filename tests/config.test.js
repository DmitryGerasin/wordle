const config            = require(`../config/config.json`)

describe(`Config Tests`, () => {
   test(`Dictionary enabled value is in available list`, () => {
      const { enabled, available } = config.dictionary
      expect(available).toContain(enabled)
   })

   test(`Engines enabled value is in available list`, () => {
      const { enabled, available } = config.engines
      expect(available).toContain(enabled)
   })
})