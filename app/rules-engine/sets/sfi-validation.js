const { Engine } = require('json-rules-engine')
const { getBpsEntitlements, getBpsEligibleLandInHectares } = require('../data/bps')
const render = require('../render')
const { bpsEntitlements, bpsLand } = require('../rules/sfi')

async function runSFIValidationRules (organisation) {
  const engine = new Engine()

  engine.addFact('bpsEntitlements', (params, almanac) => {
    return getBpsEntitlements(organisation.sbi)
  })

  engine.addFact('bpsEligibleHectares', (params, almanac) => {
    return getBpsEligibleLandInHectares(organisation.sbi)
  })

  engine.addRule(bpsEntitlements)
  engine.addRule(bpsLand)

  engine.on('success', async (event, almanac, ruleResult) => {
    almanac.addRuntimeFact('sfiValidated', true)
    const sbi = await almanac.factValue('sbi')
    render(`SBI ${sbi} passed SFI rule: ${event.params.message}`, ruleResult)
  })

  engine.on('failure', async (event, almanac, ruleResult) => {
    almanac.addRuntimeFact('sfiValidated', false)
    const sbi = await almanac.factValue('sbi')
    render(`SBI ${sbi} failed SFI rule: ${ruleResult.name} - `, ruleResult)
  })

  return engine.run(organisation)
}

module.exports = runSFIValidationRules
