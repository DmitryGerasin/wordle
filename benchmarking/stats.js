// const simulationResults = require(`../v0_x_2k_simulation_results.json`)
// const simulationResults = require(`../v0_x_6k_simulation_results.json`)
// const simulationResults = require(`../v0_x_46k_simulation_results.json`)
const simulationResults = require(`../v0_x_10_simulation_results.json`)

const totalCount = simulationResults.length
const breakdown = [
   ["1", 0],
   ["2", 0],
   ["3", 0],
   ["4", 0],
   ["5", 0],
   ["6", 0],
   ["Failed", 0],
]
simulationResults.forEach(entry => {
   const [word, weight, round] = entry
   if(round === 0) {
      breakdown[6][1]++
   } else {
      breakdown[round - 1][1]++
   }
})
breakdown.forEach(entry => {
   entry.push( `${Math.round(10000 * entry[1] / totalCount)/100}%` )
})

console.log(`Stats:`, breakdown)
console.log(`Success rate:`, `${Math.round(10000 * (totalCount - breakdown[6][1]) / totalCount)/100}%`)