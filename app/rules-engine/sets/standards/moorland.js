const getRulesEngine = require('../../engine')
const { noPendingChanges, isMoorlandLandCover } = require('../../rules/compatibility')

const runMoorlandParcelRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('pendingChange', async (params, almanac) => {
    return false
  })

  engine.addRule(noPendingChanges)
  return engine.run(facts)
}

const runMoorlandLandCoverRules = async (facts) => {
  const engine = getRulesEngine()
  engine.addRule(isMoorlandLandCover)
  return engine.run(facts)
}

module.exports = {
  runMoorlandParcelRules,
  runMoorlandLandCoverRules
}
