const { Engine } = require('json-rules-engine')
const { getBpsEntitlements, getBpsEligibleLand } = require('../../legacy/bps')
const report = require('../report')
const { bpsEntitlements, bpsLand } = require('../rules')
const ELIGIBLE_LAND_CAP = 500

async function runEligibilityRules (organisation) {
  const engine = new Engine()

  engine.addFact('bpsEntitlements', async (params, almanac) => {
    return getBpsEntitlements(organisation.sbi)
  })

  engine.addFact('bpsEligibleLand', async (params, almanac) => {
    return getBpsEligibleLand(organisation.organisationId, organisation.callerId, ELIGIBLE_LAND_CAP)
  })

  engine.addRule(bpsEntitlements)
  engine.addRule(bpsLand)

  engine.on('success', async (event, almanac, ruleResult) => {
    almanac.addRuntimeFact('sfiEligible', true)
    report(event, almanac, ruleResult)
  })

  engine.on('failure', async (event, almanac, ruleResult) => {
    almanac.addRuntimeFact('sfiEligible', false)
    report(event, almanac, ruleResult)
  })

  return engine.run(organisation)
}

module.exports = runEligibilityRules
