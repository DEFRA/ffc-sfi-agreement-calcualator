const getRulesEngine = require('../../engine')
const { arableSoilLandCover, pendingChange } = require('../../rules/compatibility')

const runArableSoilParcelRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('pendingChange', async (params, almanac) => {
    return false
  })

  engine.addRule(pendingChange)
  return engine.run(facts)
}

const runArableSoilLandCoverRules = async (facts) => {
  const engine = getRulesEngine()
  engine.addRule(arableSoilLandCover)
  return engine.run(facts)
}

module.exports = {
  runArableSoilParcelRules,
  runArableSoilLandCoverRules
}
