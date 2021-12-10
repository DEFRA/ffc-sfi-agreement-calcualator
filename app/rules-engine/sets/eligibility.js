const getRulesEngine = require('../engine')
const { getEligibleLand } = require('../../legacy/bps')
const { getEntitlements } = require('../../legacy/entitlements')
const { hasSufficientBpsEntitlements, hasSufficientBpsLand } = require('../rules/eligibility')
const ELIGIBLE_LAND_CAP = 500

const runEligibilityRules = async (facts) => {
  const engine = getRulesEngine()

  engine.addFact('bpsEntitlements', async (params, almanac) => {
    return getEntitlements(facts.organisationId, facts.callerId)
  })

  engine.addFact('bpsEligibleLand', async (params, almanac) => {
    return getEligibleLand(facts.organisationId, facts.callerId, ELIGIBLE_LAND_CAP)
  })

  engine.addRule(hasSufficientBpsEntitlements)
  engine.addRule(hasSufficientBpsLand)

  return engine.run(facts)
}

module.exports = runEligibilityRules
