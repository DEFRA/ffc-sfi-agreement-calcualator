const { getEntitlements, getEligibleLand } = require('../data/bps')
const getRulesEngine = require('../engine')
const { bpsEntitlements, bpsLand } = require('../rules/eligibility')

const runValidationRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('bpsEntitlements', async (params, almanac) => {
    return getEntitlements(facts.sbi)
  })

  engine.addFact('bpsEligibleHectares', async (params, almanac) => {
    return getEligibleLand(facts.sbi)
  })

  engine.addRule(bpsEntitlements)
  engine.addRule(bpsLand)

  return engine.run(facts)
}

module.exports = runValidationRules
