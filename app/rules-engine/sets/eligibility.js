const getRulesEngine = require('../engine')
const { getBpsEntitlements, getBpsEligibleLand } = require('../../legacy/bps')
const { bpsEntitlements, bpsLand } = require('../rules')
const ELIGIBLE_LAND_CAP = 500

const runEligibilityRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('bpsEntitlements', async (params, almanac) => {
    return getBpsEntitlements(facts.sbi)
  })

  engine.addFact('bpsEligibleLand', async (params, almanac) => {
    return getBpsEligibleLand(facts.organisationId, facts.callerId, ELIGIBLE_LAND_CAP)
  })

  engine.addRule(bpsEntitlements)
  engine.addRule(bpsLand)

  return engine.run(facts)
}

module.exports = runEligibilityRules
