const { getBpsEntitlements, getBpsEligibleLandInHectares } = require('../data/bps')
const getRulesEngine = require('../engine')
const { bpsEntitlements, bpsLand } = require('../rules')

const runValidationRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('bpsEntitlements', async (params, almanac) => {
    return getBpsEntitlements(facts.sbi)
  })

  engine.addFact('bpsEligibleHectares', async (params, almanac) => {
    return getBpsEligibleLandInHectares(facts.sbi)
  })

  engine.addRule(bpsEntitlements)
  engine.addRule(bpsLand)

  return engine.run(facts)
}

module.exports = runValidationRules
