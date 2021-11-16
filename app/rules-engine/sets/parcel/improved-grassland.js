const getRulesEngine = require('../../engine')
const { improvedGrasslandLandCover, pendingChange } = require('../../rules/compatibility')

const runImprovedGrasslandParcelRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('pendingChange', async (params, almanac) => {
    return false
  })

  engine.addRule(pendingChange)
  return engine.run(facts)
}

const runImprovedGrasslandLandCoverRules = async (facts) => {
  const engine = getRulesEngine()
  engine.addRule(improvedGrasslandLandCover)
  return engine.run(facts)
}

module.exports = {
  runImprovedGrasslandParcelRules,
  runImprovedGrasslandLandCoverRules
}
