const getRulesEngine = require('../../engine')
const { noPendingChanges, isArableSoilLandCover } = require('../../rules/compatibility')

const runArableSoilParcelRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('pendingChange', async (params, almanac) => {
    return false
  })

  engine.addRule(noPendingChanges)
  return engine.run(facts)
}

const runArableSoilLandCoverRules = async (facts) => {
  const engine = getRulesEngine()
  engine.addRule(isArableSoilLandCover)
  return engine.run(facts)
}

module.exports = {
  runArableSoilParcelRules,
  runArableSoilLandCoverRules
}
