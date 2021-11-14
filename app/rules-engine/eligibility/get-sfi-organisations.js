const { getOrganisations } = require('../../legacy/organisations')
const runSFIEligibilityRules = require('../rule-sets/sfi-eligibility')

async function getSFIEligibleOrganisations (facts) {
  const eligibleOrganisations = []
  const organisations = getOrganisations(facts.crn, ['Amend'])
  for (const organisation of organisations) {
    const result = await runSFIEligibilityRules(organisation)
    if (!result.failureEvents.length) {
      eligibleOrganisations.push(organisation)
    }
  }
  return eligibleOrganisations
}

module.exports = getSFIEligibleOrganisations
