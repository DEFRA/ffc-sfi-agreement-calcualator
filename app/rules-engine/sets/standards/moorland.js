const getRulesEngine = require('../../engine')
const { noPendingChanges } = require('../../rules/compatibility')

const runMoorlandParcelRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('pendingChange', async (params, almanac) => {
    return false
  })

  engine.addRule(noPendingChanges)
  return engine.run(facts)
}

module.exports = {
  runMoorlandParcelRules
}
