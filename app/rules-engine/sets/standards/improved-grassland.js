const getRulesEngine = require('../../engine')
const { isImprovedGrasslandLandCover, noPendingChanges } = require('../../rules/compatibility')

const runImprovedGrasslandParcelRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('pendingChange', async (params, almanac) => {
    return false
  })

  engine.addRule(noPendingChanges)
  return engine.run(facts)
}

const runImprovedGrasslandLandCoverRules = async (facts) => {
  const engine = getRulesEngine()
  engine.addRule(isImprovedGrasslandLandCover)
  return engine.run(facts)
}

module.exports = {
  runImprovedGrasslandParcelRules,
  runImprovedGrasslandLandCoverRules
}
